"use client";

import { useEffect, useState } from "react";

export default function PorteMonnaieDesAventuriersPage() {
  const [priceMode, setPriceMode] = useState<"solo" | "duo">("duo");
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    setIsFading(true);
    const timeout = setTimeout(() => setIsFading(false), 160);
    return () => clearTimeout(timeout);
  }, [priceMode]);

  return (
    <main className="min-h-screen bg-[#1f3d2a] text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-10 pt-6 min-h-[calc(100vh-80px)]">
        <nav className="text-xs font-semibold uppercase tracking-wide text-white/70">
          <a className="hover:text-white" href="/">
            Accueil
          </a>
          <span className="mx-2">/</span>
          <a className="hover:text-white" href="/#ateliers">
            Ateliers
          </a>
          <span className="mx-2">/</span>
          <span className="text-white">Le porte-monnaie des aventuriers</span>
        </nav>

        <div className="mt-5">
          <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">
            Fabrique ton propre porte-monnaie en cuir de A à Z !
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
            Découvre les gestes des maroquiniers, apprends à couper, percer et assembler
            le cuir, puis repars avec ta création personnalisée.
          </p>
        </div>

        <div className="mt-8 grid flex-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
          <figure className="overflow-hidden rounded-[28px] bg-[#2d5a3d] shadow-lg">
            <img
              className="h-full max-h-[360px] w-full object-cover"
              src="/images/cat_portefeuille.webp"
              alt="Illustration d'un atelier créatif"
            />
          </figure>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                src: "/images/atelier_portefeuille.webp",
                alt: "Atelier porte-monnaie - préparation du cuir",
              },
              {
                src: "/images/atelier_portefeuille_2.webp",
                alt: "Atelier porte-monnaie - découpe et traçage",
              },
              {
                src: "/images/atelier_portefeuille_3.webp",
                alt: "Atelier porte-monnaie - espace de création",
              },
              {
                src: "/images/atelier_portefeuille_4.webp",
                alt: "Atelier porte-monnaie - enfants fiers de leur création",
              },
            ].map((image) => (
              <div
                key={image.src}
                className="overflow-hidden rounded-[22px] bg-[#2d5a3d] shadow-lg"
              >
                <img
                  className="h-40 w-full object-cover sm:h-44"
                  src={image.src}
                  alt={image.alt}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7efe3] text-zinc-900">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <div className="flex items-start gap-4">
              <img
                className="h-16 w-16"
                src="/images/blason_ducs.webp"
                alt="Blason des Ducs"
              />
              <div>
                <h2 className="text-2xl font-extrabold">
                  Fabrique ton propre porte-monnaie en cuir de A à Z !
                </h2>
                <p className="mt-2 text-sm text-zinc-700">
                  Embarquez dans le monde de la maroquinerie, chère aux Ducs, à travers
                  la réalisation d'un porte-monnaie personnalisé et utile au quotidien !
                </p>
              </div>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-zinc-800">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f3d8dc] text-[#6b1515]">
                  ✓
                </span>
                <span className="font-semibold text-zinc-900">
                  1h30 d'atelier avec un animateur ou une animatrice diplômé.e
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f3d8dc] text-[#6b1515]">
                  ✓
                </span>
                <span className="font-semibold text-zinc-900">
                  Repars à la maison avec ta création
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f3d8dc] text-[#6b1515]">
                  ✓
                </span>
                <span className="font-semibold text-zinc-900">
                  7-12 ans pour les enfants seuls, 4-12 ans avec un adulte accompagnant
                </span>
              </li>
            </ul>

            <p className="mt-6 text-sm text-zinc-700">
              Partez à l'aventure dans le monde du cuir avec les Ducs. Ceux-ci ont fixé
              aux participants un nouveau défi : fabriquer un véritable porte-monnaie
              d'aventurier, robuste, personnalisé et prêt à accompagner les explorateurs
              de Djogo dans leurs quêtes !
            </p>

            <div className="mt-6">
              <h3 className="text-sm font-extrabold text-zinc-900">
                Déroulé de l'atelier
              </h3>
              <ul className="mt-3 space-y-3 text-sm text-zinc-700">
                <li>
                  <span className="font-semibold text-zinc-900">
                    Accueil dans l'atelier des aventuriers :
                  </span>{" "}
                  les experts accueillent votre enfant et le plongent dans l'univers du travail
                  du cuir. Il découvre alors les outils traditionnels (alêne, maillet, emporte-pièce),
                  ainsi que les différentes étapes pour transformer une simple peau de cuir en un
                  accessoire solide et élégant.
                </li>
                <li>
                  <span className="font-semibold text-zinc-900">Choix du cuir et design :</span>{" "}
                  les apprentis artisans choisissent parmi plusieurs types et couleurs de cuir.
                </li>
                <li>
                  <span className="font-semibold text-zinc-900">
                    Fabrication du porte-monnaie :
                  </span>{" "}
                  sous l'œil attentif de l'animateur, votre enfant apprend à tracer le patron sur
                  le cuir, à percer les trous pour les boutons de pression et à assembler les
                  différentes pièces comme un vrai maroquinier. L'atelier est entièrement adapté
                  aux enfants, pour une expérience à la fois créative et manuelle.
                </li>
                <li>
                  <span className="font-semibold text-zinc-900">Personnalisation et finitions :</span>{" "}
                  pour terminer, votre enfant personnalise sa création avec des poinçons, des
                  marquages ou des motifs, avant d'ajouter les touches finales pour un rendu unique.
                </li>
              </ul>
              <p className="mt-4 text-sm text-zinc-700">
                À l'issue de l'atelier, votre enfant repart avec son propre porte-monnaie
                d'aventurier, prêt à accueillir des pièces, des trésors ou des souvenirs de mission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
                Comment venir
              </h2>
              <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
                <iframe
                  className="h-full min-h-[320px] w-full"
                  src="https://www.google.com/maps?q=Djogo%20Lyon%2C%204%20Rue%20du%20Four%20%C3%80%20Chaux%2C%2069009%20Lyon&output=embed"
                  title="Carte d'accès Djogo Lyon"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-8 space-y-6 text-sm text-zinc-900 md:text-base">
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
                    <a
                      className="text-sm font-semibold text-zinc-900 underline"
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noreferrer"
                    >
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
                      <li>
                        Lundi, mardi, jeudi, vendredi pour privatisations (école,
                        entreprise, collectivité)
                      </li>
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
                      <li>
                        Parking Indigo Vaise Industrie à 3 min à pied : 6€ / 3h en
                        partenariat avec Djogo (ticket à valider chez Djogo directement)
                      </li>
                      <li>
                        Parking P+R Vaise 2 à 5 min à pied : Gratuit si utilisation des
                        Transports en commun dans la journée
                      </li>
                      <li>
                        Parking payant dans la rue, gratuit le dimanche (selon disponibilité)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
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

          </div>

          <aside className="sticky top-24 self-start">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
              <div className="flex gap-3 rounded-full bg-zinc-100 p-2 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setPriceMode("solo")}
                  className={`flex-1 rounded-full px-4 py-2 transition-colors ${
                    priceMode === "solo"
                      ? "bg-black text-white"
                      : "text-zinc-700"
                  }`}
                >
                  Enfant seul
                </button>
                <button
                  type="button"
                  onClick={() => setPriceMode("duo")}
                  className={`flex-1 rounded-full px-4 py-2 transition-colors ${
                    priceMode === "duo"
                      ? "bg-black text-white"
                      : "text-zinc-700"
                  }`}
                >
                  Enfant + adulte
                </button>
              </div>

              <div
                className={`mt-6 text-center transition-opacity duration-150 ${
                  isFading ? "opacity-0" : "opacity-100"
                }`}
              >
                <p className="text-3xl font-extrabold">
                  {priceMode === "solo" ? "29,90 €" : "39,90 €"}
                </p>
                <p className="text-sm text-zinc-600">
                  {priceMode === "solo"
                    ? "par enfant"
                    : "pour un duo Enfant + Adulte"}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <a
                  className="flex w-full items-center justify-center rounded-full bg-[#39c24a] px-4 py-3 text-sm font-extrabold text-white shadow-[0_6px_0_0_#1f8f34] transition-transform hover:-translate-y-0.5"
                  href="/reservation"
                >
                  RÉSERVER
                </a>
                <a
                  className="flex w-full items-center justify-center rounded-full bg-[#f8df5a] px-4 py-3 text-xs font-extrabold text-zinc-900 shadow-[0_6px_0_0_#d4b73d] transition-transform hover:-translate-y-0.5"
                  href="/contact"
                >
                  PRIVATISER POUR UN ANNIVERSAIRE
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#f7efe3] text-zinc-900">
        <div className="mx-auto w-full max-w-6xl px-6 pb-16">
          <h2 className="text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
            Un encadrement professionnel et bienveillant 💗
          </h2>
          <div className="mt-6 w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="grid gap-6 p-6 md:grid-cols-[0.6fr_1.4fr] md:items-stretch">
              <div className="overflow-hidden rounded-2xl bg-[#f7efe3]">
                <img
                  className="h-full min-h-[260px] w-full object-cover"
                  src="/images/image_animateurs.webp"
                  alt="Animateurs Djogo encadrant un atelier"
                />
              </div>
              <div className="space-y-6 text-sm text-zinc-800 md:text-base">
                {[
                  {
                    title: "Animateurs diplômés",
                    text: "Professionnels qualifiés et expérimentés pour encadrer les enfants (BAFA, BPJEPS...)",
                  },
                  {
                    title: "Formation artisanale",
                    text: "Nos animateurs sont formés aux ateliers par des artisans experts de chaque métier",
                  },
                  {
                    title: "Sécurité et bienveillance",
                    text: "Toutes les mesures de sécurité sont prises pour des ateliers en toute sérénité !",
                  },
                ].map((item, index) => (
                  <div key={item.title}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe3] text-[#6b1515]">
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
                          <path d="M3 12c2-4 6-6 9-6s7 2 9 6" />
                          <path d="M3 12c2 4 6 6 9 6s7-2 9-6" />
                          <path d="M9 12h6" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-[var(--brand-colors-brand-red-djogo)]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-700 md:text-base">
                          {item.text}
                        </p>
                      </div>
                    </div>
                    {index < 2 ? (
                      <div className="mt-6 h-px w-full bg-zinc-200" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1f3d2a] text-white">
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
                className="rounded-3xl bg-white px-6 py-6 text-center text-[#1f3d2a]"
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
                <p className="mt-2 text-sm font-semibold text-zinc-500">
                  {testimonial.name}
                </p>
                <p className="mt-3 text-sm text-zinc-800">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7efe3]">
        <div className="mx-auto w-full max-w-6xl px-6 pb-12">
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
      </section>
    </main>
  );
}
