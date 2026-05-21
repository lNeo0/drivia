# Drivia — Roadmap & Évolutions
> Triée par priorité d'impact. Mise à jour Session 3.

---

## 🔴 P0 — Corrections immédiates (quick wins, <2h chacun)

### 1. ⚠️ Retraitement images pipeline (remove.bg + seuil 75)
Images actuelles = Wikimedia brutes sans bg removal. Seuil trop bas (60→75).
Solution : remove.bg API (50 img/mois gratuit) + forceReprocess sur les 9 voitures.
**Prérequis : clé API remove.bg dans .env.local**

### 2. Grille 2 colonnes sur l'accueil
La section "Meilleures fiabilités" passe de liste pleine largeur verticale à une grille 2 colonnes.
Ajouter un lien "Voir les 9 voitures →" en bas.
**Impact : densité d'info, donne envie d'explorer**

### 3. Bloc "Verdict rapide" en haut de chaque fiche motorisation
3 lignes avant même les specs :
- ⚠ Point critique principal (ex: "FAP à surveiller sur trajets courts")
- 💰 Cote correcte (ex: "9 000 – 13 000 €")
- ✓ Verdict (ex: "Bon achat si entretien suivi")
**Impact : répond au besoin de l'utilisateur pressé**

### 4. Bouton "Préparer ma visite →" sur la fiche voiture
Sur la page /voiture/[id], ajouter un CTA visible qui pointe vers la motorisation recommandée + section checklist.
**Impact : guide l'utilisateur vers l'outil le plus précieux**

---

## 🟠 P1 — Features à fort impact (prochaines sessions)

### 5. Questionnaire "Aide-moi à choisir"
5-6 questions : budget, usage (ville/route), carburant, nombre de places, kilométrage cible, importance fiabilité vs plaisir.
Résultat : 2-3 recommandations personnalisées avec explication.
Point d'entrée sur la page d'accueil — bouton bien visible.
**Impact : couvre le parcours "je ne sais pas quoi acheter" — majorité des visiteurs**

### 6. Voitures similaires / alternatives
En bas de chaque fiche voiture : "Si vous aimez la Golf 7, regardez aussi..."
2-3 alternatives du même segment, triées par fiabilité.
Calcul automatique basé sur le segment et la cote de fiabilité.
**Impact : rétention + aide à la comparaison sans quitter l'app**

### 7. Mode visite mobile optimisé
Vue dédiée de la checklist pour mobile : grands boutons, police agrandie, mode plein écran possible.
Accessible via le bouton "Préparer ma visite" (voir P0 #4).
Points critiques en rouge très visibles, points génériques groupés.
**Impact : killer feature — personne ne le fait bien sur le marché**

### 8. Accès rapide checklist depuis la fiche voiture
Lien/bouton direct depuis les cards motorisation vers la checklist de cette motorisation.
Évite à l'utilisateur de scroller toute la fiche motorisation pour atteindre la checklist.
**Impact : fluidité du parcours de visite**

---

## 🟡 P2 — Enrichissement contenu & fonctionnel

### 9. Comparateur 2 voitures
Sélectionner 2 modèles, comparer côte à côte :
fiabilité, cote, poids, conso, options recommandées, potentiel reprog.
**Impact : fort pour l'acheteur hésitant entre 2 modèles**

### 10. Coût d'entretien annuel estimé
Révision, consommables, pièces d'usure — coût annuel moyen par modèle.
Donnée absente partout sur le web, très recherchée.
Données mockées dans un premier temps.
**Impact : différenciant fort**

### 11. Plus de voitures via Claude API
Générer des fiches automatiquement via l'API Claude avec un prompt structuré.
Objectif : passer de 9 à 30-50 modèles.
**Impact : crédibilité et couverture du catalogue**

### 12. Historique personnel (localStorage)
"Mes voitures consultées" — liste des fiches visitées.
"Mes checklists" — checklists commencées avec progression.
Accessible depuis la nav, sans compte utilisateur.
**Impact : engagement multi-sessions**

---

## 🔵 P3 — Évolutions structurantes (moyen terme)

### 13. Rappels constructeur
Afficher les rappels officiels par modèle (données publiques DGCCRF / NHTSA).
Information critique souvent ignorée des acheteurs.
**Impact : différenciant éditorial**

### 15. ✅ Pipeline images automatique (fait — Session 6)
Wikimedia Commons → scoring Claude Haiku Vision → normalisation Sharp 1600×900 → Vercel Blob → Prisma CarImage.
9/9 voitures traitées. Background removal isolé pour compatibilité WSL2. Idempotent (forceReprocess).
Images branchées dans les composants — Session 7. ✅
**Impact : images propres et maîtrisées, pas de dépendance externe à la livraison**

### 14. ✅ BDD PostgreSQL Neon + Prisma (fait — Session 5)
PostgreSQL sur Neon.tech avec Prisma ORM 7. Migration initiale appliquée, 9 voitures seedées.
Prochaine étape : brancher les pages sur la BDD (remplacer `src/lib/data.ts` par des requêtes Prisma).
Données mockées conservées en parallèle — aucune régression.
**Impact : scalabilité, base pour le contenu dynamique**

### 15. Système de contribution utilisateur
Bouton "Suggérer une correction / un ajout" sur chaque fiche (Option B — signalement simple, sans auth).
Formulaire libre avec catégorie (panne, option, cote...).
Évolution possible vers formulaires par section une fois Supabase en place.
**Impact : enrichissement communautaire du contenu**

### 16. Refonte DA Direction D+
Palette #141416, accent cyan #2DD4BF, Syne + DM Sans.
Hero avec preview fiche motorisation, cards avec glow cursor, stats band.
Maquette disponible : `_docs/drivia-da-D-plus.html`
**Impact : modernisation visuelle — en pause, pas urgent**

---

## ❄️ Backlog — Idées futures

- Alertes prix (scraping + email) — nécessite backend
- "Ma liste" / favoris — nécessite compte utilisateur
- Chat IA par modèle — fort potentiel mais moins prioritaire que l'aide à la décision
- Vues éclatées pièces + références OEM — API payante (HaynesPro/7zap), réserver pour plus tard

---

*Dernière mise à jour : Session 6 — Pipeline images automatique (9/9 voitures)*
