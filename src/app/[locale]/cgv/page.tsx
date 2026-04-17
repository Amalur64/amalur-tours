import { setRequestLocale } from "next-intl/server";

export default async function CgvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-24 lg:pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl text-basque-dark mb-3">
            Conditions Générales de Vente
          </h1>
          <p className="text-basque-gray">Dernière mise à jour : avril 2026</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8 text-basque-gray">

          {/* Article 1 */}
          <section>
            <h2 className="font-display text-2xl text-basque-dark mb-3">Article 1 — Identification du prestataire</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) s'appliquent aux services proposés par :
            </p>
            <div className="bg-basque-cream rounded-xl p-5 my-4 space-y-1">
              <p><strong>Amalur Tours</strong></p>
              <p>Entreprise individuelle — Auto-entrepreneur</p>
              <p>25 rue de l'Union, 64600 Anglet, France</p>
              <p>SIRET : 945 209 765 00000</p>
              <p>Email : amalur.tours@gmail.com</p>
              <p>Téléphone : +33 7 50 03 86 51</p>
              <p>Site web : www.amalurtours.com</p>
            </div>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="font-display text-2xl text-basque-dark mb-3">Article 2 — Services proposés</h2>
            <p>
              Amalur Tours propose des visites guidées à pied (walking tours) à Bayonne et Biarritz, au Pays Basque français. Les tours sont assurés en français, anglais et espagnol par une guide locale.
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Tour Bayonne Walking Tour (environ 1h30)</li>
              <li>Tour Biarritz Walking Tour (environ 1h30)</li>
              <li>Tour Combo Bayonne & Biarritz (environ 4h)</li>
              <li>Bons cadeaux (valables 1 an)</li>
            </ul>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="font-display text-2xl text-basque-dark mb-3">Article 3 — Tarifs</h2>
            <p>
              Les tarifs sont indiqués en euros TTC sur le site www.amalurtours.com. Amalur Tours se réserve le droit de modifier ses tarifs à tout moment. Les prix applicables sont ceux en vigueur au moment de la réservation.
            </p>
            <p className="mt-3">
              Les enfants de moins de 12 ans accompagnés d'un adulte bénéficient de la gratuité.
            </p>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="font-display text-2xl text-basque-dark mb-3">Article 4 — Réservation et paiement</h2>
            <p>
              La réservation est effectuée en ligne sur www.amalurtours.com. Le paiement est réalisé de manière sécurisée via la plateforme Stripe (carte bancaire). La réservation est confirmée après réception du paiement complet.
            </p>
            <p className="mt-3">
              Un email de confirmation est automatiquement envoyé au client après chaque réservation.
            </p>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="font-display text-2xl text-basque-dark mb-3">Article 5 — Annulation et remboursement</h2>

            <h3 className="text-lg font-semibold text-basque-dark mt-4 mb-2">Annulation par le client :</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Plus de 24h avant le tour :</strong> remboursement intégral du montant payé.</li>
              <li><strong>Moins de 24h avant le tour :</strong> aucun remboursement. Le montant reste acquis à Amalur Tours.</li>
            </ul>

            <h3 className="text-lg font-semibold text-basque-dark mt-4 mb-2">Conditions météorologiques :</h3>
            <p>
              En cas de conditions météorologiques exceptionnelles rendant la visite dangereuse ou impossible, Amalur Tours proposera au client une date alternative. Si aucune date ne convient, un remboursement intégral sera effectué.
            </p>

            <h3 className="text-lg font-semibold text-basque-dark mt-4 mb-2">Annulation par Amalur Tours :</h3>
            <p>
              En cas d'annulation de sa part (maladie, force majeure), Amalur Tours proposera une date alternative ou procédera au remboursement intégral.
            </p>

            <p className="mt-3">
              Les demandes d'annulation doivent être adressées par email à : <strong>amalur.tours@gmail.com</strong>
            </p>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="font-display text-2xl text-basque-dark mb-3">Article 6 — Bons cadeaux</h2>
            <p>
              Les bons cadeaux sont valables 1 an à compter de la date d'achat. Ils ne sont ni remboursables ni échangeables contre de l'argent. Pour utiliser un bon cadeau, le bénéficiaire doit contacter Amalur Tours par email en indiquant son code unique.
            </p>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="font-display text-2xl text-basque-dark mb-3">Article 7 — Responsabilité</h2>
            <p>
              Les participants aux tours sont responsables de leur propre sécurité et doivent porter des chaussures adaptées à la marche. Amalur Tours ne pourra être tenu responsable des accidents survenus du fait d'une imprudence du participant.
            </p>
            <p className="mt-3">
              Les participants mineurs doivent être accompagnés d'un adulte responsable.
            </p>
          </section>

          {/* Article 8 — RGPD */}
          <section>
            <h2 className="font-display text-2xl text-basque-dark mb-3">Article 8 — Protection des données personnelles (RGPD)</h2>
            <p>
              Les données personnelles collectées (nom, email, téléphone) sont utilisées uniquement dans le cadre de la gestion des réservations et de la relation client. Elles ne sont jamais vendues ni transmises à des tiers.
            </p>
            <p className="mt-3">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez : <strong>amalur.tours@gmail.com</strong>
            </p>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="font-display text-2xl text-basque-dark mb-3">Article 9 — Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut, le tribunal compétent sera celui de Bayonne.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-basque-cream rounded-xl p-6 mt-8">
            <p className="text-center text-basque-dark">
              Pour toute question relative aux présentes CGV :<br />
              <a href="mailto:amalur.tours@gmail.com" className="text-basque-red font-semibold hover:underline">
                amalur.tours@gmail.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
