export default function ReservationPage() {
  const slots = [
    { time: "10:00", remaining: 8 },
    { time: "11:30", remaining: 4 },
    { time: "14:00", remaining: 10 },
    { time: "15:30", remaining: 6 },
    { time: "17:00", remaining: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#f7efe3] text-zinc-900">
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-colors-brand-red-djogo)]">
            Réservation
          </p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
            Choisissez votre créneau et réservez vos places
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-700 md:text-base">
            Sélectionnez une date, un créneau et indiquez vos coordonnées.
            Le paiement sera intégré prochainement.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-8">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Calendrier des créneaux</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <label className="text-xs font-semibold text-zinc-600">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                  />
                  <p className="mt-3 text-xs text-zinc-500">
                    Les dates disponibles sont mises à jour en temps réel.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-600">
                    Créneaux disponibles
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm transition hover:border-zinc-300 hover:bg-zinc-100"
                      >
                        <div className="font-semibold">{slot.time}</div>
                        <div className="text-xs text-zinc-500">
                          {slot.remaining} places restantes
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Coordonnées</h2>
              <form className="mt-5 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                    placeholder="Prénom *"
                    type="text"
                    name="firstName"
                    required
                  />
                  <input
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                    placeholder="Nom *"
                    type="text"
                    name="lastName"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                    placeholder="Email *"
                    type="email"
                    name="email"
                    required
                  />
                  <input
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                    placeholder="Téléphone"
                    type="tel"
                    name="phone"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <select
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                    name="participants"
                    defaultValue="1"
                  >
                    <option value="1">1 participant</option>
                    <option value="2">2 participants</option>
                    <option value="3">3 participants</option>
                    <option value="4">4 participants</option>
                  </select>
                  <select
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                    name="age"
                    defaultValue="7-9"
                  >
                    <option value="4-6">4 à 6 ans</option>
                    <option value="7-9">7 à 9 ans</option>
                    <option value="10-12">10 à 12 ans</option>
                  </select>
                  <select
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                    name="atelier"
                    defaultValue="selection"
                  >
                    <option value="selection" disabled>
                      Atelier choisi
                    </option>
                    <option value="dominos">Dominos en bois</option>
                    <option value="cereales">Barres de céréales</option>
                    <option value="peinture">Peinture au couteau</option>
                    <option value="cuir">Porte-monnaie en cuir</option>
                  </select>
                </div>

                <textarea
                  className="min-h-[120px] w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                  placeholder="Message (allergies, besoins spécifiques, etc.)"
                  name="message"
                />
              </form>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Récapitulatif</h2>
              <div className="mt-4 space-y-3 text-sm text-zinc-700">
                <div className="flex items-center justify-between">
                  <span>Date</span>
                  <span className="font-semibold">À sélectionner</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Créneau</span>
                  <span className="font-semibold">À sélectionner</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Participants</span>
                  <span className="font-semibold">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total estimé</span>
                  <span className="font-semibold">—</span>
                </div>
              </div>
              <button
                type="button"
                className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white"
              >
                Confirmer la pré-réservation
              </button>
            </div>

            <div className="rounded-3xl border-2 border-dashed border-zinc-300 bg-white p-6">
              <h2 className="text-xl font-bold">Paiement</h2>
              <p className="mt-3 text-sm text-zinc-600">
                La passerelle de paiement sera ajoutée prochainement.
                Ce bloc est prêt pour l&apos;intégration (Stripe, PayPlug, etc.).
              </p>
              <div className="mt-6 rounded-2xl bg-zinc-100 p-6 text-center text-xs text-zinc-500">
                Emplacement passerelle de paiement
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}