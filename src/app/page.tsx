export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7efe3] text-zinc-900">
      <main className="w-full">
        <section className="relative min-h-[calc(100vh-80px)] border-b-[2rem] border-l-[2rem] border-r-[2rem] border-[var(--brand-colors-brand-red-djogo)] bg-[#f7efe3]">
          <div className="absolute -bottom-8 -left-8 h-8 w-8 bg-[#f7efe3]" />
          <div className="absolute -bottom-8 -right-8 h-8 w-8 bg-[#f7efe3]" />
          <div className="mx-auto grid min-h-[calc(100vh-80px-2rem)] w-full max-w-6xl items-stretch gap-8 px-6 py-6 lg:grid-cols-[1.05fr_1fr]">
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-extrabold leading-tight text-zinc-900 md:text-4xl">
                Le nouveau lieu 100% ateliers manuels immersifs pour 3 à 12 ans !
              </h1>
              <p className="mt-4 text-base text-zinc-700 md:text-lg">
                Un concept de 400m2 inédit où l'on fait comme les artisans, seul ou en famille 🔨
              </p>
              <p className="mt-6 text-base font-semibold text-orange-600">
                Ouverture ce samedi 24 janvier, réservez vos places dès maintenant !
              </p>
              <div className="hero-cta mt-6">
                <div className="buttons-general">
                  <a className="button block" href="/reservation">
                    <span className="secondary">JE RÉSERVE</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="h-full overflow-hidden rounded-3xl bg-white shadow-xl">
              <img
                className="h-full w-full object-cover"
                src="/hero.webp"
                alt="Enfant réalisant un atelier manuel"
              />
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(to_bottom,#f7efe3_0%,#f7efe3_50%,#ffffff_50%,#ffffff_100%)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <h2 className="text-center text-2xl font-extrabold text-zinc-900 md:text-3xl">
              Dans la peau d'artisans, chefs et artistes pendant 1h30 🔨🧑‍🍳🎨
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title:
                    "Art, cuisine ou fabrication : 4 salles immersives sans écrans, où l'on fait comme les grands",
                  color: "bg-[var(--brand-colors-brand-red-djogo)]",
                  textClass: "text-[var(--brand-colors-brand-yellow-djogo)]",
                  image: "/images/photo_art.webp",
                  alt: "Atelier artisanal",
                },
                {
                  title:
                    "Défis, histoires, décors : Vivez nos ateliers avec vos enfants ou laissez les faire seuls !",
                  color: "bg-[var(--brand-colors-brand-yellow-djogo)]",
                  textClass: "text-[var(--brand-colors-brand-red-djogo)]",
                  image: "/images/photo_cuisine.webp",
                  alt: "Atelier en famille",
                },
                {
                  title:
                    '"C\'est moi qui l\'ai fait" : Repartez avec vos créations et profitez de notre espace café !',
                  color: "bg-[var(--brand-colors-brand-red-djogo)]",
                  textClass: "text-[var(--brand-colors-brand-yellow-djogo)]",
                  image: "/images/photo_peinture.webp",
                  alt: "Créations artisanales",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className={`${item.color} rounded-3xl p-5 shadow-lg`}
                >
                  <p className={`text-lg font-bold ${item.textClass}`}>
                    {item.title}
                  </p>
                  <div className="mt-5 overflow-hidden rounded-2xl bg-white">
                    <img
                      className="h-[320px] w-full object-cover"
                      src={item.image}
                      alt={item.alt}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ateliers" className="bg-[#f7efe3]">
          <div className="mx-auto w-full max-w-none px-6 py-12">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
                Découvrez nos premiers ateliers co-conçus avec nos artisans !
              </p>
              <p className="mt-2 text-sm text-zinc-700 md:text-base">
                Du 24.01.2026 au 30.04.2026
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Fabrique un set de 28 dominos en bois personnalisés !",
                  duration: "1h30",
                  universe: "Bois",
                  image: "/images/cat_domino.webp",
                  href: "/les-ateliers/les-28-dominos-en-bois",
                },
                {
                  title:
                    "Cuisine de délicieuses barres de céréales créatives pour un max d'énergie !",
                  duration: "1h30",
                  universe: "Patisserie",
                  image: "/images/cat_cereal.webp",
                  href: "/les-ateliers/barres-cereales",
                },
                {
                  title:
                    "Apprends à peindre avec des couteaux et repars avec ta toile !",
                  duration: "1h30",
                  universe: "Peinture",
                  image: "/images/cat_peinture.webp",
                  href: "/les-ateliers/peinture-couteau",
                },
                {
                  title:
                    "Fabrique ton propre porte-monnaie en cuir de A à Z !",
                  duration: "1h30",
                  universe: "Cuir",
                  image: "/images/cat_portefeuille.webp",
                  href: "/les-ateliers/le-porte-monnaie-des-aventuriers",
                },
              ].map((atelier) => (
                <article
                  key={atelier.title}
                  className="relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0) 70%), url(${atelier.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="flex flex-col justify-between p-4">
                    <div>
                      <p className="text-base font-semibold text-white">
                        {atelier.title}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 7V12L15 15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <span>{atelier.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            className="h-4 w-4"
                            src={
                              atelier.universe === "Patisserie"
                                ? "/images/icone_cuisine.svg"
                                : atelier.universe === "Peinture"
                                  ? "/images/icone_pinceau.svg"
                                  : "/images/icone_bricolage.svg"
                            }
                            alt=""
                            aria-hidden="true"
                          />
                          <span>{atelier.universe}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white py-2 text-xs font-bold text-zinc-900 transition-transform duration-200 hover:scale-105"
                      href={atelier.href}
                    >
                      VOIR L'ATELIER
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7efe3]">
          <div className="mx-auto w-full max-w-4xl px-6 py-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <img
                className="h-48 w-auto md:h-52"
                src="/images/blason_scoffs.webp"
                alt="Blason Scoffs"
              />
              <img
                className="h-48 w-auto md:h-52"
                src="/images/blason_ducs.webp"
                alt="Blason Ducs"
              />
              <img
                className="h-48 w-auto md:h-52"
                src="/images/blason_monets.webp"
                alt="Blason Monets"
              />
            </div>
            <h2 className="mt-8 text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
              Notre mission : Rendre le manuel fun, pratique et accessible
            </h2>
            <div className="mt-6 space-y-5 text-left text-sm text-zinc-800 md:text-base">
              <p>
                Depuis des générations, les savoir-faire se transmettaient selon les méthodes de trois communautés d’érudits :
                Les Scoffs, maîtres de la gastronomie,
                Les Ducs, artisans bâtisseurs et façonniers,
                Les Monets, artistes peintres, sculpteurs plasticiens.
              </p>
              <p>
                Leur enseignement, aussi riche soit-il, manquait pourtant d’une chose essentielle : la magie du jeu.
              </p>
              <p>
                C’est pour raviver cette flamme que la Fabrique DJOGO a été inventée : un lieu d’aventure où petits et
                grands s’immergent dans le monde artisanal. Ici, on ne regarde pas, on essaie. On ne travaille pas, on
                joue. Chaque mission vous met au défi de créer, de vous tromper et de recommencer, en savourant le
                plaisir de faire de ses mains !
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#6b1515] text-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Espace Café & Restauration
                </h2>
                <p className="mt-6 text-sm text-white/90 md:text-base">
                  Pendant que les enfants participent à leur atelier, les parents
                  peuvent se détendre dans notre espace café chaleureux.
                </p>
                <p className="mt-6 text-sm text-white/90 md:text-base">Vous y retrouverez :</p>
                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-white/90 md:text-base">
                  <li>
                    Un lieu convivial pour patienter confortablement le temps de l'atelier.
                  </li>
                  <li>
                    Un espace adapté au télétravail avec connexion Wi‑Fi, idéal pour avancer sur
                    ses projets en toute tranquillité.
                  </li>
                  <li>
                    Une offre de restauration engagée : boissons, encas et petite restauration
                    préparés avec des produits de qualité, locaux et responsables.
                  </li>
                  <li>
                    Si vous avez un enfant en bas âge (-3 ans) un petit espace d'éveil est
                    disponible pendant que les plus grands sont en atelier !
                  </li>
                  <li>
                    Un endroit pensé pour que l'expérience soit agréable aussi bien pour les
                    enfants que pour les parents !
                  </li>
                </ul>
              </div>
              <img
                className="h-full min-h-[320px] w-full rounded-3xl object-cover"
                src="/images/photo_diner.webp"
                alt="Espace café"
              />
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Wifi\ngratuit",
                  icon: (
                    <path
                      d="M2.5 8.5C6.5 4.5 13.5 4.5 17.5 8.5M4.5 10.5C7 8 13 8 15.5 10.5M7 13C8.5 11.5 11.5 11.5 13 13M10 15.75C10.4142 15.3358 11.0858 15.3358 11.5 15.75C11.9142 16.1642 11.9142 16.8358 11.5 17.25C11.0858 17.6642 10.4142 17.6642 10 17.25C9.58579 16.8358 9.58579 16.1642 10 15.75Z"
                    />
                  ),
                },
                {
                  title: "Restauration\nengagée",
                  icon: (
                    <>
                      <path d="M11 7.25C10.1 6.05 8.3 5.9 7.3 7.05C6.2 8.35 6.45 10.2 7.7 11.35L11 14.25L14.3 11.35C15.55 10.2 15.8 8.35 14.7 7.05C13.7 5.9 11.9 6.05 11 7.25Z" />
                      <path d="M3 15.5H9L11 13.5L15 15.5H18.5C19.6 15.5 20.5 16.4 20.5 17.5V19H6.5C4.6 19 3 17.4 3 15.5Z" />
                      <path d="M9 15.5V13.5" />
                    </>
                  ),
                },
                {
                  title: "Adapté au\nTélétravail",
                  icon: (
                    <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V14C20 15.1046 19.1046 16 18 16H6C4.89543 16 4 15.1046 4 14V6ZM2 18H22" />
                  ),
                },
                {
                  title: "Espace d'éveil\npour les -3 ans",
                  icon: (
                    <>
                      <path d="M6 9H16C17.7 9 19 10.3 19 12V15H3V12C3 10.3 4.3 9 6 9Z" />
                      <path d="M8 9V7C8 5.3 9.3 4 11 4H13" />
                      <path d="M13 4C14.7 4 16 5.3 16 7V9" />
                      <circle cx="7" cy="17" r="1.5" />
                      <circle cx="15" cy="17" r="1.5" />
                    </>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl bg-white px-6 py-6 text-center text-[#5E1314]"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f1e4d6]">
                    <svg
                      className="h-7 w-7"
                      viewBox="0 0 22 22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <p className="text-sm font-semibold whitespace-pre-line">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7efe3]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <h2 className="text-center text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
              On vous attend à Lyon Vaise, proche métro et parking 👋
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
                    <p className="font-bold">Rdv chez Djogo</p>
                    <p>Rdv chez Djogo 4 Rue du Four À Chaux, 69009 Lyon</p>
                    <a className="text-sm font-semibold text-zinc-900 underline" href="https://maps.google.com" target="_blank" rel="noreferrer">
                      Lancer l’itinéraire
                    </a>
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
                    <p className="font-bold">Accès TCL</p>
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
                    <p className="font-bold">Accès Parking</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Parking Indigo Vaise Industrie à 3 min à pied : 6€ / 3h en partenariat avec Djogo (ticket à valider chez Djogo directement)</li>
                      <li>Parking P+R Vaise 2 à 5 min à pied : Gratuit si utilisation des Transports en commun dans la journée</li>
                      <li>Parking payant dans la rue, gratuit le dimanche (selon disponibilité)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <h2 className="text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
              Tout savoir avant de se lancer !
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                {
                  question: "Comment se déroule un atelier chez Djogo ?",
                  answer:
                    "Chaque atelier dure 1h30 et accueille jusqu'à 10 enfants ou 8 binômes adulte/enfant, encadrés par un animateur professionnel. Les enfants sont immergés dans un univers ludique, avec des histoires, des décors et des accessoires adaptés à chaque activité. Ils manipulent de vrais outils et matériaux, et repartent avec leur création à la fin de la séance.",
                },
                {
                  question:
                    "Que se passe-t-il si mon enfant termine son atelier plus rapidement que les autres ?",
                  answer:
                    "Tous les ateliers Djogo sont conçus pour que chaque enfant ait le temps de finir sa création, quel que soit son rythme. Si un enfant termine plus vite, il peut aller plus loin dans la personnalisation ou la décoration de son œuvre, ou même explorer des techniques supplémentaires proposées par l’animateur. Il peut aussi, s’il le souhaite, aider les autres enfants à avancer, favorisant ainsi l’entraide et le partage au sein du groupe.",
                },
                {
                  question: "À partir de quel âge mon enfant peut-il participer seul à un atelier ?",
                  answer:
                    "Chez Djogo, les enfants de 6 à 12 ans peuvent participer seuls aux ateliers, sous la supervision de nos animateurs professionnels. Pour les plus petits, de 3 à 12 ans, il est possible de participer à un atelier en duo avec un adulte (parent, grand-parent...). Des sessions spécifiques sont prévues pour chaque formule (une session enfant seul ne se mixe pas avec une session adulte-enfant).",
                },
                {
                  question:
                    "Comment la sécurité des enfants est-elle assurée pendant les ateliers ?",
                  answer:
                    "La sécurité des enfants est une priorité chez Djogo. Tous les ateliers sont encadrés par des animateurs professionnels, formés à l’accompagnement des enfants et à la gestion des groupes. Les activités sont adaptées à chaque tranche d’âge, avec des outils et matériaux sélectionnés pour leur sécurité, en plus d’équipements de protection individuels.",
                },
                {
                  question: "Peut-on offrir des ateliers Djogo en cadeau ?",
                  answer:
                    "Oui ! Il est possible d’acheter des bons cadeaux pour offrir une expérience Djogo à un enfant de votre entourage. Les bons cadeaux sont disponibles pour un atelier ponctuel, un abonnement ou même un pack d’ateliers, et peuvent être utilisés sur la période de votre choix.",
                },
                {
                  question: "Combien de sessions sont proposées chaque jour ?",
                  answer:
                    "Djogo propose jusqu'à 5 sessions d'ateliers par salle et par jour, les mercredis, week-ends, jours fériés et pendant les vacances scolaires. Cela permet de choisir facilement le créneau qui convient le mieux à votre emploi du temps familial.",
                },
                {
                  question:
                    "Que peuvent faire les adultes accompagnants pendant les ateliers \"enfant seul\" ?",
                  answer:
                    "Pendant que les enfants s'amusent, les adultes accompagnants peuvent profiter d’un espace café-bar convivial, avec Wi-Fi gratuit, restauration engagée et salle de télétravail. Un espace d’éveil est aussi prévu pour les plus petits, ainsi que des jeux, livres et dessins pour patienter en toute tranquillité.",
                },
              ].map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-zinc-200 bg-white px-5 py-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-900 md:text-base">
                      {item.question}
                    </span>
                    <svg
                      className="h-5 w-5 text-zinc-900 transition-transform duration-200 group-open:rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-sm text-zinc-700 md:text-base">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7efe3]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <h2 className="text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
              Vous en parlez mieux que nous 💗
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
              {[
                {
                  name: "Aurélie, maman de Léonce",
                  text: "Super expérience avec ma fille, on a pas vu le temps passer et on aurait pas pensé réussir à réaliser un si bel objet ! Je recommande chaudement !",
                  span: "lg:col-span-4",
                },
                {
                  name: "Sophie, maman de Lucie",
                  text: "Supers ateliers aussi bien pour des enfants que pour des pré-ados ! C'est ludique, instructif, bien cadré ! Longue vie à Djogo 💚",
                  span: "lg:col-span-4",
                },
                {
                  name: "Yannls, papa d'Ysao",
                  text: "Une expérience aussi ludique qu'instructive ! C'est un super moment à partager avec ses enfants.",
                  span: "lg:col-span-4",
                },
                {
                  name: "Florence, maman de Timéo",
                  text: "On a passé moi et mon fils un moment génial, avec une équipe au petit soin pour nous ! Merci Djogo !",
                  span: "lg:col-span-6",
                },
                {
                  name: "Hervé, papa de Tiego",
                  text: "2ème expérience pour mon fils de 10 ans, carrelage la 1ere fois et maroquinerie la 2ème. Il a adoré apprendre et découvrir, très bien encadré avec beaucoup de pédagogie et de patience, bref, une super expérience pour lui permettre de faire !",
                  span: "lg:col-span-6",
                },
              ].map((testimonial) => (
                <div
                  key={testimonial.name}
                  className={`rounded-2xl bg-white p-6 shadow-sm ${testimonial.span}`}
                >
                  <div className="text-xl font-bold text-zinc-900">””</div>
                  <div className="mt-2 flex items-center gap-1 text-[#f4a261]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={`${testimonial.name}-star-${index}`}
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 3.5l2.69 5.45 6.01.87-4.35 4.24 1.03 6-5.38-2.83-5.38 2.83 1.03-6-4.35-4.24 6.01-.87L12 3.5z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-500">
                    {testimonial.name}
                  </p>
                  <p className="mt-3 text-sm text-zinc-800">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-[#f7efe3]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <img
                className="h-10 w-auto"
                src="/images/logo_djogo_orange.svg"
                alt="Djogo"
              />
              <p className="text-sm font-semibold text-zinc-900">
                Les nouveaux lieux de loisirs urbains pour enfants - Faire, jouer, se régaler
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
