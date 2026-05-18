# Drivia — Contexte de reprise
> À coller en début de nouvelle conversation avec Claude pour reprendre le projet

---

## Le projet

**Drivia** est une application web guide pratique pour acheteurs de voitures d'occasion.
"Comme si t'avais un pote mécanicien dans la poche."

### Fonctionnalités actuelles
- Recherche par marque/modèle
- Fiche voiture : specs, fiabilité générale, points sensibles, pannes fréquentes, motorisations
- Fiche motorisation détaillée : specs, fiabilité moteur, problèmes connus, cotes marché, checklist, options, potentiel de reprog
- Sélecteur de boîte de vitesses par motorisation
- Checklist de visite avant achat (points génériques + spécifiques)
- Section Options (profil-based, conditionnelle)
- Section Potentiel de reprog (turbo/atmo/hybride, conditionnelle)

### Stack technique
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Données mockées** dans `src/lib/data.ts`
- Pas encore de backend ni Supabase

### Voitures disponibles (9)
Golf 7, Clio 4, 308 II, Yaris III, BMW Série 3 F30, Sandero II, Fiesta 7, C3 III, **BMW M3 E92** (ajoutée session 2)

### Structure des fichiers clés
- `src/types/index.ts` — Types TypeScript (dont Option, StageReprog, PotentielReprog)
- `src/lib/data.ts` — 9 voitures, données complètes
- `src/lib/reliability.ts` — Helper getReliabilityColor(note)
- `src/components/NavBar.tsx`
- `src/components/SearchBar.tsx`
- `src/components/CarCard.tsx`
- `src/components/MotorisationCards.tsx`
- `src/components/OptionsSection.tsx` — Section options conditionnelle
- `src/components/ReprogSection.tsx` — Section reprog conditionnelle
- `src/app/page.tsx` — Accueil
- `src/app/recherche/page.tsx` — Résultats
- `src/app/voiture/[id]/page.tsx` — Fiche voiture
- `src/app/voiture/[id]/[motorisationSlug]/page.tsx` — Fiche motorisation

### URLs de test
- `http://localhost:3000`
- `http://localhost:3000/voiture/volkswagen-golf-7`
- `http://localhost:3000/voiture/volkswagen-golf-7/16-tdi-90ch?boite=bvm5`
- `http://localhost:3000/voiture/bmw-m3-e92`

---

## État d'avancement

### ✅ Fait
- Setup complet Next.js 14 + TypeScript + Tailwind
- 9 voitures avec données complètes
- Design dark mode premium (Cormorant Garamond + DM Sans, accent or #C9A84C)
- Badges fiabilité couleur variable (vert/or/orange/rouge selon note)
- Sections Options et Reprog sur toutes les motorisations (profil-based)
- BMW M3 E92 ajoutée avec données détaillées
- MCP GitHub configuré dans Claude Code
- Workflow établi : maquette HTML → prompt Claude Code → vérification Chrome

### 🔄 Prochaine étape
- Navigation ancre sticky sur les fiches motorisation (Option B validée)
- Voir maquette : `_docs/drivia-maquette-ux-navigation.html`

### 📋 Roadmap (voir drivia-roadmap.md)
- Filtres page résultats
- Page "Toutes les voitures" améliorée
- Checklist interactive exportable
- Comparateur 2 voitures
- Supabase + vraie BDD
- Plus de voitures via Claude API
- Système contribution utilisateur

---

## Charte graphique

### Palette dark mode
- bg-base `#0D0D0D` / bg-surface `#141414` / bg-elevated `#1C1C1C`
- text-primary `#F5F0E8` / text-secondary `#A89880` / text-muted `#6B5F52`
- accent-gold `#C9A84C` / accent-gold-light `#E8C97A` / accent-gold-dim `#7A5E2A`
- success `#4CAF7A` / warning `#D48C3A` / danger `#C0442E`

### Règle couleur fiabilité (variable selon note)
- Note 5 → vert `#4CAF7A`
- Note 4 → or `#C9A84C`
- Note 3 → orange `#D48C3A`
- Note ≤2 → rouge `#C0442E`

### Règle reprog (profil-based)
- Turbo → stages chiffrés avec gains réels
- Atmosphérique → explication honnête, gains marginaux
- Hybride/Électrique → section masquée

### Typographie
- Titres/chiffres : Cormorant Garamond
- Corps/UI : DM Sans

---

## Outils & Workflow

- **Claude.ai** — stratégie, maquettes HTML avant dev, analyse visuelle via Chrome
- **Claude Code** — génération code (MCP GitHub configuré → repo lNeo0/drivia)
- **Claude in Chrome** — vérification visuelle directe sur localhost:3000

**Workflow établi :**
1. Claude.ai génère une maquette HTML pour valider visuellement
2. Claude.ai génère le prompt Claude Code
3. Claude Code exécute et push sur GitHub
4. Claude in Chrome vérifie le résultat
5. Mise à jour des fichiers _docs en fin de session

## Repo GitHub
https://github.com/lNeo0/drivia

---

*Dernière mise à jour : Session 2 — Options, reprog, M3 E92, design fiabilité, navigation ancre à venir*
