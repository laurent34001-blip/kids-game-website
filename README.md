# DJOGO - Système de réservation

Plateforme de réservation d’ateliers créatifs pour enfants (6–12 ans) et duos parent-enfant. Le projet couvre la jauge pondérée, les formules tarifaires automatiques, la privatisation et un back-office opérationnel.

## Démarrage rapide

1) Installer les dépendances :

```
npm install
```

2) Générer la base Prisma et migrer :

```
npx prisma migrate dev --name init
```

3) Lancer le serveur :

```
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Endpoints principaux

- GET /api/ateliers
- GET /api/ateliers/:id/disponibilites
- POST /api/reservations
- PUT /api/reservations/:id
- DELETE /api/reservations/:id
- GET /api/animateurs
- GET /api/salles
- POST /api/rules/apply
- GET /api/sessions/:id/recalculate
- POST /api/sessions/:id/privatisation

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Notes

- Le cahier des charges détaillé est dans docs/cahier_des_charges_djogo.txt.
- Le suivi d’implémentation est dans docs/suivi_etapes.txt.

## Déploiement

Utilisez Vercel ou un conteneur Node.js. Configurez la variable `DATABASE_URL` (SQLite en dev, PostgreSQL en prod).
