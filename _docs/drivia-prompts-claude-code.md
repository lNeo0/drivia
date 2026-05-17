# Drivia — Historique des prompts Claude Code

> Tous les prompts envoyés à Claude Code, avec date, objectif et résultat observé.

---

## PROMPT 1 — Structure initiale du projet
**Date :** Session 1  
**Objectif :** Créer la structure de base de l'app avec données mockées  
**Statut :** ✅ Exécuté avec succès

```
Je construis une application web appelée Drivia. C'est un guide pratique pour les acheteurs de voitures d'occasion. 

L'app doit permettre de :
- Rechercher une voiture par marque et modèle
- Consulter une fiche détaillée avec : puissance, poids, motorisations disponibles, consommation
- Voir les infos de fiabilité : points sensibles, pannes fréquentes, avis général
- Avoir une checklist de vérifications à faire lors d'une visite

Stack : Next.js 14, TypeScript, Tailwind CSS

Pour l'instant, crée la structure de dossiers du projet et les pages principales :
- Page d'accueil avec barre de recherche
- Page de résultats
- Page fiche voiture

Utilise des données mockées pour l'instant, pas de base de données.
```

**Résultat :**
- `src/types/index.ts` — 7 types TypeScript
- `src/lib/data.ts` — 8 voitures mockées, 2 fonctions utilitaires
- `src/components/` — NavBar, SearchBar, CarCard
- `src/app/page.tsx` — Page d'accueil avec hero + recherche + fiabilités
- `src/app/recherche/page.tsx` — Page de résultats
- `src/app/voiture/[id]/page.tsx` — Fiche voiture

---

## PROMPT 2 — Motorisations détaillées + sélecteur de boîte
**Date :** Session 1  
**Objectif :** Ajouter navigation vers fiche motorisation + sélecteur boîte  
**Statut :** ✅ Exécuté avec succès

```
Je veux améliorer la navigation dans les fiches voiture de Drivia.

## Nouveau parcours utilisateur

1. Fiche voiture (ex: VW Golf 7)
   → Affiche les motorisations disponibles de façon visuelle (cards cliquables, pas juste un tableau)
   → Chaque card motorisation montre : nom (ex: 1.6 TDI), puissance, type (diesel/essence/hybride), consommation officielle
   → Si une motorisation a plusieurs boîtes de vitesse disponibles (manuelle / automatique / DSG...), afficher un sélecteur pour choisir

2. Page motorisation (ex: Golf 7 1.6 TDI 115ch BVM6)
   → URL : /voiture/[id]/[motorisation-slug]
   → Sections à afficher :
      - Specs techniques : puissance, couple, consommation officielle, consommation réelle estimée, boîte sélectionnée
      - Fiabilité propre à cette motorisation : note + avis spécifique (différent de la fiabilité générale du modèle)
      - Problèmes connus spécifiques à ce moteur (pas les mêmes que la fiche générale)
      - Cotes / prix marché : fourchette basse / moyenne / haute selon l'année et le kilométrage (données mockées)
      - Checklist de visite adaptée : points génériques + points spécifiques à cette motorisation

## Travail à faire

1. Mettre à jour les types TypeScript pour supporter ces nouvelles données
2. Enrichir les données mockées de 2-3 voitures avec ces infos détaillées (Golf 7, Clio 4, 308 II suffisent pour commencer)
3. Créer la page /voiture/[id]/[motorisation-slug] avec toutes les sections
4. Mettre à jour la fiche voiture existante pour afficher les motorisations en cards cliquables avec sélecteur de boîte si nécessaire

Garde le style Tailwind existant et reste cohérent avec le design actuel.
```

**Résultat :**
- Types enrichis (TypeBoite, Boite, CoteMarche, FiabiliteMotorisation ajoutés)
- `src/lib/data.ts` étendu à 757 lignes, 6 motorisations enrichies sur Golf 7 / Clio 4 / 308 II
- `src/components/MotorisationCards.tsx` — composant client interactif
- `src/app/voiture/[id]/[motorisationSlug]/page.tsx` créé avec toutes les sections

---

## PROMPT 3 — Premier redesign (dark mode amélioré)
**Date :** Session 1  
**Objectif :** Refonte visuelle — dark mode élégant, accent orange, style Apple/Airbnb  
**Statut :** ✅ Exécuté, résultat jugé insuffisant

```
Je veux refondre complètement le design de Drivia. Voici la direction précise :

## Direction visuelle
- Dark mode élégant et premium — pas noir pur, utilise des gris profonds (ex: #0F0F0F, #1A1A1A, #242424)
- Couleur d'accent : orange chaleureux (ex: #F97316 ou similaire) — utilisé avec parcimonie sur les éléments clés
- Inspiration Apple / Airbnb : beaucoup d'espace, typographie soignée, hiérarchie visuelle forte
- Coins arrondis généreux, ombres subtiles, séparations légères plutôt que des bordures dures

## Typographie
- Titres grands et aérés, font-weight bold
- Texte courant lisible, bon contraste (pas de gris trop clair sur fond sombre)
- Hiérarchie claire : titre page > section > label > valeur

[... composants détaillés ...]

Garde toute la logique et les données existantes, ne touche qu'au style et à la présentation.
```

**Résultat observé (via Claude in Chrome) :**
- Structure améliorée, plus aérée
- Accent orange présent sur badges motorisation ✅
- Mais : bloc fiabilité bordeaux/marron lourd ❌
- "Golf 7" toujours en gris au lieu d'orange ❌
- Cards stats avec bordure orange trop agressive ❌
- Design jugé globalement insuffisant par l'utilisateur

---

## PROMPT 4 — Corrections couleurs ciblées
**Date :** Session 1  
**Objectif :** Corriger les couleurs spécifiques (accent orange manquant sur plusieurs éléments)  
**Statut :** ✅ Exécuté, améliorations partielles

```
Corrections design urgentes sur Drivia :

1. Couleur accent : remplace TOUTES les couleurs vertes et bleues par de l'orange (#F97316). 
   Notamment : badge fiabilité "Bonne/Excellente", le chiffre de note, les étoiles actives.

2. Titre page voiture : "Volkswagen Golf 7" — le nom du modèle (Golf 7) doit être en orange #F97316, pas en gris.

3. Badges type motorisation dans les cards :
   - Essence → orange (#F97316 fond, texte blanc)
   - Diesel → bleu foncé (#1E40AF fond, texte blanc)  
   - Hybride → vert (#15803D fond, texte blanc)
   - GPL → violet

4. Pills boîte de vitesse dans les cards : la boîte sélectionnée/disponible doit être en orange, les autres en gris foncé.

5. NavBar : ajoute un z-index élevé et un backdrop-blur pour qu'elle ne se superpose pas au contenu au scroll. 
   Le logo "Drivia" doit être en blanc avec le "i" ou un point en orange.

6. Page d'accueil : le bouton "Rechercher" doit être en orange plein (#F97316), pas en blanc.

Ne change rien à la structure ni aux données, uniquement les couleurs et styles.
```

**Résultat observé :**
- Badges motorisation en orange ✅
- Quelques corrections appliquées ✅
- Design toujours pas satisfaisant globalement ❌
- Décision : changer complètement de direction visuelle

---

## PROMPT 5 — Refonte complète selon charte graphique (EN COURS)
**Date :** Session 1  
**Objectif :** Refonte totale avec nouvelle charte : dark mode premium, accent or (#C9A84C), typographies Cormorant Garamond + DM Sans  
**Statut :** 🔄 En cours d'exécution

```
[Prompt complet de refonte design Drivia v1.0 — voir document partagé dans la conversation]

Palette :
- Fond : #0D0D0D / Surface : #141414 / Elevated : #1C1C1C
- Accent or : #C9A84C
- Texte : #F5F0E8

Typographie :
- Cormorant Garamond (titres/chiffres)
- DM Sans (corps/UI)

Ambiance : guide automobile de référence, premium, sobre
```

**Résultat observé :** En attente — Claude Code en cours d'exécution

---

## OBSERVATIONS VISUELLES (via Claude in Chrome)

### Session 1 — État après Prompt 4
**Page d'accueil :**
- Hero aéré avec grand titre ✅
- Barre de recherche propre ✅
- Pills marques bien stylées ✅
- Cards fiabilité lisibles ✅
- Pas d'accent orange visible sur le bouton Rechercher ❌

**Fiche voiture (volkswagen-golf-7) :**
- URL correcte : `/voiture/volkswagen-golf-7`
- Titre "Volkswagen Golf 7" — modèle en gris ❌
- Stats (poids/puissance/versions) en cards avec bordure orange ✅
- Bloc fiabilité bordeaux lourd ❌
- Points sensibles avec icônes triangle orange ✅
- Pannes fréquentes avec icônes ✕ rouge ✅
- Cards motorisation : badges Essence orange, Diesel bleu ✅
- Sélecteur boîte de vitesses fonctionnel ✅
- Checklist visible en bas ✅
