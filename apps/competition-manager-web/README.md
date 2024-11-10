# Competition Manager Web

## Idée de découpage du frontend

(From ChatGPT)

### 1. Navbar
**Composants principaux :**
   - **Logo** : Un composant pour afficher le logo.
   - **NavItem** : Créer un composant pour chaque item du menu (Accueil, Calendrier, Résultats, Admin, Mon compte/Se connecter).
   - **Responsive Menu** : Une version hamburger menu pour le mobile.

### 2. Accueil
**Idées de contenu :**
   - **Bannière** : Un composant Hero avec un titre de bienvenue et une description rapide du site.
   - **Section mise en avant** : Cards avec les compétitions récentes ou les actualités.
   - **Statistiques globales** : Quelques chiffres clés sous forme de Card (ex. : nombre d'utilisateurs inscrits, nombre de compétitions, etc.).

**Composants principaux :**
   - **Hero** : MUI Box avec image d’arrière-plan.
   - **HighlightCard** : Card pour les événements à mettre en avant.
   - **StatsSummary** : Card ou MUI Grid pour les statistiques globales.

### 3. Calendrier/Résultat
   - **CompetitionList** : Une liste d’éléments cliquables pour chaque compétition.
   - **CompetitionItem** : Item pour chaque compétition avec un aperçu (date, lieu, statut).

**Fonctionnalités :**
   - Filtre (ex : type de compétition, date, etc.).
   - Pagination ou infinite scroll.

### 4. Competition
**Tabs de navigation :**
   - **Tabs MUI** pour naviguer entre les sous-sections Aperçu, S’inscrire, Horaire, Live Results.

**Sous-sections :**
   - **Aperçu** :
      - **CompetitionDetails** : Informations sur la compétition (date, lieu, club, description).
      - **StatsCard** : Afficher des stats comme le nombre d’inscrits, éventuellement avec des graphiques (utiliser `Chart.js` pour des graphiques dans MUI).
   - **S’inscrire** :
      - **Stepper MUI** : Gérer le processus d'inscription par étapes.
   - **Horaire** :
      - **ScheduleList** : Liste des horaires de la compétition.
      - **ScheduleItem** : Un élément individuel pour chaque créneau horaire.
   - **Live Result** :
      - **LiveResultsTable** : Tableau pour afficher les résultats en direct.
      - **Filters/Sorting** : Options pour filtrer ou trier les résultats.

### 5. Admin
   - **CompetitionAdminList** : Liste des compétitions avec options d’édition/suppression.
   - **NewCompetitionForm** : Formulaire pour créer une nouvelle compétition.
   
### 6. AdminCompetition
   - Tabs pour les différentes sections (Aperçu, Horaire, inscriptions, confirmation, live result, finance, stats).
   - Chaque tab peut reprendre des composants similaires à ceux de la section **Competition**, avec des composants supplémentaires pour :
      - **FinanceTable** : Vue des finances pour la compétition.
      - **StatsGraph** : Graphiques de statistiques plus avancés.

### 7. Mon compte
   - **UserInfo** : Affiche les informations de l'utilisateur.
   - **UserRegistrations** : Liste des inscriptions de l'utilisateur (passées et à venir).
   - **ResultsList** : Liste des résultats de l'utilisateur.

**Composants principaux :**
   - **AccountInfoCard** : Afficher les informations utilisateur.
   - **RegistrationHistory** : Historique des inscriptions.
   - **ResultsSummary** : Résumé des résultats sous forme de tableau ou liste.




