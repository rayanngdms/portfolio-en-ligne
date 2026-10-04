# Portfolio web — Rayann Gbadamassi

Site statique (HTML, CSS, JavaScript), sans installation ni étape de build.

## Voir le site en local

Lancer un petit serveur dans ce dossier, puis ouvrir `http://localhost:4173` :

```bash
python -m http.server 4173
```

Un double-clic sur `index.html` fonctionne aussi.

## Organisation

```
index.html            structure de la page et visionneuse
css/style.css         couleurs, typographie, mise en page
js/data.js            TOUT le contenu : textes, projets, liste des images
js/app.js             pages, navigation, zoom, comparateur
assets/
  profil/             portrait
  cv/                 CV en PDF
  projets/
    01-studio-caen/           rendus/  plans/  moodboard/
    02-vill-arborea/          rendus/  plans/  moodboard/
    03-salon-modern/          rendus/
    04-arret-bus-cotonou/     rendus/  plans/  moodboard/
    05-cove-beach-hotel/      rendus/  plans/  moodboard/
    06-moringa-and-co/        rendus/
    07-serre-inversee/        rendus/  plans/  moodboard/
    08-japandi-master-suite/  rendus/
outils/               scripts d'extraction et de redimensionnement des images
```

## Modifier le contenu

Tout se passe dans `js/data.js` : titres, descriptions, logiciels, palettes, chiffres clés, coordonnées.

## Remplacer ou ajouter une image

Chaque image existe en deux tailles : `nom.jpg` (grand côté 2600 px maximum) et `nom.sm.jpg` (1100 px).

1. Déposer les deux fichiers dans le dossier du projet (`rendus/`, `plans/` ou `moodboard/`).
2. Pour une nouvelle image, ajouter une ligne dans `js/data.js` avec son chemin, sa largeur et sa hauteur d'origine, et sa légende.

Les images actuelles viennent du PDF du portfolio : `outils/extraire-images-pdf.py` les extrait sans recompression, puis `outils/generer-images-web.ps1` crée les deux tailles.

## Publier sur GitHub Pages

1. Créer un dépôt GitHub et y envoyer le contenu de ce dossier.
2. Dans le dépôt : Settings → Pages → Source « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Le site est en ligne à `https://<utilisateur>.github.io/<depot>/`.
