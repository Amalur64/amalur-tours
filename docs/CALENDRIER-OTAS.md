# Synchronisation Calendrier & OTAs (GetYourGuide, Viator, Civitatis)

## Comment ça fonctionne

### 1. Réservation sur le site amalurtours.com
1. Le client choisit un tour, une date, un horaire
2. Il paie via Stripe
3. Stripe envoie un webhook à notre API
4. Notre API crée automatiquement un événement dans Google Calendar
5. L'événement contient : nom du tour, nom du client, nombre de personnes, email, montant

### 2. Synchronisation avec GYG / Viator / Civitatis

**Option recommandée : Channel Manager**

Un channel manager centralise toutes les réservations et synchronise les disponibilités :

| Channel Manager | Prix | Compatible GYG | Compatible Viator | Compatible Civitatis |
|----------------|------|----------------|-------------------|---------------------|
| **Rezdy** | ~49€/mois | Oui | Oui | Via iCal |
| **Bokun** (Viator) | ~49€/mois | Oui | Oui (natif) | Via iCal |
| **FareHarbor** | Gratuit* | Oui | Oui | Via iCal |

*FareHarbor prend une commission sur les réservations via leur widget.

### 3. Configuration Google Calendar

#### Étapes pour Maider :
1. Aller sur console.cloud.google.com
2. Créer un projet "Amalur Tours"
3. Activer l'API Google Calendar
4. Créer un compte de service (Service Account)
5. Télécharger la clé JSON
6. Partager le calendrier Google avec l'email du compte de service
7. Copier les clés dans .env.local

#### Variables à configurer :
```
GOOGLE_CALENDAR_ID=ton-email@gmail.com (ou l'ID du calendrier)
GOOGLE_SERVICE_ACCOUNT_EMAIL=amalur-tours@projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvg...
```

### 4. Synchronisation iCal (solution simple)

Si le channel manager n'est pas encore configuré, on peut utiliser la synchronisation iCal :
- Exporter le lien iCal du calendrier Google
- L'importer dans GYG, Viator et Civitatis (ils supportent tous l'import iCal)
- Les plateformes vérifient le calendrier toutes les 15-30 minutes
- Quand un créneau est occupé dans Google Calendar, il est bloqué sur les plateformes

### 5. Blocage de dates

Quand Maider veut bloquer une date (congé, examen VTC, etc.) :
- Elle bloque simplement la date dans Google Calendar
- Les plateformes OTA verront le créneau occupé
- Le site web vérifiera aussi la disponibilité via l'API Calendar

## Actions à faire

- [ ] Créer le projet Google Cloud Console
- [ ] Activer Google Calendar API
- [ ] Créer le compte de service
- [ ] Partager le calendrier avec le compte de service
- [ ] Ajouter les clés dans .env.local et Vercel
- [ ] Choisir un channel manager (Rezdy recommandé pour commencer)
- [ ] Connecter GYG au channel manager
- [ ] Connecter Viator au channel manager
- [ ] Configurer la synchro iCal avec Civitatis
