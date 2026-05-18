# Drivia — Historique des prompts Claude Code

> Tous les prompts envoyés à Claude Code, avec date, objectif et résultat observé.

---

## PROMPT 1 — Structure initiale du projet
**Session :** 1 | **Statut :** ✅ Exécuté avec succès

```
Je construis une application web appelée Drivia. C'est un guide pratique pour les acheteurs de voitures d'occasion.
L'app doit permettre de : rechercher une voiture par marque et modèle, consulter une fiche détaillée, voir les infos de fiabilité, avoir une checklist de vérifications.
Stack : Next.js 14, TypeScript, Tailwind CSS
Crée la structure + pages principales avec données mockées.
```

**Résultat :** src/types/index.ts, src/lib/data.ts (8 voitures), NavBar, SearchBar, CarCard, pages accueil/recherche/fiche

---

## PROMPT 2 — Motorisations détaillées + sélecteur de boîte
**Session :** 1 | **Statut :** ✅ Exécuté avec succès

```
Améliorer la navigation dans les fiches voiture :
- Cards motorisations cliquables avec sélecteur de boîte de vitesses
- Page /voiture/[id]/[motorisation-slug] avec specs, fiabilité moteur, problèmes connus, cotes marché, checklist adaptée
- Enrichir Golf 7, Clio 4, 308 II avec données complètes
```

**Résultat :** Types enrichis, data.ts à 757 lignes, MotorisationCards.tsx, page motorisation créée

---

## PROMPT 3 — Premier redesign (dark mode orange)
**Session :** 1 | **Statut :** ✅ Exécuté, résultat jugé insuffisant

Direction : dark mode, accent orange #F97316, style Apple/Airbnb

**Résultat observé :** Structure améliorée mais accent orange mal appliqué, design jugé insuffisant

---

## PROMPT 4 — Corrections couleurs ciblées (orange)
**Session :** 1 | **Statut :** ✅ Exécuté, améliorations partielles

Corrections couleurs : badges fiabilité, titre modèle, badges motorisation, bouton rechercher

**Résultat observé :** Badges motorisation en orange OK, mais design toujours insatisfaisant. Décision : changer de direction visuelle

---

## PROMPT 5 — Refonte complète selon charte graphique
**Session :** 1 | **Statut :** ✅ Exécuté avec succès

Charte complète : dark mode premium, accent or #C9A84C, Cormorant Garamond + DM Sans

**Résultat observé (Session 2 via Claude in Chrome) :**
- Logo Drivia en or ✅
- Typographie Cormorant Garamond sur les titres ✅
- Chiffres stats en or ✅
- Ambiance générale premium et sobre ✅
- Badges fiabilité en vert partout (à corriger — doit être variable) ❌
- Bouton "Voir la fiche" parfois sans style or ❌
- Étoiles fiabilité en vert (doit être variable) ❌

---

## PROMPT 6 — Corrections design ciblées (fiabilité variable + boutons)
**Session :** 2 | **Statut :** 🔄 À envoyer

**Maquette HTML validée :** `_docs/drivia-maquette-corrections.html`

```
Applique ces corrections design précises sur Drivia. Ne touche pas à la logique ni aux données.

## 1. Couleur fiabilité VARIABLE (règle globale)

Partout où une note de fiabilité est affichée (cards, fiches, blocs), la couleur doit dépendre de la note :
- Note 5 (Excellente) → vert : text #4CAF7A, bg rgba(76,175,122,0.12), border rgba(76,175,122,0.2)
- Note 4 (Bonne) → or : text #C9A84C, bg rgba(201,168,76,0.08), border rgba(201,168,76,0.2)
- Note 3 (Moyenne) → orange : text #D48C3A, bg rgba(212,140,58,0.12), border rgba(212,140,58,0.2)
- Note ≤2 (Mauvaise) → rouge : text #C0442E, bg rgba(192,68,46,0.12), border rgba(192,68,46,0.2)

Crée un helper TypeScript getReliabilityColor(note: number) qui retourne ces valeurs, et utilise-le partout.

## 2. Badge fiabilité dans les CarCards

Le badge (cercle + label) doit utiliser la couleur variable ci-dessus.
Structure :
- Cercle 52px, fond teinté, bordure 1.5px, chiffre en Cormorant Garamond
- Label en dessous : uppercase, 0.6rem, même couleur que le cercle

## 3. Bloc fiabilité sur la fiche voiture (/voiture/[id])

Le bloc fiabilité générale doit avoir :
- Fond teinté selon la note (règle ci-dessus)
- Bordure 1px teintée
- Cercle score à gauche (56px)
- Titre "Bonne fiabilité" / "Excellente fiabilité" etc. dans la couleur correspondante
- Étoiles colorées selon la note (pas toujours vertes)

## 4. Bouton "Voir la fiche" dans les cards

Style outline doré :
- Border : 1px solid #7A5E2A
- Texte : #C9A84C
- Hover : fond #C9A84C, texte #0D0D0D
- Font DM Sans, 0.75rem, uppercase, letter-spacing 0.06em

## 5. Bouton "Rechercher" sur la page d'accueil

- Fond : #C9A84C (or plein)
- Texte : #0D0D0D
- Hover : #E8C97A
- Pas de fond blanc ni transparent
```

**Résultat observé :** En attente

---

## OBSERVATIONS VISUELLES (Claude in Chrome)

### Session 2 — État après Prompt 5
**Page d'accueil :**
- Hero avec titre Cormorant Garamond ✅
- Dégradé radial doré en arrière-plan ✅
- Barre de recherche propre ✅
- Pills marques bien stylées ✅
- Section "Meilleures fiabilités" avec cards ✅

**Fiche voiture (volkswagen-golf-7) :**
- URL correcte : `/voiture/volkswagen-golf-7` ✅
- Chiffres stats en or (Cormorant Garamond) ✅
- Points sensibles avec icônes triangle ✅
- Pannes fréquentes avec icônes ✕ ✅
- Cards motorisation visibles ✅
- Badges fiabilité en vert partout (pas variable) ❌
- Étoiles en vert (pas variable) ❌

---

## PROMPT 7 — Options + Reprog sur toutes les voitures
**Session :** 2 | **Statut :** 🔄 À envoyer

```
Ajoute les sections "Options" et "Potentiel de reprog" à toutes les voitures de Drivia.

## Règles d'affichage (à implémenter dans les composants)
- Une section n'apparaît QUE si les données existent dans le modèle
- Pas de "données non disponibles" — si vide, la section est masquée
- Le profil de la voiture détermine la profondeur des données

## 1. Mise à jour des types (src/types/index.ts)

Ajoute ces interfaces :

type ImportanceOption = 'indispensable' | 'interessante' | 'inutile'
type TypeMoteurReprog = 'turbo' | 'atmospherique' | 'hybride' | 'electrique'
type RecommandationReprog = 'oui' | 'non' | 'selon_usage'

interface Option {
  nom: string
  description: string
  importance: ImportanceOption
  avis: string
}

interface StageReprog {
  nom: string
  puissanceGain: number
  coupleGain: number
  puissanceFinal: number
  coupleFinal: number
  cout: string
  avis: string
}

interface PotentielReprog {
  typeMoteur: TypeMoteurReprog
  avisGeneral: string
  stages: StageReprog[]
  recommandation: RecommandationReprog
  raisonRecommandation: string
}

Ajoute dans Motorisation :
  options?: Option[]
  potentielReprog?: PotentielReprog

## 2. Données par voiture

### Volkswagen Golf 7 (compacte)

Motorisation 1.6 TDI 90ch :
options: [
  { nom: "Radar de recul", importance: 'interessante', description: "Capteurs de stationnement arrière", avis: "Utile au quotidien, vérifier le bon fonctionnement des 4 capteurs lors de la visite." },
  { nom: "GPS natif", importance: 'inutile', description: "Système de navigation d'origine", avis: "Vieilli et lent. Préférez CarPlay/Android Auto si disponible, ou un support téléphone." },
  { nom: "Régulateur de vitesse adaptatif", importance: 'interessante', description: "ACC avec maintien de distance", avis: "Appréciable sur autoroute. Vérifier le bon fonctionnement du radar avant." }
],
potentielReprog: {
  typeMoteur: 'turbo',
  avisGeneral: "Le 1.6 TDI répond bien à la reprog — gains modérés mais réels, surtout en couple. Améliore la souplesse en ville sans dégrader la fiabilité si réalisée sérieusement.",
  stages: [
    { nom: "Stage 1", puissanceGain: 25, coupleGain: 60, puissanceFinal: 115, coupleFinal: 310, cout: "300 – 500 €", avis: "Bon rapport qualité/prix. Le moteur gagne vraiment en souplesse. À faire chez un préparateur reconnu uniquement." },
    { nom: "Stage 2", puissanceGain: 35, coupleGain: 80, puissanceFinal: 125, coupleFinal: 330, cout: "800 – 1200 €", avis: "Nécessite échangeur et modifications. Peu pertinent sur ce moteur — préférez le Stage 1." }
  ],
  recommandation: 'selon_usage',
  raisonRecommandation: "Stage 1 intéressant pour un usage quotidien — le couple supplémentaire se ressent vraiment. Stage 2 non recommandé sur ce moteur."
}

Motorisation 2.0 TDI 150ch :
options: [
  { nom: "DSG7 (boîte automatique)", importance: 'interessante', description: "Boîte à double embrayage 7 rapports", avis: "Confortable mais surveiller les saccades à froid. Préférez la BVM6 si vous aimez conduire." },
  { nom: "Phares full LED", importance: 'interessante', description: "Éclairage LED adaptatif", avis: "Vraie différence de sécurité la nuit. À privilégier si disponible." },
  { nom: "Toit ouvrant panoramique", importance: 'inutile', description: "Toit vitré électrique", avis: "Source de pannes potentielles sur les exemplaires anciens. Tester l'ouverture/fermeture lors de la visite." }
],
potentielReprog: {
  typeMoteur: 'turbo',
  avisGeneral: "Le 2.0 TDI est une base excellente pour la reprog. Gains significatifs en puissance et couple avec un impact minimal sur la fiabilité si réalisée correctement.",
  stages: [
    { nom: "Stage 1", puissanceGain: 40, coupleGain: 80, puissanceFinal: 190, coupleFinal: 420, cout: "350 – 600 €", avis: "Très recommandé. Le moteur passe dans une autre dimension en souplesse et reprise. ROI excellent." },
    { nom: "Stage 2", puissanceGain: 60, coupleGain: 110, puissanceFinal: 210, coupleFinal: 450, cout: "900 – 1500 €", avis: "Possible avec échangeur et downpipe. Risque accru sur l'embrayage et la boîte DSG. Réservé aux passionnés." }
  ],
  recommandation: 'oui',
  raisonRecommandation: "Le 2.0 TDI est l'un des meilleurs moteurs à reprogrammer. Stage 1 fortement recommandé pour quiconque veut plus de dynamisme sans sacrifier la fiabilité."
}

---

### Renault Clio 4 (citadine)

Motorisation 0.9 TCe 90ch :
options: [
  { nom: "Climatisation automatique", importance: 'interessante', description: "Climatisation bi-zone automatique", avis: "Confort réel. Tester le compresseur lors de la visite." },
  { nom: "GPS R-Link", importance: 'inutile', description: "Système multimédia Renault intégré", avis: "Très vieilli et peu réactif. Ignorez-le, un support téléphone avec CarPlay vaut bien mieux." }
],
potentielReprog: {
  typeMoteur: 'turbo',
  avisGeneral: "Le 0.9 TCe est reprogrammable mais les gains restent limités par la petite taille du turbo. Intérêt modéré sur une citadine.",
  stages: [
    { nom: "Stage 1", puissanceGain: 15, coupleGain: 30, puissanceFinal: 105, coupleFinal: 175, cout: "250 – 400 €", avis: "Gain perceptible en ville mais modeste. À faire uniquement si vous gardez longtemps le véhicule." }
  ],
  recommandation: 'selon_usage',
  raisonRecommandation: "Intérêt limité sur une citadine. Budget mieux investi dans l'entretien ou des pneumatiques de qualité."
}

---

### Peugeot 308 II (compacte)

Motorisation 1.6 BlueHDi 120ch :
options: [
  { nom: "Pack GT Line", importance: 'interessante', description: "Sellerie, inserts, look sportif extérieur", avis: "Ajoute du caractère sans impacter la fiabilité. Apprécié à la revente." },
  { nom: "Vitres surteintées", importance: 'inutile', description: "Vitres arrieres teintées d'usine", avis: "Agréable en été mais aucun impact sur la valeur de revente." }
],
potentielReprog: {
  typeMoteur: 'turbo',
  avisGeneral: "Le 1.6 BlueHDi répond très bien à la reprog. Un des meilleurs rapports gains/prix du marché des compactes diesel.",
  stages: [
    { nom: "Stage 1", puissanceGain: 35, coupleGain: 70, puissanceFinal: 155, coupleFinal: 370, cout: "300 – 550 €", avis: "Excellente transformation. Le moteur perd son côté mou et gagne en plaisir de conduite. Recommandé." },
    { nom: "Stage 2", puissanceGain: 55, coupleGain: 100, puissanceFinal: 175, coupleFinal: 400, cout: "800 – 1300 €", avis: "Possible mais surveiller l'embrayage. Réservé à un usage non quotidien." }
  ],
  recommandation: 'oui',
  raisonRecommandation: "Le 1.6 BlueHDi est une excellente base. Stage 1 très recommandé — transforme vraiment le caractère de la voiture."
}

---

### Toyota Yaris III (citadine)

Motorisation 1.5 Hybrid 100ch :
options: [
  { nom: "Pack Design", importance: 'interessante', description: "Jantes alliage, inserts colorés", avis: "Esthétique uniquement. Vérifier l'état des jantes." },
  { nom: "Caméra de recul", importance: 'indispensable', description: "Caméra arrière intégrée", avis: "Très utile sur une citadine. Vérifier la qualité de l'image — les caméras vieillissent mal." }
]
// Pas de reprog sur hybride — section masquée

Motorisation 1.0 VVT-i 69ch :
options: [
  { nom: "Climatisation", importance: 'indispensable', description: "Climatisation manuelle", avis: "Indispensable pour la revente. Vérifier le bon fonctionnement." }
]
// Pas de reprog sur moteur atmo 69ch — section masquée

---

### Dacia Sandero II (économique)

Motorisation 0.9 TCe 90ch :
options: [
  { nom: "Climatisation", importance: 'indispensable', description: "Climatisation manuelle", avis: "Première option à vérifier — impacte fortement la valeur de revente." },
  { nom: "GPS MediaNav", importance: 'inutile', description: "GPS Dacia intégré", avis: "Dépassé. Un support téléphone fait mieux pour 20€." }
],
potentielReprog: {
  typeMoteur: 'turbo',
  avisGeneral: "Le 0.9 TCe Renault se reprogramme facilement. Gains modestes mais réels sur une plateforme économique.",
  stages: [
    { nom: "Stage 1", puissanceGain: 15, coupleGain: 35, puissanceFinal: 105, coupleFinal: 170, cout: "250 – 400 €", avis: "Transforme agréablement le moteur pour un usage quotidien. Coût raisonnable." }
  ],
  recommandation: 'selon_usage',
  raisonRecommandation: "Intéressant si vous gardez le véhicule longtemps. Peu pertinent si vous comptez revendre rapidement."
}

---

### BMW Série 3 F30 (berline premium)

Motorisation 318d 143ch :
options: [
  { nom: "Pack M Sport", importance: 'indispensable', description: "Jantes, carrosserie, volant M, sièges sport", avis: "Très recherché à la revente — une F30 sans Pack M perd 15-20% de valeur. À privilégier absolument." },
  { nom: "GPS Professional", importance: 'interessante', description: "iDrive avec carte HD et mise à jour", avis: "Bien plus agréable que le système de base. Vérifier la version du logiciel." },
  { nom: "Toit ouvrant", importance: 'inutile', description: "Toit ouvrant électrique panoramique", avis: "Source de fuites potentielles. Tester systématiquement lors de la visite." }
],
potentielReprog: {
  typeMoteur: 'turbo',
  avisGeneral: "Le 318d B47 est une très bonne base de reprog. Gains sérieux en couple, transforme le caractère de la voiture.",
  stages: [
    { nom: "Stage 1", puissanceGain: 35, coupleGain: 80, puissanceFinal: 178, coupleFinal: 460, cout: "350 – 600 €", avis: "Excellent. Le moteur devient vraiment plaisant — les reprises sont dans une autre catégorie." },
    { nom: "Stage 2", puissanceGain: 55, coupleGain: 110, puissanceFinal: 198, coupleFinal: 490, cout: "900 – 1500 €", avis: "Possible avec échangeur. Surveiller l'embrayage et la boîte automatique si équipée." }
  ],
  recommandation: 'oui',
  raisonRecommandation: "Stage 1 fortement recommandé. Le 318d devient un moteur vraiment agréable et économique à la fois."
}

---

### Ford Fiesta 7 (citadine)

Motorisation 1.0 EcoBoost 100ch :
options: [
  { nom: "B&O Audio", importance: 'inutile', description: "Système audio Bang & Olufsen", avis: "Bonne qualité mais pas worth le surprix en occasion." },
  { nom: "Aide au stationnement", importance: 'interessante', description: "Capteurs avant et arrière", avis: "Utile sur une citadine urbaine. Tester les 6 capteurs." }
],
potentielReprog: {
  typeMoteur: 'turbo',
  avisGeneral: "Le 1.0 EcoBoost Ford est l'un des moteurs 3 cylindres les plus aboutis du marché. Il répond très bien à la reprog malgré sa petite cylindrée.",
  stages: [
    { nom: "Stage 1", puissanceGain: 25, coupleGain: 50, puissanceFinal: 125, coupleFinal: 220, cout: "300 – 500 €", avis: "Très bonne transformation. Le moteur perd son côté creux à bas régime. Recommandé." }
  ],
  recommandation: 'oui',
  raisonRecommandation: "Le 1.0 EcoBoost est une excellente base. Stage 1 recommandé — rapport qualité/prix très bon sur ce moteur."
}

---

### Citroën C3 III (citadine)

Motorisation 1.2 PureTech 110ch :
options: [
  { nom: "Airbumps", importance: 'inutile', description: "Protections plastique sur les flancs", avis: "Original mais fragilisé avec l'âge. Vérifier l'état — les remplacer coûte cher." },
  { nom: "Climatisation auto", importance: 'interessante', description: "Climatisation automatique", avis: "Confort réel. Tester le compresseur." }
],
potentielReprog: {
  typeMoteur: 'turbo',
  avisGeneral: "Le 1.2 PureTech est reprogrammable mais attention — ce moteur a déjà des problèmes de courroie de distribution. Reprogrammer un moteur fragile n'est pas recommandé.",
  stages: [
    { nom: "Stage 1", puissanceGain: 20, coupleGain: 40, puissanceFinal: 130, coupleFinal: 230, cout: "300 – 500 €", avis: "Techniquement possible mais déconseillé. Le PureTech a des fragilités connues — priorité à l'entretien plutôt qu'à la performance." }
  ],
  recommandation: 'non',
  raisonRecommandation: "Le 1.2 PureTech souffre déjà de problèmes de courroie de distribution. Toute sollicitation supplémentaire augmente les risques. Budget mieux investi dans la prévention."
}

---

## 3. Composants à créer

### src/components/OptionsSection.tsx
- Affichage conditionnel (si options.length > 0 uniquement)
- 3 groupes distincts par importance avec couleurs :
  - indispensable → success color, label "Indispensable ✓"
  - interessante → accent-gold color, label "Intéressante"
  - inutile → text-muted, label "Sans intérêt"
- Chaque item : nom + description + avis en italique

### src/components/ReprogSection.tsx
- Affichage conditionnel (si potentielReprog existe uniquement)
- Badge type moteur visible (Turbo / Atmosphérique / Hybride)
- Avis général en intro
- Tableau des stages : nom | gains | puissance finale | coût | avis
- Si gain = 0 : afficher "Non applicable" sans chiffres
- Badge recommandation final : vert=oui, orange=selon_usage, rouge=non

## 4. Intégration page motorisation
Ajoute OptionsSection et ReprogSection dans /voiture/[id]/[motorisationSlug]/page.tsx
après "Fiabilité de cette motorisation" et avant la checklist.
```
**Résultat observé :** En attente

---

## PROMPT 8 — Navigation ancre sticky sur fiches motorisation
**Session :** 2 | **Statut :** ✅ Exécuté avec succès

**Composant créé :** `src/components/AnchorNav.tsx`
- Position fixed sous la NavBar (top: 64px)
- Invisible jusqu'à 150px de scroll → fade + slide in
- IntersectionObserver pour détecter section active
- Ancres conditionnelles (Options/Reprog/Cotes masquées si données absentes)
- Barre de progression 3px en bas de page (or #C9A84C)
- Scroll offset 124px (NavBar + AnchorNav + margin)

**Résultat observé (via Claude in Chrome) :**
- Barre apparaît au scroll, bien positionnée sous la NavBar ✅
- Lien actif en or avec soulignement doré ✅
- Toutes les ancres présentes et correctes ✅
- Cotes en tableau avec couleurs rouge/or/vert ✅
- Checklist "Points critiques" surlignée en or ✅
- Barre de progression non visible (trop fine ?) — mineur ⚠️

---

## PROMPT 9 — Correction bug ancre "Pannes"
**Session :** 2 | **Statut :** ✅ Exécuté avec succès

**Bug :** Clic sur "Pannes" scrollait vers "Fiabilité" car l'id était imbriqué dans le bloc fiabilité

**Corrections :**
- Section "Pannes" extraite en `<Section id="pannes">` indépendante au même niveau DOM que les autres sections
- Style cohérent avec pointsSensibles (card individuelle, icône ✕ rouge)
- AnchorNav : rootMargin ajusté de `-20% 0px -60% 0px` → `-10% 0px -50% 0px` pour détecter les sections courtes

**Résultat :** Bug corrigé, navigation ancre fonctionnelle sur toutes les sections

---

## PROMPT A — Live search + recherche améliorée
**Session :** 2 | **Statut :** ✅ Exécuté avec succès (après bugfix overflow-hidden)

**Composants créés/modifiés :**
- `src/lib/data.ts` — rechercherVoitures() avec aliases (vw, bm, reno, daf...) + recherche floue
- `src/components/SearchBar.tsx` — live dropdown, debounce 200ms, max 5 suggestions
- `src/components/NavSearch.tsx` — search compact dans la NavBar (200→300px au focus)
- `src/app/page.tsx` — overflow-hidden retiré de la section hero (bloquait le dropdown)

**Bug rencontré et corrigé :**
- Dropdown invisible car la section hero avait `overflow-hidden` qui clippait l'absolu
- Fix : suppression de `overflow-hidden` sur la section en page.tsx

**Résultat observé (via Claude in Chrome) :**
- "golf" → dropdown "Volkswagen Golf 7 · 2012–2020" ✅
- "vw" → alias reconnu, même résultat ✅
- "bm" dans NavSearch → dropdown dans la barre de nav ✅
