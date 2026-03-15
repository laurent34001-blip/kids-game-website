# DJOGO - Système de réservation d'ateliers créatifs

Plateforme de réservation intelligente pour ateliers créatifs destinée aux enfants (6–12 ans) et duos parent-enfant. DJOGO gère complexité opérationnelle avec jauge pondérée, formules tarifaires automatiques, privatisation de sessions et un back-office complet.

## 📋 Table des matières

- [À propos](#à-propos)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage rapide](#démarrage-rapide)
- [Architecture du projet](#architecture-du-projet)
- [Règles métier](#règles-métier)
- [API Endpoints](#api-endpoints)
- [Base de données](#base-de-données)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Documentation](#documentation)

## À propos

DJOGO est un système de réservation d'ateliers créatifs conçu pour :

- **Gérer les capacités pondérées** : Enfants seuls (1 unité) et duos parent-enfant (1.25 unités) avec capacité maximale de 10 unités par session
- **Automatiser les formules tarifaires** : Application dynamique de formules selon les combinaisons de participants (Trio, Groupe Enfants, Duo Plus, etc.)
- **Privatiser automatiquement** : Trigger de privatisation basé sur la capacité ou des règles personnalisées
- **Opérations back-office** : Gestion complète des sessions, salles, animateurs, disponibilités et règles tarifaires
- **Conformité et sécurité** : Architecture RGPD-ready avec double vérification (front + backend)

## Prérequis

- **Node.js** : v18+ recommandé
- **npm** ou **yarn**
- **SQLite** (développement local) ou **PostgreSQL** (production)
- **Git**

## Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd kids-game-website
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer la base de données

Créer un fichier `.env.local` à la racine du projet :

```env
DATABASE_URL="file:./dev.db"
```

### 4. Exécuter les migrations

```bash
npx prisma migrate dev
```

### 5. Configurer les données initiales (optionnel)

```bash
npm run prisma:seed
```

## Démarrage rapide

### Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Autres commandes utiles

```bash
npm run build          # Construire pour la production
npm start              # Lancer la version production
npm run lint           # Lancer ESLint
```

## Architecture du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── admin/             # Tableau de bord administrateur
│   ├── api/               # Endpoints API
│   ├── les-ateliers/      # Pages publiques des ateliers
│   ├── reservation/       # Page de réservation
│   └── globals.css
├── components/             # Composants React réutilisables
│   ├── atelier/           # Composants métier ateliers
│   └── menu/              # Navigation commune
└── lib/                    # Utilitaires et logique métier
    ├── auth.ts            # Gestion d'authentification
    ├── prisma.ts          # Client Prisma
    ├── rules.ts           # Moteur de règles tarifaires
    ├── session.ts         # Gestion des sessions
    └── workshops.ts       # Utilitaires ateliers

prisma/
├── schema.prisma          # Schéma de base de données
├── migrations/            # Historique des migrations
└── seed.js               # Données d'initialisation
```

## Règles métier

### 🔐 Jauge pondérée

Le système de capacité repose sur une jauge pondérée :

| Type de participant | Poids | Exemple pour 10 unités max |
|---|---|---|
| Enfant seul | 1 unité | 10 enfants seuls |
| Duo parent-enfant | 1.25 unités | 8 duos = 10 unités |
| Mix | Variable | 6 enfants + 3 duos = 9.75 unités ✅ |

**Règles** :
- Capacité maximale : 10 unités par défaut (configurable)
- Recalcul automatique à chaque réservation/modification/suppression
- Double vérification (frontend + backend)
- Aucune dérogation possible

### 📦 Formules tarifaires automatiques

Le système détecte automatiquement les combinaisons et applique les formules :

- **Trio** : 1 duo + 1 enfant seul
- **Groupe Enfants** : 6+ enfants seuls
- **Duo Plus** : 4+ duos
- Appliquer les remises ou tarifs spécifiques selon le type

### 🎉 Privatisation automatique

Une session devient privatisée (non disponible au public) si :

- La jauge pondérée atteint la capacité maximale
- Le nombre total de participants dépasse un seuil
- Une règle personnalisée est déclenchée
- Un administrateur la force manuellement

**Conséquences** :
- Application d'une formule spécifique (ex: Pack Anniversaire)
- Blocage des nouvelles réservations publiques
- Visibilité spéciale dans le back-office

## API Endpoints

### Ateliers

```
GET /api/ateliers                      # Lister tous les ateliers
GET /api/ateliers/:id                  # Détails d'un atelier
GET /api/ateliers/:id/disponibilites   # Disponibilités d'un atelier
```

### Réservations

```
POST /api/reservations                 # Créer une réservation
PUT /api/reservations/:id              # Modifier une réservation
DELETE /api/reservations/:id           # Annuler une réservation
GET /api/reservations/:id              # Détails d'une réservation
```

### Sessions

```
GET /api/sessions                      # Lister les sessions
POST /api/sessions                     # Créer une session
GET /api/sessions/:id/recalculate      # Recalculer la capacité
POST /api/sessions/:id/privatisation   # Privatiser une session
POST /api/sessions/batch               # Opérations batch
DELETE /api/sessions/batch-delete      # Suppression batch
```

### Administration

```
GET /api/animateurs                    # Lister les animateurs
POST /api/animateurs                   # Créer un animateur
GET /api/salles                        # Lister les salles
POST /api/salles                       # Créer une salle
POST /api/rules/apply                  # Appliquer les règles tarifaires
```

## Base de données

### Schéma principal

Voir [prisma/schema.prisma](prisma/schema.prisma) pour la structure complète.

**Entités principales** :
- `Workshop` : Ateliers créatifs
- `Session` : Occurrences de date/heure d'un atelier
- `Reservation` : Réservations de participants
- `Participant` : Informations individuelles (nom, âge, taille, allergies)
- `Animator` : Animateurs et leurs disponibilités
- `Room` : Salles de travail
- `User` : Adminstrateurs

### Migrations

Toutes les migrations sont dans [prisma/migrations/](prisma/migrations/).

Pour créer une nouvelle migration :

```bash
npx prisma migrate dev --name <descriptive_name>
```

## Développement

### Structure du code

- **TypeScript** : Typage strict pour fiabilité
- **Next.js 16** : Framework React avec SSR et API routes
- **Prisma ORM** : Gestion de base de données type-safe
- **Tailwind CSS** : Styling utilitaire
- **ESLint** : Linting et qualité du code

### Linting et formatage

```bash
npm run lint              # Vérifier les erreurs
npm run lint -- --fix    # Auto-corriger
```

### Prisma Studio

Visualiser et gérer les données en temps réel :

```bash
npx prisma studio
```

## Déploiement

### Sur Vercel (recommandé)

1. Pousser le code vers GitHub
2. Importer le projet dans Vercel
3. Configurer les variables d'environnement :
   - `DATABASE_URL` : Chaîne de connexion PostgreSQL
   - Autres variables si nécessaire

4. Déployer

### Sur conteneur Node.js personnalisé

1. Construire l'image :

```bash
npm run build
```

2. Lancer le serveur :

```bash
npm start
```

**Variables d'environnement requises** :
- `DATABASE_URL` : PostgreSQL en production, SQLite en dev
- `NODE_ENV` : `production` ou `development`

## Documentation

- **Cahier des charges** : [docs/cahier_des_charges_djogo.txt](docs/cahier_des_charges_djogo.txt)
- **Suivi d'implémentation** : [docs/suivi_etapes.txt](docs/suivi_etapes.txt)
- **Schéma Prisma** : [prisma/schema.prisma](prisma/schema.prisma)

---

**Dernière mise à jour** : Février 2026
