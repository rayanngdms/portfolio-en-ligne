"""Extract every image drawn on each page of a PDF, with its position on the page.
Stdlib only. Usage: extract.py file.pdf outdir [--dump]
"""
import json, os, re, struct, sys, zlib

src, outdir = sys.argv[1], sys.argv[2]
dump = '--dump' in sys.argv
os.makedirs(outdir, exist_ok=True)
data = open(src, 'rb').read()

objs = {}
for m in re.finditer(rb'(?<![\d])(\d+) 0 obj\b', data):
    n = int(m.group(1))
    start = m.end()
    s = data.find(b'stream', start)
    e = data.find(b'endobj', start)
    if s != -1 and s < e and data[s - 3:s] != b'end':
        objs[n] = (data[start:s], s)
    else:
        objs[n] = (data[start:e], None)


def head(n):
    return objs[n][0]


def ref(d, key):
    m = re.search(rb'/' + key + rb'\s+(\d+) 0 R', d)
    return int(m.group(1)) if m else None


def num(d, key):
    m = re.search(rb'/' + key + rb'\s+(\d+)\b(?! 0 R)', d)
    if m:
        return int(m.group(1))
    r = ref(d, key)
    return int(head(r).strip()) if r else None


def stream(n):
    h, s = objs[n]
    p = s + len(b'stream')
    if data[p:p + 2] == b'\r\n':
        p += 2
    elif data[p:p + 1] == b'\n':
        p += 1
    return data[p:p + num(h, b'Length')]


def subdict(d, key):
    """inline dict after /key, or the referenced object's dict"""
    m = re.search(rb'/' + key + rb'\s*<<', d)
    if m:
        i, depth = m.end(), 1
        while depth and i < len(d):
            if d[i:i + 2] == b'<<':
                depth += 1; i += 2
            elif d[i:i + 2] == b'>>':
                depth -= 1; i += 2
            else:
                i += 1
        return d[m.end():i - 2]
    r = ref(d, key)
    return head(r) if r else b''


def page_order():
    root = None
    for n, (h, s) in objs.items():
        if b'/Type /Catalog' in h:
            root = ref(h, b'Pages')
    out = []

    def walk(n):
        h = head(n)
        if b'/Type /Pages' in h:
            kids = re.search(rb'/Kids\s*\[(.*?)\]', h, re.S).group(1)
            for k in re.findall(rb'(\d+) 0 R', kids):
                walk(int(k))
        else:
            out.append(n)
    walk(root)
    return out


def mul(m, n):
    a, b, c, d, e, f = m
    A, B, C, D, E, F = n
    return (a * A + b * C, a * B + b * D, c * A + d * C, c * B + d * D,
            e * A + f * C + E, e * B + f * D + F)


def contents(h):
    m = re.search(rb'/Contents\s*\[(.*?)\]', h, re.S)
    refs = [int(x) for x in re.findall(rb'(\d+) 0 R', m.group(1))] if m else [ref(h, b'Contents')]
    out = b''
    for r in refs:
        raw = stream(r)
        if b'/FlateDecode' in head(r):
            raw = zlib.decompress(raw)
        out += raw + b'\n'
    return out


def draws(content, res, ctm, found):
    xo = subdict(res, b'XObject')
    names = {m.group(1): int(m.group(2)) for m in re.finditer(rb'/([^\s/]+)\s+(\d+) 0 R', xo)}
    stack, toks = [], content.split()
    for i, t in enumerate(toks):
        if t == b'q':
            stack.append(ctm)
        elif t == b'Q':
            if stack:
                ctm = stack.pop()
        elif t == b'cm':
            try:
                ctm = mul(tuple(float(x) for x in toks[i - 6:i]), ctm)
            except ValueError:
                pass
        elif t == b'Do':
            n = names.get(toks[i - 1][1:])
            if n is None:
                continue
            h = head(n)
            if re.search(rb'/Subtype\s*/Image', h):
                found.append((n, ctm))
            elif re.search(rb'/Subtype\s*/Form', h):
                raw = stream(n)
                if b'/FlateDecode' in h:
                    raw = zlib.decompress(raw)
                mm = re.search(rb'/Matrix\s*\[([^\]]+)\]', h)
                c2 = mul(tuple(float(x) for x in mm.group(1).split()), ctm) if mm else ctm
                draws(raw, subdict(h, b'Resources') or res, c2, found)


def png(path, w, h, raw, channels):
    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    stride = w * channels
    rows = b''.join(b'\0' + raw[y * stride:(y + 1) * stride] for y in range(h))
    ct = {1: 0, 3: 2, 4: 6}[channels]
    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, ct, 0, 0, 0))
                + chunk(b'IDAT', zlib.compress(rows, 6)) + chunk(b'IEND', b''))


def unpredict(raw, w, channels):
    stride = w * channels
    out, prev = bytearray(), bytearray(stride)
    for y in range(len(raw) // (stride + 1)):
        ft = raw[y * (stride + 1)]
        row = bytearray(raw[y * (stride + 1) + 1:(y + 1) * (stride + 1)])
        for x in range(stride):
            a = row[x - channels] if x >= channels else 0
            b = prev[x]
            c = prev[x - channels] if x >= channels else 0
            if ft == 1:
                row[x] = (row[x] + a) & 255
            elif ft == 2:
                row[x] = (row[x] + b) & 255
            elif ft == 3:
                row[x] = (row[x] + (a + b) // 2) & 255
            elif ft == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                row[x] = (row[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        out += row
        prev = row
    return bytes(out)


def flate_pixels(n):
    h = head(n)
    w, hh = num(h, b'Width'), num(h, b'Height')
    raw = zlib.decompress(stream(n))
    channels = 1 if b'/DeviceGray' in h else 3
    if len(raw) == (w * channels + 1) * hh:
        raw = unpredict(raw, w, channels)
    return w, hh, channels, raw


manifest, saved, alpha = [], {}, {}
for pi, pn in enumerate(page_order(), 1):
    ph = head(pn)
    mb = [float(x) for x in re.search(rb'/MediaBox\s*\[([^\]]+)\]', ph).group(1).split()]
    found = []
    draws(contents(ph), subdict(ph, b'Resources'), (1, 0, 0, 1, 0, 0), found)
    for k, (n, ctm) in enumerate(found, 1):
        h = head(n)
        w, hh = num(h, b'Width'), num(h, b'Height')
        a, b, c, d, e, f = ctm
        xs = [e, e + a, e + c, e + a + c]
        ys = [f, f + b, f + d, f + b + d]
        box = [round(min(xs)), round(mb[3] - max(ys)), round(max(xs) - min(xs)), round(max(ys) - min(ys))]
        dct = b'/DCTDecode' in h
        smask = ref(h, b'SMask')
        entry = dict(page=pi, order=k, obj=n, w=w, h=hh, box=box, kind='jpg' if dct else 'png',
                     smask=bool(smask), bytes=num(h, b'Length'))
        if n not in saved and not dump:
            name = 'p%02d-%02d-obj%d.%s' % (pi, k, n, 'jpg' if dct else 'png')
            path = os.path.join(outdir, name)
            if dct:
                open(path, 'wb').write(stream(n))
            else:
                pw, phh, ch, raw = flate_pixels(n)
                if smask and ch == 3:
                    mw, mh, mc, mraw = flate_pixels(smask)
                    if (mw, mh, mc) == (pw, phh, 1):
                        rgba = bytearray(pw * phh * 4)
                        rgba[0::4], rgba[1::4], rgba[2::4], rgba[3::4] = raw[0::3], raw[1::3], raw[2::3], mraw
                        raw, ch = bytes(rgba), 4
                png(path, pw, phh, raw, ch)
            saved[n] = name
            if smask and dct:
                try:
                    mw, mh, mc, mraw = flate_pixels(smask)
                    lut = bytes(1 if v < 128 else 0 for v in range(256))
                    frac = sum(mraw.translate(lut)) / max(1, len(mraw))
                    alpha[n] = round(frac, 4)
                    if frac > 0.04:
                        png(os.path.join(outdir, 'mask-obj%d.png' % n), mw, mh, mraw, 1)
                except Exception as ex:
                    alpha[n] = 'err %s' % ex
        entry['file'] = saved.get(n)
        entry['alpha'] = alpha.get(n)
        manifest.append(entry)
        print('p%02d #%02d obj%-5d %5dx%-5d %s%s  box=%s  %dk' % (
            pi, k, n, w, hh, entry['kind'], '+mask' if smask else '', box, entry['bytes'] // 1024))

json.dump(manifest, open(os.path.join(outdir, 'manifest.json'), 'w'), indent=1)
