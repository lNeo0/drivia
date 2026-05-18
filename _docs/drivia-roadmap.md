# Drivia — Roadmap & Évolutions potentielles

> Fichier de suivi des idées, fonctionnalités à venir et réflexions produit.
> Mis à jour à chaque session de travail.

---

## STATUT ACTUEL

### ✅ En production (données mockées)
- Recherche par marque/modèle
- Fiche voiture : specs, fiabilité générale, points sensibles, pannes fréquentes
- Fiche motorisation : specs techniques, fiabilité moteur, problèmes connus, cotes marché, checklist
- Sélecteur de boîte de vitesses
- Section Options par motorisation (profil-based)
- Section Potentiel de reprog par motorisation (profil-based)
- 9 voitures : Golf 7, Clio 4, 308 II, Yaris III, BMW Série 3 F30, Sandero II, Fiesta 7, C3 III, M3 E92

---

## ÉVOLUTIONS PRIORITAIRES

### 🔥 P1 — Impact fort, à faire maintenant

#### 1. Filtres page de résultats
**Quoi :** Filtrer par segment, type de moteur, budget, note de fiabilité minimum
**Pourquoi :** C'est la première chose qu'un acheteur utilise
**Complexité :** Moyenne

#### 2. Page "Toutes les voitures" améliorée
**Quoi :** Grille responsive avec tri (fiabilité, segment, marque) + filtres
**Pourquoi :** Le lien existe dans la nav mais la page est basique
**Complexité :** Faible

#### 3. Checklist interactive exportable
**Quoi :** Cases cochables pendant la visite + résumé exportable en PDF
**Pourquoi :** Usage mobile sur place, vraie valeur ajoutée vs concurrents
**Complexité :** Moyenne

#### 4. Base de données Supabase
**Quoi :** Remplacer les données mockées par une vraie BDD
**Pourquoi :** Permettre d'ajouter des voitures sans toucher au code
**Complexité :** Élevée

---

### ⚡ P2 — Impact moyen, étape suivante

#### 5. Comparateur 2 voitures
**Quoi :** Comparer côte à côte fiabilité, prix, consommation, reprog, options
**Pourquoi :** Très utile pour un acheteur hésitant entre deux modèles
**Complexité :** Moyenne

#### 6. Plus de voitures via Claude API
**Quoi :** Générer des fiches automatiquement via l'API Claude
**Pourquoi :** 9 voitures c'est trop peu — objectif 50+ modèles
**Complexité :** Élevée

#### 7. Coût d'entretien annuel estimé
**Quoi :** Révision, consommables, pièces d'usure — coût annuel moyen par modèle
**Pourquoi :** Donnée absente partout, très recherchée par les acheteurs
**Complexité :** Faible (données mockées) → Élevée (données réelles)

#### 8. Mode visite mobile
**Quoi :** Vue simplifiée de la checklist optimisée mobile, grands boutons, mode plein écran
**Pourquoi :** L'app doit être utilisable sur place lors de l'inspection
**Complexité :** Faible

---

### 💡 P3 — Valeur ajoutée différenciante

#### 9. Système de contribution utilisateur ⭐
**Quoi :** Permettre aux utilisateurs de contribuer aux sections vides ou d'enrichir les données existantes
**Pourquoi :** La communauté peut enrichir les fiches bien plus vite qu'une équipe éditoriale

**Réflexions sur l'implémentation :**
- **Option A — Formulaire par section** : bouton "Compléter cette section" sur chaque bloc vide (options, reprog, fiabilité). Formulaire contextuel avec les champs de la section. Soumission → modération avant publication.
- **Option B — Signalement enrichi** : bouton "Suggérer une correction / un ajout" global sur chaque fiche. Formulaire libre avec catégorie (options, reprog, panne, cote...). Plus simple à implémenter.
- **Option C — Votes communautaires** : les utilisateurs votent pour valider/invalider des infos existantes. Système de score de confiance par donnée.

**Questions ouvertes :**
- Modération : automatique (seuil de votes) ou manuelle ?
- Authentification nécessaire ou contribution anonyme ?
- Récompense pour les contributeurs (badge, profil) ?
- Comment éviter le spam et les données fausses ?

**Recommandation :** Commencer par l'Option B (signalement simple) sans auth, puis évoluer vers l'Option A (formulaire par section) une fois Supabase en place.

**Complexité :** Moyenne (Option B) → Élevée (Option A + modération)

#### 10. Alertes prix
**Quoi :** L'utilisateur s'inscrit pour recevoir une alerte quand une voiture passe sous un certain prix
**Pourquoi :** Fonctionnalité d'engagement forte
**Complexité :** Élevée (nécessite scraping + backend + email)

#### 11. Historique des rappels constructeur
**Quoi :** Afficher les rappels officiels (NHTSA, données constructeur) par modèle
**Pourquoi :** Information critique souvent ignorée des acheteurs
**Complexité :** Moyenne (APIs publiques disponibles)

#### 12. "Ma liste de voitures"
**Quoi :** Sauvegarder des fiches en favoris, comparer, noter
**Pourquoi :** Engagement utilisateur, sessions multiples
**Complexité :** Faible (localStorage) → Moyenne (compte utilisateur)

---

## DÉCISIONS TECHNIQUES PRISES

### Architecture données
- **Profil de voiture** : determine quelles sections afficher
  - `sportive` → Options complètes + Reprog complète
  - `compacte` → Options simplifiées + Reprog si version turbo/GTI
  - `citadine` → Options essentielles, Reprog masquée
  - `economique` → Options minimalistes, Reprog masquée
- **Sections conditionnelles** : une section n'apparaît que si les données existent (pas de "données non dispo")
- **Champs optionnels** : `options?` et `potentielReprog?` dans l'interface Motorisation

### Règle reprog
- Moteur turbo → stages chiffrés (gains réels)
- Moteur atmosphérique → explication honnête, gains marginaux affichés clairement
- Moteur hybride/électrique → section masquée ou "non applicable"

---

## NOTES PRODUIT

### Ce que Drivia n'est PAS
- Pas une marketplace (pas d'annonces, pas de mise en relation vendeur)
- Pas un forum (pas de commentaires libres non modérés)
- Pas un comparateur de prix en temps réel

### Ce que Drivia EST
- Un guide d'achat de référence, éditorial et fiable
- Un outil pratique utilisé pendant la visite (checklist)
- Une source d'info différenciante (reprog, options, coût entretien)

---

*Dernière mise à jour : Session 2*
