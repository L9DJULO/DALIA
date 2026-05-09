# DALIA — Site

Landing page pour DALIA (Draft Analysis League Intelligence Assistant).

## Structure

```
.
├── index.html       # Page unique
├── assets/
│   └── logo.png     # Logo Soul Eater
└── vercel.json      # Config Vercel (cache + headers)
```

## Déploiement Vercel

### Option 1 — CLI

```bash
npm i -g vercel
vercel             # première fois (preview)
vercel --prod      # production
```

### Option 2 — GitHub

1. Push le repo sur GitHub
2. Vercel → "Add New Project" → import le repo
3. Framework preset : **Other** (static)
4. Root directory : `./`
5. Deploy

## À câbler avant prod

Les liens `href="#"` suivants pointent vers des ancres locales — à remplacer par tes vraies URLs :

- Boutons **Télécharger** (`data-download="msi"` et `data-download="exe"`) → URL des releases
  - Soit Vercel statique (`/releases/DALIA-Setup-1.0.0.msi`)
  - Soit GitHub Releases
- Footer : GitHub, Issues, Releases, Changelog, Licence MIT

Cherche dans `index.html` les `href="#"` et les `data-download` pour le faire.

## Mettre les binaires en téléchargement

Le plus simple sur Vercel : crée un dossier `public/releases/` et y déposer les `.msi` / `.exe`. Vercel les servira directement.

```
public/
└── releases/
    ├── DALIA-Setup-1.0.0.msi
    └── DALIA-Portable-1.0.0.exe
```

Puis remplace les boutons par :

```html
<a href="/releases/DALIA-Setup-1.0.0.msi" class="dl-btn">Télécharger</a>
```

> Vercel a une limite de 100 MB par fichier sur le plan Hobby — largement suffisant pour un Tauri.

## Domaine custom

Vercel → Project → Settings → Domains → ajoute `dalia.app` (ou autre).
