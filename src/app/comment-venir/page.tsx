import React from "react";

export default function CommentVenirPage() {
  return (
    <>
      <section className="bg-[#f7efe3]">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <h2 className="text-center text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
            La Fabrique vous attend à Lyon Vaise, proche métro et parking 👋
          </h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img
                className="h-full w-full object-cover"
                src="/images/capture_gps.webp"
                alt="Carte d'accès"
              />
            </div>
            <div className="space-y-6 text-sm text-zinc-900 md:text-base">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-900">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 21V9l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v12" />
                    <path d="M4 21h16" />
                    <path d="M9 21v-6h6v6" />
                    <path d="M4 9V4h4v5" />
                    <path d="M16 9V4h4v5" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Adresse</p>
                  <p>4 Rue du Four À Chaux, 69009 Lyon</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-900">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 20a10 10 0 0 1 20 0" />
                    <path d="M7 7h10l1.5 4.5V17a2 2 0 0 1-2 2H7.5A2.5 2.5 0 0 1 5 16.5V11.5Z" />
                    <path d="M7 11h10" />
                    <circle cx="9" cy="16" r="1" />
                    <circle cx="15" cy="16" r="1" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">TCL</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Métro D et pôle bus – arrêt gare de Vaise (à 8 min à pied)</li>
                    <li>Bus 31, 43 – arrêt La Voûte (à 1 min à pied) ou arrêt Laborde (3 min à pied)</li>
                    <li>Bus 2, 20, 22, 23, 71 – arrêt La Voûte (à 3 min à pied)</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-900">
                  <span className="text-sm font-bold">P</span>
                </div>
                <div>
                  <p className="font-bold">Parkings</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Parking Indigo Vaise Industrie à 3 min à pied : 6€ / 3h en partenariat avec Djogo (ticket à valider chez Djogo directement)</li>
                    <li>Parking P+R Vaise 2 à 5 min à pied : Gratuit si utilisation des Transports en commun dans la journée</li>
                    <li>Parking payant dans la rue, gratuit le dimanche (selon disponibilité)</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-900">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="6" width="16" height="14" rx="2" />
                    <path d="M8 3V6" />
                    <path d="M16 3V6" />
                    <path d="M4 10H20" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">5 sessions par jour</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Mercredi, week-ends, jours fériés et vacances</li>
                    <li>Lundi, mardi, jeudi, vendredi pour privatisations (école, entreprise, collectivité)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-zinc-500">
          <span>DJOGO · Système de réservation sur mesure</span>
          <span>RGPD · Stripe · Export CSV/Excel</span>
          <a href="/cgv" className="w-fit text-zinc-500 hover:text-zinc-900">
            Conditions générales de vente
          </a>
        </div>
      </footer>
    </>
  );
}
