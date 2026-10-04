/* Contenu du portfolio — tout le texte et la liste des images se modifient ici.
   Sources : « Portfolio — Gbadamassi Rayann · 2026 » et « CV Gbadamassi Rayann · 2026 ». */

(function () {
  const dossier = (slug) => 'assets/projets/' + slug + '/';

  // Chaque image existe en deux tailles : nom.jpg (grande) et nom.sm.jpg (vignette).
  const image = (chemin, l, h, legende, papier) => ({
    src: chemin + '.jpg',
    mini: chemin + '.sm.jpg',
    l, h, legende,
    papier: !!papier, // document technique sur fond blanc
  });

  const projets = [
    {
      slug: 'studio-caen',
      dossier: dossier('01-studio-caen'),
      titre: 'De local commercial à studio habitable',
      titreCourt: 'Studio habitable',
      categorie: 'Réhabilitation · Caen',
      resume: 'Caen, 30 m²',
      description:
        "Un couple acquiert un ancien local commercial de 30 m² rue de Bayeux à Caen pour en faire leur premier logement. Aucune modification de façade — tout se joue à l'intérieur. Le défi : créer un vrai chez-soi dans 30 m², avec une suite parentale (6,3 m²), une salle d'eau (3,9 m²), des toilettes et un séjour-cuisine ouvert de 16,8 m². Dans un style chaleureux, contemporain.",
      chiffres: [
        ['30 m²', 'Surface totale'],
        ['16,8 m²', 'Séjour-cuisine'],
        ['6,3 m²', 'Suite parentale'],
        ['3,9 m²', "Salle d'eau"],
      ],
      logiciels: ['D5 Render', 'SketchUp', 'Archicad', 'Photoshop'],
      palette: ['#968462', '#20170F', '#C8C0A6'],
      rendus: [
        ['rendus/rendu-01', 3840, 3494, 'Séjour-cuisine, vue vers le coin télévision'],
        ['rendus/rendu-02', 3840, 3493, 'Cuisine et comptoir repas'],
        ['rendus/rendu-03', 3840, 3493, 'Cuisine vue depuis le séjour'],
      ],
      plans: [
        ['plans/plan-existant', 505, 551, 'Plan existant'],
        ['plans/plan-cote', 1754, 1241, 'Plan coté aménagé'],
        ['plans/plan-texture', 1315, 1197, 'Plan texturé'],
      ],
      moodboard: ['moodboard/moodboard', 1672, 941, 'Moodboard'],
      matieres: ['Panneau cannelé', 'Pierre brute', 'Tissu bouclé', 'Parquet chêne', 'Art abstrait', 'Miroir arrondi', 'Bar stool', 'Table basse ronde', 'Robinetterie', 'Lit plateforme'],
    },
    {
      slug: 'vill-arborea',
      dossier: dossier('02-vill-arborea'),
      titre: "T2 – Résidence Vill'Arborea",
      titreCourt: "Vill'Arborea",
      categorie: 'Aménagement · Appartement T2',
      resume: 'Rénovation 48 m²',
      description:
        "Aménagement d'un appartement T2 de 48 m² pour un jeune actif. Le projet articule fonctionnalité et caractère autour d'une palette bois / noir / blanc, d'une circulation pensée sans compromis et de rangements entièrement intégrés au bâti. Chaque choix spatial vise à maximiser le confort du quotidien tout en conférant au bien une vraie valeur ajoutée.",
      chiffres: [
        ['48 m²', 'Surface habitable'],
        ['T2', 'Typologie'],
        ['2,50 m', 'Hauteur sous plafond'],
        ['7 m²', 'Terrasse'],
      ],
      logiciels: ['Corona Render', 'SketchUp', 'Archicad', 'Photoshop'],
      palette: ['#212021', '#49382E', '#D6D6D8'],
      rendus: [
        ['rendus/rendu-01', 1920, 1080, 'Chambre et rangements intégrés'],
        ['rendus/rendu-02', 1713, 1080, 'Cuisine, crédence en marbre noir'],
        ['rendus/rendu-03', 1920, 1080, 'Séjour ouvert sur la cuisine'],
        ['rendus/rendu-04', 1920, 1080, 'Séjour, mur télévision'],
      ],
      plans: [
        ['plans/plan-avant', 1024, 718, 'Plan / Avant'],
        ['plans/plan-apres', 1754, 1241, 'Plan / Après'],
        ['plans/plan-cote', 3508, 2481, 'Plan coté aménagé'],
      ],
      moodboard: ['moodboard/moodboard', 1672, 941, 'Moodboard'],
      matieres: ['Parquet chêne fumé', 'Marbre noir Marquina', 'Panneau laqué noir mat', 'Canapé bouclé crème', 'Enduit blanc cassé', 'Lampadaire noir mat', 'Bar stool sable', 'Vase cuivré + pampa'],
    },
    {
      slug: 'salon-modern',
      dossier: dossier('03-salon-modern'),
      titre: 'Rendu 3D Salon Modern',
      titreCourt: 'Salon Modern',
      categorie: 'Projet personnel · Rendu 3D',
      resume: 'Rendu 3D, projet personnel',
      description:
        "Projet personnel — séjour moderne. De l'esquisse au rendu : zoning, optimisation des circulations, revêtements bois/minéraux, palette neutre contrastée. Light balance, post-prod légère.",
      chiffres: [],
      logiciels: ['Corona Render', 'SketchUp', 'Archicad', 'Photoshop'],
      palette: ['#999082', '#1D1A17', '#E6E2DD'],
      rendus: [
        ['rendus/rendu-01', 1920, 1080, 'Séjour, mur télévision bois et tasseaux'],
        ['rendus/rendu-02', 1920, 1080, 'Salon et enfilade'],
        ['rendus/rendu-03', 1920, 1080, 'Salon et salle à manger'],
      ],
      plans: [],
    },
    {
      slug: 'arret-bus-cotonou',
      dossier: dossier('04-arret-bus-cotonou'),
      titre: 'Arrêt de bus — Cotonou',
      titreCourt: 'Arrêt de bus',
      categorie: 'Projet MADE · Mobilier urbain',
      resume: 'Cotonou, projet MADE',
      description:
        "Conception d'un arrêt de bus à Cotonou dans le cadre du projet MADE. Architecture bioclimatique adaptée au contexte local. Toiture solaire, structure légère et matériaux durables.",
      chiffres: [
        ['Cotonou', 'Bénin'],
        ['Eco-Stop', 'Vêdoko'],
        ['1/35', 'Échelle de la façade'],
        ['PMR', 'Rampe d’accès'],
      ],
      logiciels: ['SketchUp', 'D5 Render', 'Archicad', 'Photoshop'],
      palette: ['#C48360', '#435A4A', '#4A2711'],
      rendus: [
        ['rendus/rendu-01', 1290, 722, 'Insertion sur site'],
        ['rendus/rendu-02', 3840, 2963, 'Vue de jour'],
        ['rendus/rendu-03', 2049, 1582, 'Vue de nuit'],
      ],
      comparaison: { avant: 1, apres: 2, etiquettes: ['Jour', 'Nuit'] },
      plans: [
        ['plans/facade', 4096, 2897, 'Façade latérale droite'],
        ['plans/illustration-jour', 3507, 2480, 'Illustration jour'],
        ['plans/illustration-nuit', 3508, 2476, 'Illustration nuit'],
      ],
      moodboard: ['moodboard/moodboard', 1448, 1086, 'Moodboard'],
      matieres: ['Latérite', 'Bloc de latérite', 'Bambou lamellé', 'Acier galvanisé', "Enduit à l'ocre rouge", 'Béton / ciment', 'Panneau solaire'],
    },
    {
      slug: 'cove-beach-hotel',
      dossier: dossier('05-cove-beach-hotel'),
      titre: 'Cove Beach Hotel',
      titreCourt: 'Cove Beach Hotel',
      categorie: 'Suite hôtelière · Stage OBA Architectes',
      resume: 'Suite hôtelière',
      description:
        'Séjour contemporain et chaleureux. Bois texturé, marbre clair, éclairage LED indirect. Mobilier intégré, palette neutre contrastée. Maquette 3D et rendus Corona Render.',
      chiffres: [],
      logiciels: ['D5 Render', 'Corona', 'SketchUp', 'Archicad', 'Photoshop'],
      palette: ['#E3DED2', '#5B452F', '#C2AD8D'],
      rendus: [
        ['rendus/rendu-01', 3840, 2963, 'Séjour, bureau et coin repas'],
        ['rendus/rendu-02', 1413, 1090, 'Entrée et dressing'],
        ['rendus/rendu-03', 2560, 1976, 'Chambre'],
      ],
      plans: [
        ['plans/plan-general', 4096, 2897, 'Plan général'],
        ['plans/plan-cote', 4096, 2897, 'Plan coté aménagé'],
        ['plans/plan-texture', 2444, 1728, 'Plan texturé'],
      ],
      moodboard: ['moodboard/moodboard', 2816, 1536, 'Moodboard', true],
      matieres: ['Parquet chêne clair', 'Marbre Carrare', 'Laiton brossé', 'Cuir tabac', 'Lin blanc', 'Tissu lin taupe', 'Noyer foncé', 'Verre fumé', 'Pierre naturelle'],
    },
    {
      slug: 'moringa-and-co',
      dossier: dossier('06-moringa-and-co'),
      titre: 'Coffee Shop — Moringa & Co',
      titreCourt: 'Moringa & Co',
      categorie: 'Coffee shop · Identité de lieu',
      resume: 'Identité de lieu',
      description:
        "Conception d'un coffee shop à l'identité forte. Ambiance végétale et chaleureuse. Palette verte sombre et bois naturel. Branding visuel intégré.",
      chiffres: [],
      logiciels: ['3ds Max', 'Corona Render', 'Photoshop'],
      palette: ['#38552A', '#271C13', '#7C7565'],
      rendus: [
        ['rendus/rendu-01', 1080, 1080, 'Alcôve « Coffee » et comptoir'],
        ['rendus/rendu-02', 1080, 1080, 'Bar et enseigne lumineuse'],
        ['rendus/rendu-03', 1080, 1080, 'Alcôve « Juice »'],
      ],
      plans: [],
    },
    {
      slug: 'serre-inversee',
      dossier: dossier('07-serre-inversee'),
      titre: 'La Serre inversée',
      titreCourt: 'La Serre inversée',
      categorie: 'Scénographie éphémère · Lille',
      resume: 'Scénographie éphémère, Lille',
      description:
        "Projet de groupe — scénographie éphémère pour l'Orangerie du Jardin des Plantes de Lille, en partenariat avec l'association Bartok. L'installation suit le cycle de vie d'une plante en 4 étapes (Germination, Croissance, Floraison, Semence).",
      chiffres: [
        ['Lille', 'Orangerie du Jardin des Plantes'],
        ['4 étapes', 'Cycle de vie d’une plante'],
        ['Groupe', 'Projet collectif'],
        ['Bartok', 'Association partenaire'],
      ],
      logiciels: ['D5 Render', 'SketchUp', 'Archicad', 'Photoshop'],
      palette: ['#A77970', '#7C6538', '#514D2C'],
      rendus: [
        ['rendus/rendu-01', 3840, 3494, 'Terrasse de l’Orangerie, de nuit'],
        ['rendus/rendu-02', 1890, 1417, 'Axonométrie de l’aménagement'],
        ['rendus/rendu-03', 1448, 1086, 'Espace détente'],
        ['rendus/rendu-04', 3840, 3494, 'Vue d’ensemble'],
      ],
      plans: [
        ['plans/zoning', 1449, 697, 'Zoning'],
        ['plans/coupe', 2526, 1309, 'Plan coté'],
        ['plans/visite-vr', 1029, 1114, 'Visite VR — QR code', false],
      ],
      moodboard: ['moodboard/moodboard', 1448, 1086, 'Moodboard'],
      matieres: ['Béton ciré', 'Pin clair', 'Acier noir mat', 'Mousse végétale', 'Brique existante'],
    },
    {
      slug: 'japandi-master-suite',
      dossier: dossier('08-japandi-master-suite'),
      titre: 'Japandi Master Suite',
      titreCourt: 'Japandi Master Suite',
      categorie: 'Projet personnel · Chambre & bureau',
      resume: 'Projet personnel',
      description:
        'Projet personnel — chambre master suite et espace bureau/nuit en style Japandi. Fusion japonaise-scandinave autour de matériaux naturels bruts : chêne, stuc beige, sisal et bouclé. Ambiance soir intimiste, cannelures chêne, éclairage LED indirect.',
      chiffres: [],
      logiciels: ['Corona Renderer', '3ds Max', 'SketchUp', 'Archicad', 'Photoshop'],
      palette: ['#C6B99D', '#BC9555', '#EFECE3'],
      rendus: [
        ['rendus/rendu-01', 1920, 1080, 'Chambre, tête de lit cannelée'],
        ['rendus/rendu-02', 1920, 1080, 'Espace bureau'],
        ['rendus/rendu-03', 1920, 1080, 'Vue d’ensemble de la suite'],
      ],
      plans: [],
    },
  ];

  // Les plans sont des documents sur fond blanc, sauf mention contraire (4e valeur à false).
  projets.forEach((p, i) => {
    p.numero = String(i + 1).padStart(2, '0');
    p.rendus = p.rendus.map((r) => image(p.dossier + r[0], r[1], r[2], r[3]));
    p.plans = p.plans.map((r) => image(p.dossier + r[0], r[1], r[2], r[3], r[4] !== false));
    if (p.moodboard) {
      const m = p.moodboard;
      p.moodboard = image(p.dossier + m[0], m[1], m[2], m[3], m[4]);
    }
  });

  window.PORTFOLIO = {
    profil: {
      nom: 'Rayann Gbadamassi',
      titre: "Étudiant en architecture d'intérieur",
      statut: 'Master 2 · Alternance 2026–2027',
      periode: '2022 — 2026',
      accroche:
        "Étudiant en architecture d'intérieur, spécialisé en modélisation et rendus 3D réalistes (Corona Render, 3ds Max, D5 Render). Livrables propres, techniquement fiables et orientés usagers.",
      apropos:
        "Étudiant en architecture d'intérieur : plans, coupes, élévations et dossiers techniques, puis modélisation et rendus 3D réalistes. J'aime prendre un concept flou et le transformer en visuel clair qui aide à trancher, toujours pensé pour l'usager final.",
      recherche:
        "À la recherche d'une alternance en Master 2 architecture d'intérieur, disponible dès que possible, rythme 2 semaines en entreprise / 1 semaine à l'école.",
      portrait: image('assets/profil/portrait', 1986, 3024, 'Portrait de Rayann Gbadamassi'),
      cv: 'assets/cv/CV-Rayann-Gbadamassi-2026.pdf',
      contact: {
        email: 'rayanngba@gmail.com',
        telephone: '+33 7 43 04 25 64',
        ville: 'Lille, France',
        linkedin: { nom: '/rayann-gbadamassi', url: 'https://www.linkedin.com/in/rayann-gbadamassi-420691162/' },
        instagram: { nom: '@rg_creation_design', url: 'https://www.instagram.com/rg_creation_design' },
      },
      infos: [
        ['Disponibilité', 'Dès que possible · Alternance (2 semaines en entreprise / 1 semaine à l’école)'],
        ['Langues', 'Français natif · Anglais B1'],
        ['Permis', 'Permis B'],
        ['Localisation', 'Lille, France'],
      ],
      experiences: [
        ['Janv — Avr 2026', 'Arki DÉA', "Stagiaire architecture d'intérieur · Carquefou, France", "Rénovation résidentielle : conception & rendus 3D. Rapport d'activité sur l'impact des données bâtimentaires incomplètes."],
        ['Avr — Juil 2025', 'OBA Architectes', "Stagiaire architecture d'intérieur · Cotonou, Bénin", 'Villas · plans 2D/coupes/élévations (Archicad) · rendus 3D & détails techniques.'],
        ['Mai — Juil 2024', 'Inspired Design', "Stagiaire architecture d'intérieur · Cotonou, Bénin", 'Plans 2D, coupes, élévations · rendu 3D de façade & maison R+1.'],
        ['Juin — Juil 2023', 'Canal+ JDD', 'Agent commercial · Cotonou, Bénin', 'Prospection terrain & vente directe · objectifs hebdomadaires atteints.'],
      ],
      formations: [
        ['2026 — 27', 'ESDAC-Lille', "Master 2 Architecture d'intérieur · en alternance"],
        ['2025 — 26', 'ESDAC-Lille', "Master 1 Architecture d'intérieur · mémoire « La Grande Table »"],
        ['2024 — 25', 'École de Design Nantes Atlantique', '3ème année · Diplôme DNMADE-Espace'],
        ['2022 — 24', 'Africa Design School', "1ère & 2ème années · Design d'espace"],
      ],
      logiciels: [
        ['Archicad', ['Plans 2D, coupes & élévations', 'Dossiers techniques & relevés']],
        ['3ds Max · Corona Render', ["Modélisation d'espaces intérieurs", 'Rendus 3D réalistes']],
        ['D5 Render', ['Rendu temps réel & walkthrough']],
        ['SketchUp', ['Études volumétriques rapides']],
        ['Suite Adobe', ['Photoshop, Illustrator, InDesign, Lightroom — planches de présentation & post-production']],
      ],
      missions: [
        'Plans, coupes, élévations & détails techniques',
        'Relevés & analyse des données bâtimentaires existantes',
        'Rendus 3D & supports de présentation',
        'Prise de brief & recherche de références (moodboards, matières)',
      ],
      savoirEtre: ['Créativité', "Travail d'équipe", 'Coopération', 'Calme', 'Organisation', 'Rigueur', 'Adaptabilité', 'Autonomie', "Sens de l'écoute"],
      interets: ['Mode', 'Jeux vidéos', 'Photographie'],
      recompenses: [
        ['2023 · 3ème place', 'Forum International du Cadre de Vie', 'Hackathon · Espaces publics interactifs'],
        ['2024 · 1ère place', 'Concours EPITECH', 'Éco-Tourisme'],
      ],
    },
    projets,
  };
})();
