# Drivia — Contexte de reprise
> À coller en début de nouvelle conversation avec Claude pour reprendre le projet

---

## Le projet

**Drivia** est une application web guide pratique pour acheteurs de voitures d'occasion.

### Fonctionnalités actuelles
- Recherche par marque/modèle
- Fiche voiture : puissance, poids, motorisations, fiabilité générale, points sensibles, pannes fréquentes
- Page motorisation détaillée : specs, fiabilité propre au moteur, problèmes connus, cotes marché, checklist adaptée
- Sélecteur de boîte de vitesses par motorisation
- Checklist de visite avant achat (points génériques + spécifiques à la motorisation)

### Stack technique
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Données mockées** dans `src/lib/data.ts` (pas encore de base de données)
- Pas encore de backend ni Supabase

### Structure des fichiers clés
- `src/types/index.ts` — Types TypeScript (TypeMotorisation, TypeBoite, Boite, CoteMarche, FiabiliteMotorisation, Motorisation, Fiabilite, Voiture)
- `src/lib/data.ts` — 8 voitures mockées, 3 enrichies (Golf 7, Clio 4, 308 II), fonctions rechercherVoitures / getVoitureById / getVoitureEtMotorisation / getAllMotorisationParams
- `src/components/NavBar.tsx` — Header sticky
- `src/components/SearchBar.tsx` — Composant client avec useRouter
- `src/components/CarCard.tsx` — Card cliquable pour les résultats
- `src/components/MotorisationCards.tsx` — Composant client interactif (sélecteur boîte + navigation)
- `src/app/page.tsx` — Page d'accueil (hero + recherche + meilleures fiabilités)
- `src/app/recherche/page.tsx` — Page de résultats
- `src/app/voiture/[id]/page.tsx` — Fiche voiture
- `src/app/voiture/[id]/[motorisationSlug]/page.tsx` — Fiche motorisation détaillée

### URLs
- Accueil : `http://localhost:3000`
- Fiche voiture : `http://localhost:3000/voiture/volkswagen-golf-7`
- Fiche motorisation : `http://localhost:3000/voiture/volkswagen-golf-7/1-6-tdi-90ch-bvm5`

---

## État d'avancement

### ✅ Fait
- Setup Next.js 14 + TypeScript + Tailwind
- Structure de données complète avec types TypeScript
- 8 voitures mockées (Golf 7, Clio 4, 308 II enrichies avec données complètes)
- Page d'accueil fonctionnelle
- Page de résultats avec recherche
- Fiche voiture avec motorisations en cards cliquables
- Fiche motorisation détaillée (specs, fiabilité, cotes, checklist)
- Sélecteur de boîte de vitesses
- Refonte design en cours (charte graphique définie)

### 🔄 En cours
- Refonte design complète selon charte graphique (prompt envoyé à Claude Code)

### 📋 À faire
- Base de données Supabase
- Ajouter plus de voitures
- Filtres sur la page de résultats
- Comparateur de voitures
- Génération de fiches via Claude API

---

## Charte graphique (définie, en cours d'implémentation)

### Palette dark mode
- Fond : `#0D0D0D` / Surface : `#141414` / Elevated : `#1C1C1C`
- Texte principal : `#F5F0E8` (blanc cassé chaud) / Secondaire : `#A89880`
- Accent : `#C9A84C` (or) / Hover : `#E8C97A`
- Success : `#4CAF7A` / Warning : `#D48C3A` / Danger : `#C0442E`

### Typographie
- Titres : **Cormorant Garamond** (éditorial, élégant)
- Corps : **DM Sans** (lisible, moderne)

### Ambiance
Dark mode premium, style "guide automobile de référence", or utilisé avec parcimonie, pas flashy.

---

## Outils utilisés
- **Claude.ai** (cette conversation) — stratégie, prompts, analyse visuelle
- **Claude Code** (terminal VS Code) — génération et modification du code
- **Claude in Chrome** (extension) — visualisation directe du rendu dans le navigateur

## Fichiers de suivi
- `drivia-contexte-reprise.md` — ce fichier, à mettre à jour à chaque session
- `drivia-prompts-claude-code.md` — historique de tous les prompts envoyés à Claude Code

---

*Dernière mise à jour : Session 1 — Setup + structure + premières fonctionnalités + charte graphique*
