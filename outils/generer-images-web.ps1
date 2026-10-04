param([string]$Src, [string]$Dest)

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class Img {
    static Bitmap Load(string path, string mask, Color bg) {
        using (var src = new Bitmap(path)) {
            var bmp = new Bitmap(src.Width, src.Height, PixelFormat.Format24bppRgb);
            using (var g = Graphics.FromImage(bmp)) { g.Clear(bg); }
            if (string.IsNullOrEmpty(mask)) {
                using (var g = Graphics.FromImage(bmp)) g.DrawImage(src, 0, 0, src.Width, src.Height);
                return bmp;
            }
            using (var m0 = new Bitmap(mask))
            using (var m = new Bitmap(src.Width, src.Height, PixelFormat.Format24bppRgb))
            using (var s = new Bitmap(src.Width, src.Height, PixelFormat.Format24bppRgb)) {
                using (var g = Graphics.FromImage(m)) { g.InterpolationMode = InterpolationMode.HighQualityBicubic; g.DrawImage(m0, 0, 0, src.Width, src.Height); }
                using (var g = Graphics.FromImage(s)) g.DrawImage(src, 0, 0, src.Width, src.Height);
                var r = new Rectangle(0, 0, src.Width, src.Height);
                var ds = s.LockBits(r, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
                var dm = m.LockBits(r, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
                var dd = bmp.LockBits(r, ImageLockMode.WriteOnly, PixelFormat.Format24bppRgb);
                int n = ds.Stride * src.Height;
                var bs = new byte[n]; var bm = new byte[n]; var bd = new byte[n];
                Marshal.Copy(ds.Scan0, bs, 0, n); Marshal.Copy(dm.Scan0, bm, 0, n);
                byte[] bgc = { bg.B, bg.G, bg.R };
                for (int y = 0; y < src.Height; y++) {
                    int o = y * ds.Stride;
                    for (int x = 0; x < src.Width; x++) {
                        int i = o + x * 3; int a = bm[i];
                        for (int c = 0; c < 3; c++) bd[i + c] = (byte)((bs[i + c] * a + bgc[c] * (255 - a)) / 255);
                    }
                }
                Marshal.Copy(bd, 0, dd.Scan0, n);
                s.UnlockBits(ds); m.UnlockBits(dm); bmp.UnlockBits(dd);
            }
            return bmp;
        }
    }

    static void Save(Bitmap full, int max, long quality, string dest) {
        double k = Math.Min(1.0, (double)max / Math.Max(full.Width, full.Height));
        int w = Math.Max(1, (int)Math.Round(full.Width * k)), h = Math.Max(1, (int)Math.Round(full.Height * k));
        using (var o = new Bitmap(w, h, PixelFormat.Format24bppRgb)) {
            using (var g = Graphics.FromImage(o)) {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                using (var ia = new ImageAttributes()) {
                    ia.SetWrapMode(WrapMode.TileFlipXY);
                    g.DrawImage(full, new Rectangle(0, 0, w, h), 0, 0, full.Width, full.Height, GraphicsUnit.Pixel, ia);
                }
            }
            ImageCodecInfo codec = null;
            foreach (var c in ImageCodecInfo.GetImageEncoders()) if (c.MimeType == "image/jpeg") codec = c;
            var p = new EncoderParameters(1);
            p.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
            o.Save(dest, codec, p);
        }
    }

    public static string Make(string path, string mask, string bgHex, string dest) {
        using (var full = Load(path, mask, ColorTranslator.FromHtml(bgHex))) {
            Save(full, 2600, 86L, dest + ".jpg");
            Save(full, 1100, 82L, dest + ".sm.jpg");
            return full.Width + "x" + full.Height;
        }
    }
}
'@

# obj number in the PDF -> path in the site (without extension), optional background for transparent sources
$map = @(
    @(1367, 'profil/portrait'),
    @(1891, 'projets/01-studio-caen/rendus/rendu-01'),
    @(2231, 'projets/01-studio-caen/rendus/rendu-02'),
    @(2235, 'projets/01-studio-caen/rendus/rendu-03'),
    @(2357, 'projets/01-studio-caen/plans/plan-existant', '#FFFFFF'),
    @(2361, 'projets/01-studio-caen/plans/plan-cote'),
    @(2365, 'projets/01-studio-caen/plans/plan-texture', '#FFFFFF'),
    @(2369, 'projets/01-studio-caen/moodboard/moodboard'),
    @(2689, 'projets/02-vill-arborea/rendus/rendu-01'),
    @(2681, 'projets/02-vill-arborea/rendus/rendu-02'),
    @(2685, 'projets/02-vill-arborea/rendus/rendu-03'),
    @(1887, 'projets/02-vill-arborea/rendus/rendu-04'),
    @(2881, 'projets/02-vill-arborea/plans/plan-avant'),
    @(2873, 'projets/02-vill-arborea/plans/plan-apres'),
    @(2877, 'projets/02-vill-arborea/plans/plan-cote'),
    @(2869, 'projets/02-vill-arborea/moodboard/moodboard'),
    @(1879, 'projets/03-salon-modern/rendus/rendu-01'),
    @(3173, 'projets/03-salon-modern/rendus/rendu-02'),
    @(3177, 'projets/03-salon-modern/rendus/rendu-03'),
    @(1867, 'projets/04-arret-bus-cotonou/rendus/rendu-01'),
    @(3427, 'projets/04-arret-bus-cotonou/rendus/rendu-02'),
    @(3431, 'projets/04-arret-bus-cotonou/rendus/rendu-03'),
    @(3607, 'projets/04-arret-bus-cotonou/plans/facade', '#FFFFFF'),
    @(3599, 'projets/04-arret-bus-cotonou/plans/illustration-jour', '#FFFFFF'),
    @(3603, 'projets/04-arret-bus-cotonou/plans/illustration-nuit', '#FFFFFF'),
    @(3595, 'projets/04-arret-bus-cotonou/moodboard/moodboard'),
    @(1863, 'projets/05-cove-beach-hotel/rendus/rendu-01'),
    @(3857, 'projets/05-cove-beach-hotel/rendus/rendu-02'),
    @(3861, 'projets/05-cove-beach-hotel/rendus/rendu-03'),
    @(4031, 'projets/05-cove-beach-hotel/plans/plan-general', '#FFFFFF'),
    @(4023, 'projets/05-cove-beach-hotel/plans/plan-cote', '#FFFFFF'),
    @(4019, 'projets/05-cove-beach-hotel/plans/plan-texture', '#FFFFFF'),
    @(4027, 'projets/05-cove-beach-hotel/moodboard/moodboard', '#FFFFFF'),
    @(4257, 'projets/06-moringa-and-co/rendus/rendu-01'),
    @(4253, 'projets/06-moringa-and-co/rendus/rendu-02'),
    @(1859, 'projets/06-moringa-and-co/rendus/rendu-03'),
    @(4589, 'projets/07-serre-inversee/rendus/rendu-01'),
    @(4581, 'projets/07-serre-inversee/rendus/rendu-02', '#F6EFE6'),
    @(4585, 'projets/07-serre-inversee/rendus/rendu-03'),
    @(1871, 'projets/07-serre-inversee/rendus/rendu-04'),
    @(4609, 'projets/07-serre-inversee/plans/zoning'),
    @(4601, 'projets/07-serre-inversee/plans/coupe', '#FFFFFF'),
    @(4605, 'projets/07-serre-inversee/plans/visite-vr'),
    @(4597, 'projets/07-serre-inversee/moodboard/moodboard'),
    @(1883, 'projets/08-japandi-master-suite/rendus/rendu-01'),
    @(260,  'projets/08-japandi-master-suite/rendus/rendu-02'),
    @(5047, 'projets/08-japandi-master-suite/rendus/rendu-03')
)

foreach ($m in $map) {
    $file = Get-ChildItem $Src -Filter "*-obj$($m[0]).jpg" | Select-Object -First 1
    $out = Join-Path $Dest $m[1]
    New-Item -ItemType Directory -Force (Split-Path $out) | Out-Null
    $mask = $null; $bg = '#FFFFFF'
    if ($m.Count -gt 2) { $mask = Join-Path $Src "mask-obj$($m[0]).png"; $bg = $m[2] }
    $size = [Img]::Make($file.FullName, $mask, $bg, $out)
    "{0}  {1}" -f $m[1], $size
}
