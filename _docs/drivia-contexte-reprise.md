# Drivia — Contexte de reprise
> À coller en début de nouvelle conversation avec Claude pour reprendre le projet

---

## Le projet

**Drivia** est une application web guide pratique pour acheteurs de voitures d'occasion.
"Comme si t'avais un pote mécanicien dans la poche."

### Fonctionnalités actuelles (toutes opérationnelles)
- Recherche live search avec dropdown, aliases (vw→Volkswagen, bm→BMW...), recherche floue
- NavSearch dans la barre de navigation (desktop)
- Fiche voiture : specs, fiabilité générale, points sensibles, pannes fréquentes, motorisations en cards
- Fiche motorisation : specs, fiabilité moteur, pannes, cotes marché, options, reprog, checklist interactive
- Navigation ancre sticky sur les fiches motorisation (apparaît au scroll)
- Checklist cochable avec localStorage, compteur de progression, barre animée
- Sélecteur de boîte de vitesses
- Photos véhicules via Vehicle Imagery API (vehicleimagery.com) — proxy route /api/car-image
- Page catalogue /voitures avec filtres (segment, moteur, note, tri) + grille 3 colonnes
- Score "Achat recommandé" (Bon achat / À étudier / Achat risqué / ★ Collector)
- Breadcrumbs cliquables sur toutes les pages
- Sections Options et Reprog conditionnelles par motorisation
- Badges fiabilité couleur variable (vert/or/orange/rouge selon note)
- Toggle dark/light mode (natif, sans next-themes)

### Stack technique
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Données mockées** dans `src/lib/data.ts` (conservées, aucune page cassée)
- **Route API proxy** `src/app/api/car-image/route.ts` → Vehicle Imagery API
- **PostgreSQL (Neon.tech)** + **Prisma ORM 7** (`@prisma/adapter-pg`)
- Variables d'env : `VEHICLE_IMAGERY_API_KEY` (`.env.local`), `DATABASE_URL` (`.env`)
- Config Prisma : `prisma.config.ts` (requis par Prisma 7), schema dans `src/prisma/schema.prisma`

### Voitures disponibles (9)
Golf 7, Clio 4, 308 II, Yaris III, BMW Série 3 F30, Sandero II, Fiesta 7, C3 III, BMW M3 E92

### Structure des fichiers clés
- `src/types/index.ts` — Types TypeScript complets
- `src/lib/data.ts` — 9 voitures avec données complètes (mockées, conservées)
- `src/lib/db.ts` — Client Prisma singleton avec `@prisma/adapter-pg`
- `src/prisma/schema.prisma` — Schéma Prisma (Car, Motorisation, CarImage)
- `src/prisma/migrations/` — Migrations SQL (migration init appliquée)
- `prisma.config.ts` — Config Prisma 7 (datasource + schema path)
- `scripts/seed.ts` — Script de seed (tsx scripts/seed.ts)
- `src/lib/pipeline/types.ts` — Types pipeline (CarImageCandidate, ScoredCandidate, PipelineResult)
- `src/lib/pipeline/search.ts` — Recherche Wikimedia Commons (10 images/requête, 2 requêtes/voiture)
- `src/lib/pipeline/score.ts` — Scoring Claude Vision Haiku (base64, batch 3, seuil 68, fallback 40)
- `src/lib/pipeline/normalize.ts` — remove.bg API + Sharp crop bounding box (1600×900, #0D0D0D, WebP 92)
- `src/lib/pipeline/storage.ts` — Upload Vercel Blob (allowOverwrite) + upsert CarImage Prisma
- `src/lib/pipeline/pipeline.ts` — Orchestrateur (processCar / processAllCars)
- `src/app/api/process-image/route.ts` — Route POST protégée PIPELINE_SECRET
- `scripts/process-all-cars.ts` — Script CLI pour traiter les 9 voitures (forceReprocess=true)
- `src/lib/reliability.ts` — Helper getReliabilityColor(note)
- `src/lib/score.ts` — Helper getScoreAchat(voiture)
- `src/lib/carImage.ts` — Helper getCarImageUrl() → /api/car-image (proxy Vehicle Imagery)
- `src/lib/carImageDb.ts` — Helpers server-side getCarImageFromDb(carId) et getAllCarImagesFromDb() → Prisma CarImage
- `src/components/NavBar.tsx` — Header sticky avec NavSearch
- `src/components/NavSearch.tsx` — Search avec dropdown dans la NavBar
- `src/components/SearchBar.tsx` — Search hero avec live dropdown
- `src/components/CarCard.tsx` — Card voiture avec bannière photo 120px
- `src/components/CardImage.tsx` — Composant image avec fallback
- `src/components/HeroImage.tsx` — Header image pleine largeur
- `src/components/MotorisationCards.tsx` — Cards motorisation interactives
- `src/components/OptionsSection.tsx` — Section options conditionnelle
- `src/components/ReprogSection.tsx` — Section reprog conditionnelle
- `src/components/AnchorNav.tsx` — Navigation ancre sticky
- `src/components/ChecklistInteractive.tsx` — Checklist cochable
- `src/components/FilterPanel.tsx` — Filtres catalogue
- `src/components/ThemeToggle.tsx` — Toggle dark/light (natif, sans next-themes)
- `src/app/api/car-image/route.ts` — Proxy → Vehicle Imagery API (header x-api-key)
- `src/app/page.tsx` — Accueil
- `src/app/recherche/page.tsx` — Résultats recherche
- `src/app/voitures/page.tsx` — Catalogue toutes les voitures
- `src/app/voiture/[id]/page.tsx` — Fiche voiture
- `src/app/voiture/[id]/[motorisationSlug]/page.tsx` — Fiche motorisation

### URLs de test
- `http://localhost:3000`
- `http://localhost:3000/voitures`
- `http://localhost:3000/voiture/volkswagen-golf-7`
- `http://localhost:3000/voiture/volkswagen-golf-7/16-tdi-90ch?boite=bvm5`
- `http://localhost:3000/voiture/bmw-m3-e92`

---

## État d'avancement

### ✅ Fait — Sessions 1 & 2
- Setup complet Next.js 14 + TypeScript + Tailwind
- 9 voitures avec données complètes (specs, fiabilité, options, reprog, cotes, checklist)
- Live search avec dropdown et aliases
- Navigation ancre sticky sur fiches motorisation
- Checklist interactive cochable (localStorage, progression)
- Page catalogue /voitures avec filtres complets
- Score "Achat recommandé" + badge Collector
- Breadcrumbs cliquables partout
- MCP GitHub configuré dans Claude Code

### ✅ Fait — Session 3
- Migration photos Wikimedia → Imagin.studio
- Bug boucle HMR corrigé (ThemeProvider/next-themes supprimé)

### ✅ Fait — Session 4
- Migration photos Imagin.studio → Vehicle Imagery API (vehicleimagery.com)
- Clé API : `VI-a96ce1f9b8c74e1497cb4c1bb8d377c50fec6aba82254f1e` (dans .env.local)
- Route proxy `/api/car-image` créée (header x-api-key côté serveur)
- Plus de watermark

### ✅ Fait — Session 6
- Pipeline images automatique : Wikimedia → Claude Vision → Sharp → Vercel Blob → Prisma
- 9 voitures traitées avec succès, images stockées sur Vercel Blob
- Background removal isolé dans un worker process (contournement segfault WSL2)
- Scoring Claude Haiku Vision avec encodage base64 (URLs Wikimedia non accessibles depuis Anthropic)
- Route API `/api/process-image` (POST, protégée par PIPELINE_SECRET)
- Env vars : `ANTHROPIC_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `PIPELINE_SECRET`

### ✅ Fait — Session 7
- Branchement images Vercel Blob dans les composants (remplacement Vehicle Imagery)
- `src/lib/carImageDb.ts` créé : `getCarImageFromDb(carId)` et `getAllCarImagesFromDb()`
- `HeroImage`, `CardImage`, `CarCard`, `FilterPanel` mis à jour avec prop `imageUrl?` optionnelle
- Pages `/`, `/voitures`, `/voiture/[id]` interrogent la DB Prisma côté serveur
- Fallback automatique sur Vehicle Imagery API si la DB retourne null

### ✅ Fait — Session 5
- Intégration PostgreSQL Neon.tech + Prisma ORM 7
- Config Prisma 7 : `prisma.config.ts`, schema dans `src/prisma/schema.prisma`
- Adaptation breaking changes Prisma 7 : `datasource.url` déplacé hors du schema, driver adapter `@prisma/adapter-pg` requis
- Migration initiale appliquée sur Neon (`init`)
- 9 voitures et leurs motorisations seedées (`npm run db:seed`)
- Scripts disponibles : `db:studio`, `db:migrate`, `db:seed`, `db:generate`
- `src/lib/db.ts` créé (Prisma singleton avec adapter pg)
- Données mockées `src/lib/data.ts` conservées — aucune page cassée

### 🔄 P0 restante
1. ✅ Photos sans watermark (Vehicle Imagery API)
2. ✅ **Images pipeline retraitées avec remove.bg** (Session 8)
3. ⬜ Grille 2 colonnes sur la page d'accueil + lien "Voir les 9 voitures →"
4. ⬜ Bloc "Verdict rapide" en haut de chaque fiche motorisation
5. ⬜ Bouton "Préparer ma visite →" sur la fiche voiture

### 📋 Roadmap complète (voir drivia-roadmap.md)

---

## Charte graphique ACTUELLE (or/dark)

### Palette dark mode actuelle
- bg-base `#0D0D0D` / bg-surface `#141414` / bg-elevated `#1C1C1C`
- accent-gold `#C9A84C` / Cormorant Garamond + DM Sans

### Palette D+ (validée, EN PAUSE)
- bg `#141416` / surface `#1C1C1F` / elevated `#242428`
- accent cyan `#2DD4BF` / Syne + DM Sans
- Maquette : `_docs/drivia-da-D-plus.html`

### Règle couleur fiabilité
- Note 5 → vert `#4ADE80`
- Note 4 → or `#C9A84C`
- Note 3 → orange `#D48C3A`
- Note ≤2 → rouge `#F87171`

---

## API Photos — Vehicle Imagery (vehicleimagery.com)

Format URL interne : `/api/car-image?make=X&model=Y&year=Z&angle=front-left`
La route proxy appelle : `https://api.vehicleimagery.com/api/{make}/{model}/{year}/{angle}`
Header requis côté serveur : `x-api-key: VI-a96ce1f9b8c74e1497cb4c1bb8d377c50fec6aba82254f1e`

Mapping des 9 voitures :
| id | make | model | year |
|---|---|---|---|
| volkswagen-golf-7 | volkswagen | golf | 2013 |
| renault-clio-4 | renault | clio | 2013 |
| peugeot-308-ii | peugeot | 308 | 2014 |
| toyota-yaris-3 | toyota | yaris | 2012 |
| bmw-m3-e92 | bmw | m3 | 2008 |
| bmw-serie-3-f30 | bmw | 3-series | 2013 |
| dacia-sandero-ii | dacia | sandero | 2013 |
| ford-fiesta-7 | ford | fiesta | 2018 |
| citroen-c3-iii | citroen | c3 | 2017 |

---

## Outils & Workflow
- **Claude.ai** — stratégie, maquettes HTML avant dev, analyse visuelle via Chrome
- **Claude Code** — génération code (MCP GitHub configuré → repo lNeo0/drivia)
- **Claude in Chrome** — vérification visuelle directe sur localhost:3000

**Workflow établi :**
1. Claude.ai génère maquette HTML → validation visuelle
2. Claude.ai génère prompt Claude Code
3. Claude Code exécute et push sur GitHub
4. Claude in Chrome vérifie le résultat
5. Mise à jour fichiers _docs en fin de session

## Repo GitHub
https://github.com/lNeo0/drivia

## Fichiers de suivi
- `_docs/drivia-contexte-reprise.md` — ce fichier
- `_docs/drivia-prompts-claude-code.md` — historique des prompts
- `_docs/drivia-roadmap.md` — roadmap triée par priorité
- `_docs/drivia-da-D-plus.html` — maquette direction D+ (en pause)

---

*Dernière mise à jour : Session 10 — Fix images /recherche + hero motorisation + Golf7 retraité (85/100)*
