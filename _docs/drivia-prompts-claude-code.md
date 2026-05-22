
---

## SESSION 10 — 3 bugs images (recherche, motorisation hero, Golf7 image)
**Session :** 10 | **Statut :** ✅ Exécuté avec succès

**Bug 1 — Page /recherche sans images :**
`recherche/page.tsx` n'appelait pas `getAllCarImagesFromDb()` → pas de `imageUrls` passé à `FilterPanel`.
Fix : import + appel + prop `imageUrls` ajoutés.

**Bug 2 — Fiches motorisation sans image hero :**
`voiture/[id]/[motorisationSlug]/page.tsx` n'appelait pas `getCarImageFromDb()`.
Fix : import + `const imageUrl = await getCarImageFromDb(voiture.id)` + `imageUrl={imageUrl ?? undefined}` sur `HeroImage`.

**Bug 3 — Golf 7 encore mauvaise image :**
Nouveaux SEARCH_TERMS dans `search.ts` : "Golf VII 2013 hatchback", "Golf Mk7 2014 front exterior", "Golf 7 2015 five door".
Résultat : score 85/100, bonne Golf Mk7.

**Fix bonus :** `normalize.ts` — `new Blob([imageBuffer])` remplacé par `new Blob([new Uint8Array(imageBuffer)])` pour corriger erreur TypeScript.

---

## SESSION 9 — Bug 404 motorisations + retraitement Golf 7 / Clio 4
**Session :** 9 | **Statut :** ✅ Exécuté avec succès

**Bug 404 motorisations :**
Cause : cache Turbopack corrompu (.next/dev). Le routing Next.js 16 résolvait `/_not-found` alors que les données étaient correctes (getVoitureEtMotorisation retournait voiture+motorisation trouvés).
Fix : édition du page.tsx a déclenché un hot-reload Turbopack → recompilation → 200 OK.
Note : le slug BMW M3 dans les exemples du brief (`40-v8-420ch`) était incorrect → vrai slug data.ts : `v8-s65-420ch`.

**Retraitement Golf 7 et Clio 4 :**
Les images S8 étaient une décapotable noire (Golf 7) et une photo capot ouvert (Clio 4).
Fix : nouveaux SEARCH_TERMS dans `search.ts` avec termes plus spécifiques ("hatchback 2013", "exterior front").

Résultats :
- volkswagen-golf-7 ✅ score=83 (vraie Golf Mk7 hatchback), remove.bg OK
- renault-clio-4 ✅ score=87 (Clio IV hatchback propre), remove.bg OK

---

## PROMPT BUG-FIX — Boucle rechargement HMR (ThemeProvider)
**Session :** 4 | **Statut :** ✅ Exécuté avec succès

**Bug :** La page se rechargait en boucle toutes les ~2 secondes (864 requêtes réseau en 5 secondes).

**Cause :** `next-themes` (ThemeProvider) injecte un script inline au chargement pour détecter le thème système/localStorage et modifier le DOM avant hydration. Ce script interférait avec le HMR de Next.js, créant un cycle rechargement → invalidation → rechargement infini.

**Fix appliqué par Claude Code :**
- `ThemeProvider.tsx` — supprimé (plus de dépendance à next-themes)
- `layout.tsx` — ThemeProvider retiré, `suppressHydrationWarning` retiré, `dark` ajouté directement dans `className` de `<html>` (mode sombre garanti côté serveur)
- `ThemeToggle.tsx` — réécrit sans next-themes : `useEffect` lit localStorage au montage et bascule `document.documentElement.classList` directement

**Résultat :** Boucle stoppée, toggle dark/light fonctionnel ✅

---

## ACTION À FAIRE — Remplacer customer ID Imagin.studio
**Session :** 4 | **Statut :** ⬜ En attente inscription

**Problème :** Customer ID `hrjavascript-mastery` est un compte de démo → watermark "IMAG Z studio" visible sur toutes les photos.

**Action requise :**
1. S'inscrire sur https://www.imagin.studio/solutions/api
2. Récupérer le customer ID
3. Envoyer ce prompt à Claude Code :

```
Dans src/lib/carImage.ts, remplace le customer ID Imagin.studio :
- Remplace : customer: 'hrjavascript-mastery'
- Par : customer: 'TON-NOUVEAU-CUSTOMER-ID'

C'est la seule modification à faire.
```

---

## PROMPT P0-A2 — Migration photos → Vehicle Imagery API
**Session :** 4 | **Statut :** ⬜ À exécuter

**Contexte :** Imagin.studio nécessite un RDV commercial. Remplacement par vehicleimagery.com qui propose un trial gratuit immédiat sans carte bancaire.
**Clé API obtenue :** `VI-a96ce1f9b8c74e1497cb4c1bb8d377c50fec6aba82254f1e`

```
Dans src/lib/carImage.ts, migre l'API photos de Imagin.studio vers Vehicle Imagery API.

La nouvelle API fonctionne ainsi :
- Base URL : https://api.vehicleimagery.com/api/{make}/{model}/{year}/{angle}
- Header requis : x-api-key: VI-a96ce1f9b8c74e1497cb4c1bb8d377c50fec6aba82254f1e
- L'endpoint retourne un JSON avec un champ image_url (tableau)

Problème : on ne peut pas mettre un header sur une balise <img> en HTML.
Solution : créer une route API Next.js proxy à /api/car-image qui appelle Vehicle Imagery avec le header, et retourne un redirect vers l'image_url.

## 1. Mapping des 9 voitures (make/model/year)

volkswagen / golf / 2013
renault / clio / 2013
peugeot / 308 / 2014
toyota / yaris / 2012
bmw / m3 / 2008
bmw / 3-series / 2013
dacia / sandero / 2013
ford / fiesta / 2018
citroen / c3 / 2017

## 2. Créer src/app/api/car-image/route.ts

Route GET qui accepte ?make=X&model=Y&year=Z&angle=front-left
- Appelle https://api.vehicleimagery.com/api/{make}/{model}/{year}/{angle} avec le header x-api-key
- Si l'image existe : redirect 302 vers data[0].image_url
- Si erreur/vide : retourne 404

La clé API doit être dans une variable d'environnement VEHICLE_IMAGERY_API_KEY (à ajouter dans .env.local).

## 3. Mettre à jour src/lib/carImage.ts

La fonction getCarImageUrl(make, model, year) retourne désormais :
/api/car-image?make={make}&model={model}&year={year}&angle=front-left

## 4. Créer/mettre à jour .env.local

Ajouter : VEHICLE_IMAGERY_API_KEY=VI-a96ce1f9b8c74e1497cb4c1bb8d377c50fec6aba82254f1e

## 5. Mettre à jour next.config.ts si nécessaire

S'assurer que api.vehicleimagery.com est dans les remotePatterns autorisés.

Ne pas toucher aux composants CardImage.tsx et HeroImage.tsx — ils utilisent déjà getCarImageUrl() donc la mise à jour sera automatique.
```

**Résultat observé :** En attente

---

## PROMPT SESSION 5 — PostgreSQL Neon + Prisma ORM 7
**Session :** 5 | **Statut :** ✅ Exécuté avec succès

**Objectif :** Intégrer PostgreSQL (Neon.tech) + Prisma ORM dans le projet Drivia.

**Breaking changes Prisma 7 rencontrés et résolus :**
- `datasource.url` dans `schema.prisma` n'est plus supporté → déplacé dans `prisma.config.ts`
- Le nouveau moteur "client" de Prisma 7 exige un driver adapter → `@prisma/adapter-pg` + `pg` installés
- `prisma.config.ts` est chargé avant le fichier `.env` → dotenv chargé manuellement dans `prisma.config.ts`

**Fichiers créés :**
- `prisma.config.ts` — Config Prisma 7 (datasource url, schema path), charge `.env` / `.env.local` via dotenv
- `src/prisma/schema.prisma` — Modèles Car, Motorisation, CarImage
- `src/prisma/migrations/20260521204302_init/` — Migration initiale appliquée
- `src/lib/db.ts` — Singleton PrismaClient avec `PrismaPg` adapter
- `scripts/seed.ts` — Seed des 9 voitures + motorisations (upsert idempotent)
- `.env` — DATABASE_URL (gitignored, lu par Prisma CLI)

**Scripts ajoutés dans package.json :**
```json
"db:studio": "prisma studio --schema src/prisma/schema.prisma",
"db:migrate": "prisma migrate dev --schema src/prisma/schema.prisma",
"db:seed": "tsx scripts/seed.ts",
"db:generate": "prisma generate --schema src/prisma/schema.prisma"
```

**Résultat :**
- Migration appliquée sur Neon ✅
- 9 voitures et leurs motorisations (37 au total) seedées ✅
- `npm run db:studio` ouvre Prisma Studio avec les données ✅
- Aucune page existante cassée ✅
- `src/lib/data.ts` conservé intact ✅

---

## PROMPT SESSION 6 — Pipeline images automatique
**Session :** 6 | **Statut :** ✅ Exécuté avec succès

**Objectif :** Pipeline complet Wikimedia → Claude Vision → Sharp → Vercel Blob → Prisma.

**Problèmes rencontrés et résolus :**
- Modules Prisma/Anthropic initialisés avant `dotenv` (import hoisting esbuild) → clients rendus lazy
- URLs Wikimedia non accessibles par l'API Anthropic → téléchargement manuel + encodage base64
- `@imgly/background-removal-node` segfault (exit 139) en WSL2 → worker process isolé avec `spawnSync`
- IDs voitures incohérents entre `data.ts` et le pipeline (`peugeot-308-2` ≠ `peugeot-308-ii`, etc.) → corrigés

**Fichiers créés :**
- `src/lib/pipeline/types.ts`, `search.ts`, `score.ts`, `normalize.ts`, `storage.ts`, `pipeline.ts`
- `src/app/api/process-image/route.ts` — Route POST protégée par `PIPELINE_SECRET`
- `scripts/process-all-cars.ts` — Script CLI
- `scripts/_bg-remove-worker.ts` — Worker isolé background removal

**Variables d'env ajoutées :**
- `ANTHROPIC_API_KEY` (`.env.local`)
- `BLOB_READ_WRITE_TOKEN` (`.env.local`)
- `PIPELINE_SECRET=drivia-pipeline-secret-2026` (`.env`)

**Résultat (9/9) :**
- volkswagen-golf-7 ✅ score=80.6
- renault-clio-4 ✅ score=71.6
- peugeot-308-2 ✅ score=71.6
- toyota-yaris-3 ✅ score=63.8
- bmw-m3-e92 ✅ score=79.8
- bmw-serie3-f30 ✅ score=72.8
- dacia-sandero-2 ✅ score=70.2
- ford-fiesta-7 ✅ score=72.2
- citroen-c3-3 ✅ score=72.8

Images Vercel Blob : `https://lxxjokqnswpqjunx.public.blob.vercel-storage.com/car-images/{carId}.webp`
Background removal : fallback sharp-only (segfault WSL2, fallback silencieux)
Prochaine étape : brancher `carImage.publicUrl` dans les composants. ✅ Fait — Session 7

---

## PROMPT SESSION 8 — Retraitement images avec remove.bg
**Session :** 8 | **Statut :** ✅ Exécuté avec succès

**Contexte :** Les images actuelles sont des photos Wikimedia brutes sans suppression de fond.
- `@imgly/background-removal-node` a segfault sur Windows/WSL2 → fallback silencieux
- Seuil scoring 60/100 trop permissif → voitures de dos acceptées

**Prérequis :** Avoir créé un compte remove.bg et ajouté `REMOVE_BG_API_KEY` dans `.env.local`

```
## Objectif
Corriger le pipeline images pour utiliser remove.bg API (suppression de fond cloud)
et relever le seuil de scoring à 75/100.

## 1. Mettre à jour src/lib/pipeline/normalize.ts

Remplacer @imgly/background-removal-node par un appel HTTP à l'API remove.bg :

async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const formData = new FormData()
  formData.append('image_file', new Blob([imageBuffer]), 'car.jpg')
  formData.append('size', 'auto')

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY! },
    body: formData,
  })

  if (!response.ok) throw new Error(`remove.bg error: ${response.status}`)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

Remplacer l'appel à @imgly dans normalizeCarImage() par cette fonction.
Supprimer l'import de @imgly/background-removal-node.

## 2. Mettre à jour src/lib/pipeline/score.ts

Changer le seuil minimum de 60 à 75 :
Dans selectBestImage(), remplacer minScore = 60 par minScore = 75

## 3. Mettre à jour scripts/process-all-cars.ts

Appeler processCar(carId, true) au lieu de processCar(carId) pour forcer le retraitement.
(forceReprocess = true)

## 4. Vérifier .env.local

Confirmer que REMOVE_BG_API_KEY est présent.

## 5. Lancer le retraitement

npx tsx scripts/process-all-cars.ts

Reporter les résultats (score obtenu + confirmation bg supprimé).

## 6. Mettre à jour _docs/drivia-contexte-reprise.md, _docs/drivia-prompts-claude-code.md et _docs/drivia-roadmap.md
```

**Bugs rencontrés et corrigés par Claude Code :**
- Anthropic client initialisé à l'import (avant dotenv) → lazy init `getClient()`
- `form-data` npm incompatible avec native `fetch` → remplacé par `FormData` natif Node.js 18+
- Claude Haiku retournait du markdown ` ```json ``` ` → strip code fences avant `JSON.parse()`
- Media type hardcodé `image/jpeg` → détection depuis `content-type` header Wikimedia
- IDs voitures tâche (peugeot-308-ii...) ≠ canoniques (peugeot-308-2...) → corrigés dans script
- Vercel Blob refusait l'overwrite → `allowOverwrite: true` dans `storage.ts`

**Résultat (9/9) :**
- volkswagen-golf-7 ✅ score=87, remove.bg OK
- renault-clio-4 ✅ score=88, remove.bg OK
- peugeot-308-2 ✅ score=87, remove.bg OK
- toyota-yaris-3 ✅ score=81, remove.bg OK
- bmw-m3-e92 ✅ score=83, remove.bg OK
- bmw-serie3-f30 ✅ score=90, remove.bg OK
- dacia-sandero-2 ✅ score=87, remove.bg OK
- ford-fiesta-7 ✅ score=86, remove.bg OK
- citroen-c3-3 ✅ score=65 (fallback), remove.bg OK

Images : `https://lxxjokqnswpqjunx.public.blob.vercel-storage.com/car-images/{carId}.webp`

---

## PROMPT SESSION 7 — Branchement images Vercel Blob dans les composants
**Session :** 7 | **Statut :** ✅ Exécuté avec succès

**Objectif :** Remplacer l'API Vehicle Imagery par les images Vercel Blob (stockées en DB) dans tous les composants d'affichage.

**Fichiers créés :**
- `src/lib/carImageDb.ts` — Fonctions server-side `getCarImageFromDb(carId)` et `getAllCarImagesFromDb()` via Prisma

**Fichiers modifiés :**
- `src/components/HeroImage.tsx` — Ajout prop optionnelle `imageUrl?` (prioritaire sur `getCarImageUrl()`)
- `src/components/CardImage.tsx` — Ajout prop optionnelle `imageUrl?`
- `src/components/CarCard.tsx` — Ajout prop optionnelle `imageUrl?`, passée à `CardImage`
- `src/components/FilterPanel.tsx` — Ajout prop optionnelle `imageUrls?: Record<string, string>`, passée à `CarCard`
- `src/app/voiture/[id]/page.tsx` — `getCarImageFromDb(voiture.id)` → `imageUrl` passé à `HeroImage`
- `src/app/voitures/page.tsx` — `getAllCarImagesFromDb()` → `imageUrls` passé à `FilterPanel`
- `src/app/page.tsx` — `getAllCarImagesFromDb()` → `imageUrls[v.id]` passé à chaque `CarCard`

**Architecture :**
- Les pages serveur (async) interrogent la DB Prisma pour les URLs
- Fallback automatique sur `getCarImageUrl()` (Vehicle Imagery) si la DB retourne null
- `HeroImage` et `CardImage` restent des client components (useState pour gestion erreur)
- Aucune modification de `src/lib/carImage.ts` ni de la route `/api/car-image`

**Résultat :** Images Vercel Blob affichées sur `/`, `/voitures`, `/voiture/[id]` ✅
