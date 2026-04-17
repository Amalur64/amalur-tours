# Amalur Tours

Site web professionnel pour **Amalur Tours** — visites guidées authentiques au Pays Basque (Bayonne & Biarritz).

## Stack technique

- **Framework** : Next.js 16 (App Router) + TypeScript
- **Styling** : Tailwind CSS v4
- **i18n** : next-intl (FR / EN / ES)
- **Paiement** : Stripe Checkout
- **Déploiement** : Vercel

## Démarrage rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Renseigner les clés dans `.env.local` :

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://www.amalurtours.com
NEXT_PUBLIC_WHATSAPP_NUMBER=33600000000
```

### 3. Lancer en développement

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000` (redirige automatiquement vers `/fr`).

### 4. Build de production

```bash
npm run build
npm start
```

## Structure du projet

```
src/
├── app/
│   ├── [locale]/          # Pages trilingues
│   │   ├── page.tsx       # Accueil
│   │   ├── tours/         # Liste + détail des tours
│   │   ├── about/         # À propos
│   │   ├── contact/       # Contact
│   │   └── groups/        # Groupes & Agences
│   ├── api/               # Routes API
│   │   ├── stripe/        # Checkout + Webhook
│   │   └── contact/       # Formulaire contact
│   ├── layout.tsx         # Root layout
│   ├── robots.ts          # robots.txt
│   └── sitemap.ts         # Sitemap XML
├── components/            # Composants React
├── i18n/                  # Config next-intl
├── lib/                   # Utilitaires (Stripe, tours, schema)
└── messages/              # Traductions FR/EN/ES
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/[locale]` | Hero, tours, témoignages, pourquoi nous |
| Tours | `/[locale]/tours` | Liste des 3 tours |
| Détail tour | `/[locale]/tours/[slug]` | Infos + widget de réservation |
| À propos | `/[locale]/about` | Histoire de la fondatrice |
| Contact | `/[locale]/contact` | Formulaire + WhatsApp |
| Groupes | `/[locale]/groups` | Offre B2B + demande de devis |

## Tours disponibles

- **Bayonne Walking Tour** — 25€, ~1h30
- **Biarritz Walking Tour** — 25€, ~1h30
- **Bayonne + Biarritz Combo** — 45€, ~4h

Enfants (-12 ans) : gratuit | Ados (12-17) : -50%

## Déploiement sur Vercel

1. Connecter le repo GitHub à Vercel
2. Ajouter les variables d'environnement dans les settings Vercel
3. Déployer (build automatique à chaque push)

## Prochaines étapes (Phase 2)

- [ ] Intégration Supabase pour stocker les réservations
- [ ] Emails de confirmation via Resend
- [ ] Synchronisation Google Calendar
- [ ] Dashboard admin (`/admin`)
- [ ] Blog avec Sanity CMS
- [ ] Channel manager (Rezdy/Bokun) pour synchro OTAs
