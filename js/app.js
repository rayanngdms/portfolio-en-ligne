(function () {
  const { profil, projets } = window.PORTFOLIO;
  const contenu = document.getElementById('contenu');
  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Utilitaires ---------- */

  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Largeur réelle d'une déclinaison dont le grand côté est limité à `max`.
  const largeur = (img, max) => Math.round(img.l * Math.min(1, max / Math.max(img.l, img.h)));

  const photo = (img, { tailles = '100vw', prioritaire = false, alt } = {}) =>
    `<img src="${img.mini}" srcset="${img.mini} ${largeur(img, 1100)}w, ${img.src} ${largeur(img, 2600)}w" sizes="${tailles}"
      width="${img.l}" height="${img.h}" alt="${esc(alt || img.legende)}" ${prioritaire ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

  const liste = (items, sep = ' · ') => items.map(esc).join(sep);

  /* ---------- Vue : accueil ---------- */

  const rythme = ['large', 'etroit', 'etroit', 'large'];

  function vueAccueil() {
    const couverture = projets[7].rendus[1];
    const [prenom, nom] = profil.nom.split(' ');
    return `
    <section class="couverture">
      <div class="couverture__texte">
        <p class="surtitre" data-apparition>Portfolio · Design d'intérieur</p>
        <h1 class="couverture__nom" data-apparition><span><i>${esc(prenom)}</i></span> <span><i>${esc(nom)}</i></span></h1>
        <p class="couverture__titre" data-apparition>${esc(profil.titre)}</p>
        <p class="couverture__accroche" data-apparition>${esc(profil.accroche)}</p>
        <p class="couverture__liens" data-apparition>
          <a class="bouton" href="#projets">Voir les projets</a>
          <a class="lien" href="#/profil">Profil &amp; parcours</a>
        </p>
      </div>
      <figure class="couverture__image" data-apparition>
        <div class="couverture__cadre" data-parallaxe>${photo(couverture, { tailles: '(min-width: 900px) 48vw, 100vw', prioritaire: true })}</div>
        <figcaption>
          <span class="couverture__compte">${String(projets.length).padStart(2, '0')}</span>
          <span class="surtitre">Projets<br>${esc(profil.periode)}</span>
        </figcaption>
      </figure>
    </section>

    <section class="index" id="projets">
      <header class="index__entete" data-apparition>
        <h2>Projets</h2>
        <p class="surtitre surtitre--terra">${String(projets.length).padStart(2, '0')} réalisations · ${esc(profil.periode)}</p>
      </header>
      <div class="index__grille">
        ${projets.map((p, i) => `
        <a class="carte carte--${rythme[i % 4]}" href="#/projet/${p.slug}" data-apparition style="--teinte:${p.palette[0]}">
          <figure class="carte__image">
            ${photo(p.rendus[0], { tailles: '(min-width: 900px) 55vw, 100vw' })}
            <span class="carte__numero" aria-hidden="true">${p.numero}</span>
          </figure>
          <div class="carte__texte">
            <h3>${esc(p.titre)}</h3>
            <p class="carte__categorie">${esc(p.categorie)}</p>
            <p class="surtitre">${liste(p.logiciels.slice(0, 3))}</p>
          </div>
        </a>`).join('')}
      </div>
    </section>

    <section class="apercu-profil">
      <div class="apercu-profil__texte" data-apparition>
        <p class="surtitre surtitre--terra">À propos</p>
        <p class="apercu-profil__citation">${esc(profil.apropos)}</p>
        <p>${esc(profil.recherche)}</p>
        <p><a class="lien lien--clair" href="#/profil">Lire le parcours complet</a></p>
      </div>
    </section>`;
  }

  /* ---------- Vue : projet ---------- */

  function vueProjet(p) {
    const i = projets.indexOf(p);
    const suivant = projets[(i + 1) % projets.length];
    const precedent = projets[(i + projets.length - 1) % projets.length];
    const galerie = p.rendus.slice(1);
    const comp = p.comparaison;
    let n = p.rendus.length; // index des images dans la visionneuse : rendus, puis plans, puis moodboard

    return `
    <article class="projet" style="--teinte:${p.palette[0]}">
      <header class="projet__entete">
        <a class="lien retour" href="#/">← Tous les projets</a>
        <p class="projet__numero" data-apparition><span>${p.numero}</span> / ${String(projets.length).padStart(2, '0')}</p>
        <h1 data-apparition>${esc(p.titre)}</h1>
        <p class="surtitre surtitre--terra" data-apparition>${esc(p.categorie)}</p>
      </header>

      <button class="projet__heros zoomable" type="button" data-image="0" data-apparition aria-label="Agrandir : ${esc(p.rendus[0].legende)}">
        ${photo(p.rendus[0], { prioritaire: true })}
      </button>

      <section class="projet__intro">
        <div data-apparition>
          <h2 class="etiquette">Description du projet</h2>
          <p class="projet__description">${esc(p.description)}</p>
        </div>
        <aside data-apparition>
          <h2 class="etiquette">Palette</h2>
          <ul class="palette">
            ${p.palette.map((c) => `<li><span style="background:${c}"></span><code>${c}</code></li>`).join('')}
          </ul>
          <h2 class="etiquette">Logiciels</h2>
          <p class="projet__logiciels">${liste(p.logiciels)}</p>
        </aside>
      </section>

      ${p.chiffres.length ? `
      <dl class="chiffres" data-apparition>
        ${p.chiffres.map(([v, l]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join('')}
      </dl>` : ''}

      <section class="rendus rendus--${galerie.length}" aria-label="Rendus">
        <h2 class="etiquette" data-apparition>Rendus</h2>
        <div class="rendus__grille">
          ${galerie.map((img, k) => `
          <figure data-apparition>
            <button class="zoomable" type="button" data-image="${k + 1}" aria-label="Agrandir : ${esc(img.legende)}">
              ${photo(img, { tailles: '(min-width: 900px) 50vw, 100vw' })}
            </button>
            <figcaption>${esc(img.legende)}</figcaption>
          </figure>`).join('')}
        </div>
      </section>

      ${comp ? `
      <section class="comparaison" data-apparition>
        <h2 class="etiquette">${esc(comp.etiquettes[0])} / ${esc(comp.etiquettes[1])}</h2>
        <div class="comparateur" style="aspect-ratio:${p.rendus[comp.avant].l}/${p.rendus[comp.avant].h}">
          ${photo(p.rendus[comp.apres], { tailles: '(min-width: 1100px) 1100px, 100vw' })}
          <div class="comparateur__dessus">${photo(p.rendus[comp.avant], { tailles: '(min-width: 1100px) 1100px, 100vw' })}</div>
          <span class="comparateur__etiquette comparateur__etiquette--g">${esc(comp.etiquettes[0])}</span>
          <span class="comparateur__etiquette comparateur__etiquette--d">${esc(comp.etiquettes[1])}</span>
          <span class="comparateur__poignee" aria-hidden="true"></span>
          <input type="range" min="0" max="100" value="50" aria-label="Comparer ${esc(comp.etiquettes[0])} et ${esc(comp.etiquettes[1])}">
        </div>
      </section>` : ''}

      ${p.plans.length ? `
      <section class="technique">
        <header data-apparition>
          <p class="surtitre surtitre--terra">${p.numero} — Données techniques</p>
          <h2>Plans &amp; documents</h2>
          <p class="technique__aide">Cliquer sur un document pour l'ouvrir, puis zoomer pour lire les cotes.</p>
        </header>
        <div class="technique__grille">
          ${p.plans.map((img) => `
          <figure data-apparition>
            <button class="feuille zoomable ${img.papier ? 'feuille--papier' : ''}" type="button" data-image="${n++}" aria-label="Agrandir : ${esc(img.legende)}">
              ${photo(img, { tailles: '(min-width: 900px) 45vw, 100vw' })}
            </button>
            <figcaption>${esc(img.legende)}</figcaption>
          </figure>`).join('')}
        </div>
      </section>` : ''}

      ${p.moodboard ? `
      <section class="moodboard">
        <div class="moodboard__texte" data-apparition>
          <h2 class="etiquette">Moodboard</h2>
          <p class="moodboard__titre">Matières &amp; références</p>
          <ul class="matieres">${p.matieres.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
        </div>
        <button class="moodboard__image zoomable ${p.moodboard.papier ? 'feuille--papier' : ''}" type="button" data-image="${n++}" data-apparition aria-label="Agrandir le moodboard">
          ${photo(p.moodboard, { tailles: '(min-width: 900px) 60vw, 100vw' })}
        </button>
      </section>` : ''}

      <nav class="suite" aria-label="Autres projets">
        <a class="suite__precedent lien" href="#/projet/${precedent.slug}">← ${precedent.numero} · ${esc(precedent.titreCourt)}</a>
        <a class="suite__suivant" href="#/projet/${suivant.slug}">
          ${photo(suivant.rendus[0], { alt: '' })}
          <span class="suite__texte">
            <span class="surtitre">Projet suivant</span>
            <span class="suite__titre"><em>${suivant.numero}</em> ${esc(suivant.titre)}</span>
          </span>
        </a>
      </nav>
    </article>`;
  }

  const imagesProjet = (p) => [...p.rendus, ...p.plans, ...(p.moodboard ? [p.moodboard] : [])];

  /* ---------- Vue : profil ---------- */

  function vueProfil() {
    const c = profil.contact;
    const bloc = (titre, html) => `<section class="bloc" data-apparition><h2 class="etiquette">${titre}</h2>${html}</section>`;
    return `
    <article class="profil">
      <header class="profil__entete">
        <figure class="profil__portrait" data-apparition>${photo(profil.portrait, { tailles: '(min-width: 900px) 30vw, 70vw', prioritaire: true })}</figure>
        <div>
          <p class="surtitre" data-apparition>Profil · Parcours</p>
          <h1 data-apparition>${esc(profil.nom)}</h1>
          <p class="couverture__titre" data-apparition>${esc(profil.titre)}</p>
          <p class="badge" data-apparition>${esc(profil.statut)}</p>
          <p class="profil__apropos" data-apparition>${esc(profil.apropos)} <strong>${esc(profil.recherche)}</strong></p>
          <dl class="profil__infos" data-apparition>
            ${profil.infos.map(([l, v]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join('')}
          </dl>
          <p class="couverture__liens" data-apparition>
            <a class="bouton" href="${profil.cv}" download>Télécharger le CV (PDF)</a>
            <a class="lien" href="mailto:${c.email}">${c.email}</a>
          </p>
        </div>
      </header>

      <div class="profil__colonnes">
        <div>
          ${bloc('Expérience professionnelle', `<ol class="frise">${profil.experiences.map(([d, n, r, t]) => `
            <li><p class="frise__date">${esc(d)}</p><h3>${esc(n)}</h3><p class="frise__role">${esc(r)}</p><p>${esc(t)}</p></li>`).join('')}</ol>`)}
          ${bloc('Formation', `<ol class="frise">${profil.formations.map(([d, n, t]) => `
            <li><p class="frise__date">${esc(d)}</p><h3>${esc(n)}</h3><p>${esc(t)}</p></li>`).join('')}</ol>`)}
        </div>
        <div>
          ${bloc('Logiciels', `<ul class="logiciels">${profil.logiciels.map(([n, u]) => `
            <li><h3>${esc(n)}</h3><p>${liste(u)}</p></li>`).join('')}</ul>`)}
          ${bloc('Nature des missions', `<ul class="puces">${profil.missions.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>`)}
          ${bloc('Récompenses', `<ul class="recompenses">${profil.recompenses.map(([d, n, t]) => `
            <li><p class="frise__date">${esc(d)}</p><h3>${esc(n)}</h3><p>${esc(t)}</p></li>`).join('')}</ul>`)}
          ${bloc('Savoir-être &amp; intérêts', `<p>${liste(profil.savoirEtre)}</p><p class="discret">${liste(profil.interets)}</p>`)}
        </div>
      </div>

      <section class="profil__projets" data-apparition>
        <h2 class="etiquette">Projets réalisés</h2>
        <ul>${projets.map((p) => `<li><a href="#/projet/${p.slug}"><span>${p.numero}</span>${esc(p.titre)}<small>${esc(p.resume)}</small></a></li>`).join('')}</ul>
      </section>
    </article>`;
  }

  /* ---------- Pied de page / contact ---------- */

  function pied() {
    const c = profil.contact;
    document.getElementById('contact').innerHTML = `
      <div class="pied__haut">
        <p class="surtitre surtitre--terra">Contact</p>
        <p class="pied__phrase">${esc(profil.recherche)}</p>
        <a class="pied__email" href="mailto:${c.email}">${c.email}</a>
      </div>
      <ul class="pied__liens">
        <li><span class="surtitre">Téléphone</span><a href="tel:${c.telephone.replace(/\s/g, '')}">${c.telephone}</a></li>
        <li><span class="surtitre">LinkedIn</span><a href="${c.linkedin.url}" target="_blank" rel="noopener">${c.linkedin.nom}</a></li>
        <li><span class="surtitre">Instagram</span><a href="${c.instagram.url}" target="_blank" rel="noopener">${c.instagram.nom}</a></li>
        <li><span class="surtitre">CV</span><a href="${profil.cv}" download>Télécharger le PDF</a></li>
      </ul>
      <p class="pied__bas"><span>${esc(profil.nom)} · ${esc(profil.titre)}</span><span>${esc(c.ville)} — 2026</span></p>`;
  }

  /* ---------- Routeur ---------- */

  let projetCourant = null;
  let routeCourante = null;

  function route() {
    const h = location.hash;
    if (h && !h.startsWith('#/')) {
      // Ancre simple (#projets, #contact) : on reste sur la vue en cours.
      if (routeCourante !== null && document.getElementById(h.slice(1))) defilerVers(h.slice(1));
      else afficher('#/', h.slice(1));
      return;
    }
    afficher(h || '#/');
  }

  function afficher(chemin, ancre) {
    if (chemin === routeCourante) {
      if (ancre) defilerVers(ancre);
      else window.scrollTo({ top: 0, behavior: mouvementReduit ? 'auto' : 'smooth' });
      return;
    }
    const premier = routeCourante === null;
    routeCourante = chemin;
    const m = chemin.match(/^#\/projet\/([\w-]+)/);
    projetCourant = m ? projets.find((p) => p.slug === m[1]) : null;

    let html, titre, actif;
    if (projetCourant) {
      html = vueProjet(projetCourant);
      titre = `${projetCourant.titre} — ${profil.nom}`;
      actif = 'projets';
    } else if (chemin.startsWith('#/profil')) {
      html = vueProfil();
      titre = `Profil — ${profil.nom}`;
      actif = 'profil';
    } else {
      html = vueAccueil();
      titre = `${profil.nom} — Architecture d'intérieur · Portfolio 2026`;
      actif = 'projets';
    }

    const poser = () => {
      contenu.innerHTML = html;
      document.title = titre;
      document.querySelectorAll('[data-lien]').forEach((a) => a.toggleAttribute('aria-current', a.dataset.lien === actif));
      window.scrollTo(0, 0);
      contenu.classList.remove('sortie');
      observer();
      comparateurs();
      if (ancre) defilerVers(ancre);
      if (!premier) contenu.focus({ preventScroll: true });
    };

    if (premier || mouvementReduit) return poser();
    contenu.classList.add('sortie');
    setTimeout(poser, 260);
  }

  function defilerVers(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: mouvementReduit ? 'auto' : 'smooth' });
  }

  /* ---------- Apparitions, progression, parallaxe ---------- */

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entrees) => {
        entrees.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    : null;

  function observer() {
    document.querySelectorAll('[data-apparition]').forEach((el) => (io ? io.observe(el) : el.classList.add('visible')));
  }

  const barreProgression = document.getElementById('progression');
  let enAttente = false;
  function auDefilement() {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(() => {
      enAttente = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      barreProgression.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
      document.getElementById('barre').classList.toggle('barre--pleine', scrollY > 40);
      if (!mouvementReduit) {
        document.querySelectorAll('[data-parallaxe] img').forEach((img) => {
          img.style.setProperty('--py', Math.min(60, scrollY * 0.08).toFixed(1) + 'px');
        });
      }
    });
  }
  addEventListener('scroll', auDefilement, { passive: true });

  /* ---------- Comparateur (curseur jour / nuit) ---------- */

  function comparateurs() {
    document.querySelectorAll('.comparateur').forEach((c) => {
      const curseur = c.querySelector('input');
      const maj = () => c.style.setProperty('--position', curseur.value + '%');
      curseur.addEventListener('input', maj);
      maj();
    });
  }

  /* ---------- Visionneuse : zoom, déplacement, navigation ---------- */

  const vis = {
    el: document.getElementById('visionneuse'),
    scene: document.getElementById('vis-scene'),
    img: document.getElementById('vis-image'),
    legende: document.getElementById('vis-legende'),
    zoom: document.getElementById('vis-zoom'),
    images: [], index: 0, echelle: 1, x: 0, y: 0, origine: null,
    pointeurs: new Map(), depart: null,
  };
  const ZOOM_MAX = 6;

  function ouvrir(images, index, origine) {
    vis.images = images;
    vis.origine = origine;
    vis.el.hidden = false;
    document.body.classList.add('fige');
    vis.el.classList.toggle('visionneuse--seule', images.length < 2);
    montrer(index);
    vis.el.querySelector('[data-action="fermer"]').focus();
  }

  function fermer() {
    vis.el.hidden = true;
    document.body.classList.remove('fige');
    vis.img.removeAttribute('src');
    if (vis.origine) vis.origine.focus();
  }

  function montrer(index) {
    const total = vis.images.length;
    vis.index = (index + total) % total;
    const img = vis.images[vis.index];
    vis.img.classList.toggle('papier', img.papier);
    vis.img.src = img.mini; // affichage immédiat, remplacé par la grande version une fois chargée
    const grande = new Image();
    grande.onload = () => { if (vis.images[vis.index] === img && !vis.el.hidden) vis.img.src = img.src; };
    grande.src = img.src;
    vis.img.alt = img.legende;
    vis.legende.textContent = `${String(vis.index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')} — ${img.legende}`;
    ajuster();
    transformer(1, 0, 0);
    vis.img.classList.remove('entree');
    void vis.img.offsetWidth; // relance l'animation d'entrée
    vis.img.classList.add('entree');
  }

  // Taille d'affichage calculée pour que l'image tienne toujours en entier dans la scène.
  function ajuster() {
    const img = vis.images[vis.index];
    if (!img) return;
    const s = getComputedStyle(vis.scene);
    const l = vis.scene.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
    const h = vis.scene.clientHeight - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom);
    const k = Math.min(l / img.l, h / img.h);
    vis.img.style.width = Math.max(1, Math.floor(img.l * k)) + 'px';
    vis.img.style.height = Math.max(1, Math.floor(img.h * k)) + 'px';
  }

  function transformer(echelle, x, y) {
    echelle = Math.max(1, Math.min(ZOOM_MAX, echelle));
    const r = vis.scene.getBoundingClientRect();
    const maxX = Math.max(0, (vis.img.offsetWidth * echelle - r.width) / 2);
    const maxY = Math.max(0, (vis.img.offsetHeight * echelle - r.height) / 2);
    vis.echelle = echelle;
    vis.x = Math.max(-maxX, Math.min(maxX, x));
    vis.y = Math.max(-maxY, Math.min(maxY, y));
    vis.img.style.transform = `translate(${vis.x}px, ${vis.y}px) scale(${echelle})`;
    vis.zoom.textContent = Math.round(echelle * 100) + ' %';
    vis.scene.classList.toggle('zoome', echelle > 1);
  }

  // Zoom centré sur un point de l'écran (curseur ou milieu du pincement).
  function zoomer(facteur, clientX, clientY) {
    const r = vis.scene.getBoundingClientRect();
    const px = (clientX ?? r.left + r.width / 2) - (r.left + r.width / 2);
    const py = (clientY ?? r.top + r.height / 2) - (r.top + r.height / 2);
    const cible = Math.max(1, Math.min(ZOOM_MAX, vis.echelle * facteur));
    const k = cible / vis.echelle;
    transformer(cible, px - (px - vis.x) * k, py - (py - vis.y) * k);
  }

  vis.el.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'fermer') fermer();
    else if (action === 'plus') zoomer(1.5);
    else if (action === 'moins') zoomer(1 / 1.5);
    else if (action === 'reset') transformer(1, 0, 0);
    else if (action === 'prec') montrer(vis.index - 1);
    else if (action === 'suiv') montrer(vis.index + 1);
    else if (e.target === vis.scene && vis.echelle === 1) fermer();
  });

  vis.scene.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomer(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY);
  }, { passive: false });

  vis.scene.addEventListener('dblclick', (e) => {
    if (vis.echelle > 1) transformer(1, 0, 0);
    else zoomer(2.5, e.clientX, e.clientY);
  });

  const ecart = () => {
    const [a, b] = [...vis.pointeurs.values()];
    return { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
  };

  vis.scene.addEventListener('pointerdown', (e) => {
    vis.scene.setPointerCapture(e.pointerId);
    vis.pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    vis.depart = { x: e.clientX, y: e.clientY, tx: vis.x, ty: vis.y, pince: vis.pointeurs.size === 2 ? ecart().d : null, echelle: vis.echelle };
  });

  vis.scene.addEventListener('pointermove', (e) => {
    if (!vis.pointeurs.has(e.pointerId)) return;
    vis.pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (vis.pointeurs.size === 2 && vis.depart.pince) {
      const { d, cx, cy } = ecart();
      zoomer((vis.depart.echelle * d / vis.depart.pince) / vis.echelle, cx, cy);
    } else if (vis.pointeurs.size === 1 && vis.echelle > 1) {
      transformer(vis.echelle, vis.depart.tx + e.clientX - vis.depart.x, vis.depart.ty + e.clientY - vis.depart.y);
    }
  });

  const relacher = (e) => {
    if (!vis.pointeurs.has(e.pointerId)) return;
    const seul = vis.pointeurs.size === 1;
    vis.pointeurs.delete(e.pointerId);
    // Balayage horizontal sans zoom : image précédente / suivante.
    if (seul && vis.depart && !vis.depart.pince && vis.echelle === 1 && vis.images.length > 1) {
      const dx = e.clientX - vis.depart.x;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(e.clientY - vis.depart.y) * 1.5) montrer(vis.index + (dx < 0 ? 1 : -1));
    }
    const reste = [...vis.pointeurs.values()][0];
    if (reste) vis.depart = { x: reste.x, y: reste.y, tx: vis.x, ty: vis.y, pince: null, echelle: vis.echelle };
  };
  vis.scene.addEventListener('pointerup', relacher);
  vis.scene.addEventListener('pointercancel', relacher);

  addEventListener('keydown', (e) => {
    if (vis.el.hidden) return;
    if (e.key === 'Escape') fermer();
    else if (e.key === 'ArrowLeft') montrer(vis.index - 1);
    else if (e.key === 'ArrowRight') montrer(vis.index + 1);
    else if (e.key === '+' || e.key === '=') zoomer(1.5);
    else if (e.key === '-') zoomer(1 / 1.5);
    else if (e.key === '0') transformer(1, 0, 0);
    else if (e.key === 'Tab') {
      // Le focus reste dans la visionneuse.
      const boutons = [...vis.el.querySelectorAll('button')].filter((b) => b.offsetParent);
      const i = boutons.indexOf(document.activeElement);
      e.preventDefault();
      boutons[(i + (e.shiftKey ? -1 : 1) + boutons.length) % boutons.length].focus();
    }
  });
  addEventListener('resize', () => { if (!vis.el.hidden) { ajuster(); transformer(1, 0, 0); } });

  contenu.addEventListener('click', (e) => {
    const b = e.target.closest('[data-image]');
    if (b && projetCourant) ouvrir(imagesProjet(projetCourant), Number(b.dataset.image), b);
  });

  /* ---------- Souris : curseur, images qui suivent le pointeur, boutons aimantés, onde au clic ---------- */

  const sourisFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Onde au clic (souris et tactile).
  if (!mouvementReduit) {
    addEventListener('pointerdown', (e) => {
      const onde = document.createElement('span');
      onde.className = 'onde';
      onde.style.left = e.clientX + 'px';
      onde.style.top = e.clientY + 'px';
      document.body.appendChild(onde);
      onde.addEventListener('animationend', () => onde.remove());
    });
  }

  if (sourisFine && !mouvementReduit) {
    const anneau = document.createElement('div');
    anneau.className = 'curseur';
    anneau.innerHTML = '<span></span>';
    document.body.appendChild(anneau);
    document.documentElement.classList.add('avec-curseur');
    const texte = anneau.firstChild;

    // Élément survolé -> libellé affiché dans le curseur.
    const libelles = [
      ['.comparateur', '‹ ›'],
      ['.carte', 'Voir'],
      ['.suite__suivant', 'Suivant'],
      ['.zoomable', 'Agrandir'],
    ];
    const souris = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...souris };
    let survol = null, aimant = null;

    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      souris.x = e.clientX; souris.y = e.clientY;
      anneau.classList.add('curseur--pret');

      const cible = e.target.closest ? e.target : null;
      const libelle = cible && libelles.find(([sel]) => cible.closest(sel));
      texte.textContent = libelle ? libelle[1] : '';
      anneau.classList.toggle('curseur--libelle', !!libelle);
      anneau.classList.toggle('curseur--lien', !libelle && !!(cible && cible.closest('a, button, input')));

      // L'image survolée glisse légèrement à l'opposé du pointeur.
      const zone = cible && cible.closest('.carte__image, .suite__suivant, .couverture__image, .projet__heros, .rendus button, .moodboard__image');
      if (survol && survol !== zone) { survol.style.removeProperty('--mx'); survol.style.removeProperty('--my'); }
      survol = zone;
      if (zone) {
        const r = zone.getBoundingClientRect();
        zone.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        zone.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      }

      // Boutons et liens de navigation attirés par le pointeur.
      const bouton = cible && cible.closest('.bouton, .barre__nav a, .visionneuse__outils button, .visionneuse__fleche');
      if (aimant && aimant !== bouton) aimant.style.removeProperty('translate');
      aimant = bouton;
      if (bouton) {
        const r = bouton.getBoundingClientRect();
        bouton.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => anneau.classList.remove('curseur--pret'));
    addEventListener('pointerdown', () => anneau.classList.add('curseur--appui'));
    addEventListener('pointerup', () => anneau.classList.remove('curseur--appui'));

    (function suivre() {
      pos.x += (souris.x - pos.x) * 0.2;
      pos.y += (souris.y - pos.y) * 0.2;
      anneau.style.transform = `translate(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px)`;
      requestAnimationFrame(suivre);
    })();
  }

  /* ---------- Démarrage ---------- */

  pied();
  addEventListener('hashchange', route);
  route();
  auDefilement();
})();
