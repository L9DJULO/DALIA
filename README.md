# DALIA · site

Page de présentation et de téléchargement de DALIA (Draft Analysis League Intelligence Assistant),
l'assistant de draft League of Legends. Code de l'application : [DALIA-RELOADED](https://github.com/L9DJULO/DALIA-RELOADED).

Site statique, sans étape de build : HTML, CSS et JavaScript servis tels quels par Vercel.

## Structure

```
.
├── index.html            # Page unique
├── vercel.json           # Cache par type de fichier, en-têtes de sécurité (CSP)
└── assets/
    ├── css/site.css      # Styles : mêmes tokens que l'application (encre, os, un seul rouge)
    ├── js/boot.js        # Active les apparitions avant le premier rendu
    ├── js/site.js        # Dernière version GitHub, visite guidée, apparitions
    ├── fonts/            # Oswald, Inter, JetBrains Mono (woff2, auto-hébergées)
    ├── img/shots/        # Captures de l'application (WebP)
    ├── img/stack/        # Logos des technologies (Simple Icons)
    ├── img/og.png        # Aperçu pour les réseaux sociaux (1200×630)
    └── logo.png          # Logo d'origine
```

## Téléchargement

Les boutons « Télécharger » pointent par défaut vers
`https://github.com/L9DJULO/DALIA-RELOADED/releases/latest`. Au chargement, `site.js` interroge
l'API GitHub, prend l'installeur `*-setup.exe` de la dernière release, et affiche sa version, sa
date et sa taille. Publier une nouvelle release sur GitHub suffit : le site suit tout seul.

## Captures

Les captures de `assets/img/shots/` viennent de l'application (client DALIA-RELOADED 2.1) avec des
données de démonstration, en 1280×800 à l'échelle 2. Après un changement visible de l'interface,
les refaire et les convertir en WebP (qualité 82) sous les mêmes noms.

## Vérifier en local

Ouvrir `index.html` dans un navigateur suffit (chemins relatifs). Pour tester comme sur Vercel :

```bash
python -m http.server 5500   # puis http://localhost:5500
```

## Déploiement

Vercel, préréglage **Other** (statique), racine `./`. Pousser sur `main` redéploie le site si le
projet Vercel est relié au dépôt GitHub.

L'aperçu social (`og:image`) utilise un chemin relatif : une fois le domaine définitif connu,
le remplacer par l'URL complète dans `index.html` pour les plateformes qui l'exigent.
