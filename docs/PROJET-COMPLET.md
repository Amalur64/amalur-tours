# Amalur Tours — Documentation Projet Complète

## 1. Résumé du projet

**Amalur Tours** est un site web professionnel pour une entreprise de visites guidées au Pays Basque (Bayonne & Biarritz), fondée et gérée par une seule personne. Le site remplace l'ancien site SiteW.

- **URL** : amalurtours.com (+ redirection amalurtours.fr)
- **Stack** : Next.js 16, TypeScript, Tailwind CSS v4, Stripe, next-intl
- **Langues** : Français, Anglais, Espagnol

---

## 2. Pages créées

| Page | Route | Statut |
|------|-------|--------|
| Accueil | `/[locale]` | Fait |
| Nos Tours | `/[locale]/tours` | Fait |
| Bayonne Tour | `/[locale]/tours/bayonne` | Fait |
| Biarritz Tour | `/[locale]/tours/biarritz` | Fait |
| Combo Tour | `/[locale]/tours/combo` | Fait |
| À Propos | `/[locale]/about` | Fait |
| Contact | `/[locale]/contact` | Fait |
| Groupes & Agences | `/[locale]/groups` | Fait |
| Blog | `/[locale]/blog` | Fait |
| Articles Blog | `/[locale]/blog/[slug]` | Fait (10+ articles) |

---

## 3. Tours & Tarifs

| Tour | Prix adulte | Prix ado (12-17) | Enfant (-12) | Durée |
|------|------------|------------------|--------------|-------|
| Bayonne Walking Tour | 25€ | 12.50€ | Gratuit | ~1h30 |
| Biarritz Walking Tour | 25€ | 12.50€ | Gratuit | ~1h30 |
| Bayonne + Biarritz Combo | 45€ | 22.50€ | Gratuit | ~4h |

---

## 4. Stack technique

| Outil | Rôle | Coût |
|-------|------|------|
| Next.js 16 + Vercel | Site web + hébergement | Gratuit |
| Tailwind CSS v4 | Design | Gratuit |
| next-intl | Traductions FR/EN/ES | Gratuit |
| Stripe | Paiement CB | 1.4% + 0.25€/transaction |
| Google Calendar API | Agenda partagé | Gratuit |
| Resend | Emails confirmation | Gratuit (<3000/mois) |
| Supabase | Base de données | Gratuit (plan starter) |

---

## 5. Étapes réalisées

- [x] Création projet Next.js avec TypeScript et Tailwind
- [x] Configuration i18n trilingue (FR/EN/ES) avec next-intl
- [x] Design system (palette Pays Basque, typographies DM Serif + DM Sans)
- [x] Navbar responsive avec sélecteur de langue
- [x] Footer avec liens et réseaux sociaux
- [x] Page Accueil (hero, tours, témoignages, pourquoi nous, CTA)
- [x] Page Tours (listing avec filtres)
- [x] Pages détail tour (Bayonne, Biarritz, Combo) avec widget réservation
- [x] Widget de réservation (date, heure, participants, calcul prix)
- [x] Intégration Stripe Checkout (API route + webhook)
- [x] Page À Propos (storytelling fondatrice + valeurs)
- [x] Page Contact (formulaire + WhatsApp)
- [x] Page Groupes/Agences (offre B2B + formulaire devis)
- [x] Blog avec 10+ articles SEO originaux
- [x] Google Calendar API intégration
- [x] SEO (meta tags, schema.org, sitemap, robots.txt)
- [x] Animations scroll et micro-interactions
- [x] Design responsive (mobile, tablette, desktop)

## 6. Étapes restantes

- [ ] Ajouter les vraies photos dans /public/images/
- [ ] Créer compte Stripe → ajouter clés dans .env.local
- [ ] Créer compte Resend → ajouter clé API
- [ ] Créer projet Supabase → ajouter clés
- [ ] Créer compte Google Cloud → activer Calendar API → créer service account
- [ ] Créer repo GitHub et pousser le code
- [ ] Déployer sur Vercel (connecter GitHub)
- [ ] Connecter domaine amalurtours.com à Vercel
- [ ] Configurer Google Business Profile
- [ ] Soumettre sitemap à Google Search Console
- [ ] Installer Google Analytics 4
- [ ] Connecter channel manager (Rezdy/Bokun) pour synchro GYG/Viator

---

## 7. Comment lancer le site en local

```bash
cd "AMALUR TOURS/amalur-tours"
npm run dev
```

Ouvrir http://localhost:3000 dans le navigateur.

## 8. Comment déployer

1. Créer un compte sur github.com
2. Créer un compte sur vercel.com (se connecter avec GitHub)
3. Importer le projet depuis GitHub
4. Ajouter les variables d'environnement
5. Cliquer "Deploy"
