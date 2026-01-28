export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f7efe3]">
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl bg-[#f7efe3]">
          <h1 className="text-2xl font-extrabold text-zinc-900 md:text-3xl">
            CONTACTER L’ÉQUIPE DE DJOGO
          </h1>
          <p className="mt-4 text-sm text-zinc-700 md:text-base">
            Partenariats, demandes de privatisation, suggestions, améliorations,
            nous sommes à votre écoute !
          </p>

          <form className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                placeholder="Prénom *"
                type="text"
                name="firstName"
                required
              />
              <input
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                placeholder="Nom *"
                type="text"
                name="lastName"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <input
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                placeholder="Email *"
                type="email"
                name="email"
                required
              />
              <input
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                placeholder="Téléphone"
                type="tel"
                name="phone"
              />
              <input
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                placeholder="Entreprise"
                type="text"
                name="company"
              />
            </div>

            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
              name="reason"
              defaultValue=""
            >
              <option value="" disabled>
                Contact pour un anniversaire
              </option>
              <option value="anniversaire">Contact pour un anniversaire</option>
              <option value="privatisation">Privatisation du lieu</option>
              <option value="service-client">Service client</option>
              <option value="partenariat">Proposition de partenariat</option>
              <option value="commerce">Commerce</option>
              <option value="autre">Autre</option>
            </select>

            <textarea
              className="min-h-[140px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
              placeholder="Message *"
              name="message"
              required
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-start gap-2 text-xs text-zinc-700">
                <input type="checkbox" className="mt-1" required />
                <span>
                  En soumettant ce formulaire, j'autorise DJOGO à utiliser les
                  informations renseignées pour me recontacter.
                </span>
              </label>
              <button
                className="rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white"
                type="submit"
              >
                ENVOYER
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white">
          <img
            className="h-full w-full object-cover"
            src="/hero.webp"
            alt="Atelier Djogo"
          />
        </section>
      </main>
    </div>
  );
}
