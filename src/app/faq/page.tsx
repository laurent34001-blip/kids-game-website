import React from "react";

export default function FAQPage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
            Tout savoir avant de se lancer !
          </h2>
          <div className="mt-6 grid gap-3">
            {[
              {
                question: "Peut on venir à deux parents pour un enfant en atelier ?",
                answer: "Aujourd'hui nous ne proposons pas cette option. Nos expériences sont conçues pour que les enfants tirent le maximum de confiance en eux, d'apprentissage et de jeu, avec un adulte maximum. Egalement et par contrainte de place dans les salles, accepter un enfant avec 2 parents à chaque fois nous contraindrait à revoir complètement notre politique tarifaire, ce qui n'est pas à l'ordre du jour !",
              },
              {
                question: "Puis-je accompagner plusieurs enfants ?",
                answer: "Un adulte peut accompagner jusqu'à 3 enfants chez Djogo ! Les adultes sont obligatoires jusqu'à 6 ou 7 ans en fonction de l'atelier choisi.",
              },
              {
                question: "À partir de quel âge mon enfant peut-il participer seul à un atelier ?",
                answer: "Chez Djogo, les enfants de 6 à 12 ans peuvent participer seuls aux ateliers (6 ou 7 ans selon l'atelier) sous la supervision de nos animateurs professionnels. Pour les plus petits, de 3 à 12 ans, il est possible de participer à un atelier en duo avec un adulte (parent, grand-parent…). Des sessions spécifiques sont prévues pour chaque formule (une session enfant seul ne se mixe pas avec une session adulte-enfant)",
              },
              {
                question: "Est il possible de venir avec un chien ?",
                answer: "‍Chez Djogo, bien que nous adorons nos amis les chiens, seulement les chiens guides sont admis. Nous ouvrirons bientôt la terrasse et vous informerons de l'évolution de notre politique d'accueil le cas échéant !",
              },
              {
                question: "Comment se déroule un atelier chez Djogo ?",
                answer: "Chaque atelier dure 1h30 et accueille jusqu’à 10 enfants ou 8 binômes adulte/enfant, encadrés par un animateur professionnel. Les enfants sont immergés dans un univers ludique, avec des histoires, des décors et des accessoires adaptés à chaque activité. Ils manipulent de vrais outils et matériaux, et repartent avec leur création à la fin de la séance.",
              },
              {
                question: "Que se passe-t-il si mon enfant termine son atelier plus rapidement que les autres ?",
                answer: "‍Tous les ateliers Djogo sont conçus pour que chaque enfant ait le temps de finir sa création, quel que soit son rythme. Si un enfant termine plus vite, il peut aller plus loin dans la personnalisation ou la décoration de son œuvre, ou même explorer des techniques supplémentaires proposées par l’animateur. Il peut aussi, s’il le souhaite, aider les autres enfants à avancer, favorisant ainsi l’entraide et le partage au sein du groupe.",
              },
              {
                question: "Comment la sécurité des enfants est-elle assurée pendant les ateliers ?",
                answer: "La sécurité des enfants est une priorité chez Djogo. Tous les ateliers sont encadrés par des animateurs professionnels, formés à l’accompagnement des enfants et à la gestion des groupes. Les activités sont adaptées à chaque tranche d’âge, avec des outils et matériaux sélectionnés pour leur sécurité, en plus d’équipements de protection individuels.",
              },
              {
                question: "Peut-on offrir des ateliers Djogo en cadeau ?",
                answer: "Oui ! Il est possible d’acheter des bons cadeaux pour offrir une expérience Djogo à un enfant de votre entourage. Les bons cadeaux sont disponibles pour un atelier ponctuel, un abonnement ou même un pack d’ateliers, et peuvent être utilisés sur la période de votre choix.",
              },
              {
                question: "Combien de sessions sont proposées chaque jour ?",
                answer: "Djogo propose jusqu’à 5 sessions d’ateliers par salle et par jour, les mercredis, week-ends, jours fériés et pendant les vacances scolaires. Cela permet de choisir facilement le créneau qui convient le mieux à votre emploi du temps familial.",
              },
              {
                question: "Que peuvent faire les adultes accompagnants pendant les ateliers 'enfant seul' ?",
                answer: "Pendant que les enfants s’amusent, les adultes accompagnants peuvent profiter d’un espace café-bar convivial, avec Wi-Fi gratuit, restauration engagée salle de télétravail. Un espace d’éveil est aussi prévu pour les plus petits, ainsi que des jeux, livres et dessins pour patienter en toute tranquillité.",
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
