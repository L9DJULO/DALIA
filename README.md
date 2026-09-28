# DALIA · site

Page de présentation et de téléchargement de DALIA (Draft Analysis League Intelligence Assistant),
l'assistant de draft League of Legends. Code de l'application : [DALIA-RELOADED](https://github.com/L9DJULO/DALIA-RELOADED).

Site statique, sans étape de build : HTML, CSS et JavaScript servis tels quels par Vercel.

## Structure

```
.
├── index.html            # Page unique
├── vercel.json           # Cache par type de fichier, en-têtes de sécurité (CSP)
├── downloads/            # Installeur Windows servi par le site
└── assets/
    ├── css/site.css      # Styles : mêmes tokens que l'application (encre, os, un seul rouge)
    ├── js/boot.js        # Active les apparitions avant le premier rendu
    ├── js/site.js        # Visite guidée, apparitions
    ├── fonts/            # Oswald, Inter, JetBrains Mono (woff2, auto-hébergées)
    ├── img/shots/        # Captures de l'application (WebP)
    ├── img/stack/        # Logos des technologies (Simple Icons)
    ├── img/og.png        # Aperçu pour les réseaux sociaux (1200×630)
    └── logo.png          # Logo d'origine
```

## Téléchargement

L'installeur est servi par le site lui-même : `downloads/DALIA_X.Y.Z_x64-setup.exe`, en
téléchargement (`Content-Disposition: attachment`) et en cache permanent — le nom porte la
version. Les deux boutons « Télécharger » de `index.html` pointent dessus, avec la version et la
taille écrites en dur.

Pour une nouvelle version : construire l'installeur dans DALIA-RELOADED
(`scripts/build-client.ps1`), le copier dans `downloads/`, retirer l'ancien, puis mettre à jour
dans `index.html` les deux liens, la taille et la ligne « Version X.Y.Z, publiée le … ».
Le lien « Versions précédentes » mène aux releases GitHub.

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

Adresse publique : https://dalia-two.vercel.app (déclarée dans `og:url`, `og:image` et `canonical` de `index.html` ; à changer si un domaine personnalisé est ajouté).
