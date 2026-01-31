"use client";

import { useEffect, useRef, useState } from "react";

const defaultAtelier = {
  slug: "le-porte-monnaie-des-aventuriers",
  title: "Le porte-monnaie des aventuriers",
  headline: "Fabrique ton propre porte-monnaie en cuir de A à Z !",
  description:
    "Découvre les gestes des maroquiniers, apprends à couper, percer et assembler le cuir, puis repars avec ta création personnalisée.",
  mainImage: "/images/cat_portefeuille.webp",
  crestImage: "/images/blason_ducs.webp",
  heroImages: [
    "/images/atelier_portefeuille.webp",
    "/images/atelier_portefeuille_2.webp",
    "/images/atelier_portefeuille_3.webp",
    "/images/atelier_portefeuille_4.webp",
  ],
  priceSolo: "29,90 €",
  priceDuo: "39,90 €",
  longDescription:
    "**Déroulé de l'atelier**\nAccueil dans l'atelier des aventuriers : découverte des outils et du cuir.\nChoix du cuir et design : les apprentis artisans sélectionnent formes et couleurs.\nFabrication du porte-monnaie : traçage, perçage et assemblage des pièces.\nPersonnalisation et finitions : poinçons, marquages et touches finales.",
  reviews: [
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
  ],
};

export default function PorteMonnaieDesAventuriersPage() {
  const [priceMode, setPriceMode] = useState<"solo" | "duo">("duo");
  const [isFading, setIsFading] = useState(false);
  const [atelier, setAtelier] = useState(defaultAtelier);
  const [showCalendar, setShowCalendar] = useState(false);
  const [frozenOffset, setFrozenOffset] = useState<number | null>(null);
  const asideRef = useRef<HTMLDivElement | null>(null);
  const bookingFormRef = useRef<HTMLDivElement | null>(null);
  const naturalTopRef = useRef<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<{
    day: number;
    label: string;
    slots: number;
  } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSessionRemaining, setSelectedSessionRemaining] = useState<number | null>(null);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonthIndex, setCalendarMonthIndex] = useState(
    new Date().getMonth(),
  );
  const [bookingForm, setBookingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [children, setChildren] = useState<
    Array<{ firstName: string; ageRange: string }>
  >([{ firstName: "", ageRange: "" }]);
  const [adults, setAdults] = useState<
    Array<{ firstName: string; lastName: string; birthDate: string; phone: string }>
  >([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | null
  >(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [reservationCompleted, setReservationCompleted] = useState(false);
  // ...
  const [sessions, setSessions] = useState<
    Array<{
      id: string;
      startAt: string;
      endAt: string;
      unitsRemaining: number;
      isPrivate: boolean;
      status: string;
    }>
  >([]);

  useEffect(() => {
    setIsFading(true);
    const timeout = setTimeout(() => setIsFading(false), 160);
    return () => clearTimeout(timeout);
  }, [priceMode]);

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/ateliers/slug/${defaultAtelier.slug}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.data || !isMounted) {
          return;
        }

        const remote = data.data as Partial<typeof defaultAtelier> & {
          heroImages?: string[];
          reviews?: Array<{ name: string; text: string }>;
        };

        setAtelier({
          ...defaultAtelier,
          ...remote,
          headline: remote.headline || defaultAtelier.headline,
          description: remote.description || defaultAtelier.description,
          mainImage: remote.mainImage || defaultAtelier.mainImage,
          crestImage: remote.crestImage || defaultAtelier.crestImage,
          heroImages: Array.isArray(remote.heroImages)
            ? remote.heroImages
            : defaultAtelier.heroImages,
          longDescription:
            remote.longDescription || defaultAtelier.longDescription,
          reviews: Array.isArray(remote.reviews)
            ? remote.reviews.map((review, index) => ({
                ...review,
                span: defaultAtelier.reviews[index]?.span ?? "lg:col-span-4",
              }))
            : defaultAtelier.reviews,
        });
      })
      .catch(() => null);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!asideRef.current || naturalTopRef.current !== null) {
      return;
    }

    const rect = asideRef.current.getBoundingClientRect();
    naturalTopRef.current = rect.top + window.scrollY;
  }, []);

  useEffect(() => {
    fetch(`/api/ateliers/slug/${defaultAtelier.slug}/disponibilites`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.data) {
          return;
        }
        setSessions(data.data);
      })
      .catch(() => null);
  }, []);

  // ...

  const reviews = atelier.reviews.length ? atelier.reviews : defaultAtelier.reviews;
  const priceSolo = atelier.priceSolo ?? defaultAtelier.priceSolo;
  const priceDuo = atelier.priceDuo ?? defaultAtelier.priceDuo;
  const crestImage = atelier.crestImage ?? defaultAtelier.crestImage;
  const highlights = [
    "1h30 d'atelier avec un animateur ou une animatrice diplômé.e",
    "Repars à la maison avec ta création",
    "7-12 ans pour les enfants seuls, 4-12 ans avec un adulte accompagnant",
  ];
  const longDescription =
    atelier.longDescription ?? defaultAtelier.longDescription;
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth();
  const startOfToday = new Date(currentYear, currentMonthIndex, today.getDate());
  const isCurrentMonth =
    calendarYear === currentYear && calendarMonthIndex === currentMonthIndex;
  const canGoPrev = !isCurrentMonth;
  const calendarMonth = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
  })
    .format(new Date(calendarYear, calendarMonthIndex, 1))
    .toUpperCase();
  const calendarMonthLabel = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
  }).format(new Date(calendarYear, calendarMonthIndex, 1));
  const calendarOffset =
    (new Date(calendarYear, calendarMonthIndex, 1).getDay() + 6) % 7;
  const ageRanges = ["3-4 ans", "5-6 ans", "7-9 ans", "10-12 ans"];
  const dayKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const sessionsByDay = sessions.reduce<Record<string, typeof sessions>>(
    (acc, session) => {
      const sessionDate = new Date(session.startAt);
      const key = dayKey(sessionDate);
      acc[key] = acc[key] ? [...acc[key], session] : [session];
      return acc;
    },
    {},
  );
  const daysInMonth = new Date(
    calendarYear,
    calendarMonthIndex + 1,
    0,
  ).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dayDate = new Date(calendarYear, calendarMonthIndex, day);
    const isPast = dayDate < startOfToday;
    const key = dayKey(dayDate);
    const daySessions = sessionsByDay[key] ?? [];
    const remaining = daySessions.reduce(
      (sum, session) => {
        const sessionStart = new Date(session.startAt);
        if (sessionStart < startOfToday) {
          return sum;
        }
        if (session.isPrivate || session.status !== "OPEN") {
          return sum;
        }
        return sum + (session.unitsRemaining ?? 0);
      },
      0,
    );
    const slots = isPast ? 0 : Math.max(Math.floor(remaining), 0);
    return {
      day,
      slots,
      status: slots > 0 ? "available" : "disabled",
    };
  });
  const calendarGrid = [
    ...Array.from({ length: calendarOffset }, () => null),
    ...calendarDays,
  ];
  const selectedDate = selectedDay
    ? new Date(calendarYear, calendarMonthIndex, selectedDay.day)
    : null;
  const selectedDayKey = selectedDate ? dayKey(selectedDate) : null;
  const selectedDaySessions = selectedDayKey
    ? sessionsByDay[selectedDayKey] ?? []
    : [];
  const timeSlots = selectedDaySessions.map((session) => {
    const startAt = new Date(session.startAt);
    const time = startAt.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const isPast = startAt < today;
    const isDisabled =
      isPast ||
      session.unitsRemaining <= 0 ||
      session.isPrivate ||
      session.status !== "OPEN";
    return {
      time,
      status: isDisabled ? "disabled" : "available",
      sessionId: session.id,
      unitsRemaining: session.unitsRemaining,
      isPast,
    };
  });

  const parsePrice = (price: string) => {
    const numeric = Number(price.replace(/[€\s]/g, "").replace(",", "."));
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const formatEuro = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  const unitPrice = parsePrice(priceMode === "solo" ? priceSolo : priceDuo);
  const availableUnits = selectedSessionRemaining ?? selectedDay?.slots ?? 0;
  const childrenCount = Math.min(children.length, availableUnits);
  const adultsCount = adults.length;
  const childrenPrice = 29.9;
  const adultPrice = 10;
  const finalTotal = childrenCount * childrenPrice + adultsCount * adultPrice;
  const isCapacityExceeded =
    Boolean(selectedDay) && children.length > availableUnits;
  const isFormValid =
    Boolean(selectedDay) &&
    Boolean(selectedTime) &&
    Boolean(selectedSessionId) &&
    bookingForm.firstName.trim().length > 0 &&
    bookingForm.lastName.trim().length > 0 &&
    bookingForm.email.trim().length > 0 &&
    bookingForm.phone.trim().length > 0 &&
    cgvAccepted &&
    !isCapacityExceeded &&
    children.every(
      (child) => child.firstName.trim() && child.ageRange.trim(),
    ) &&
    adults.every(
      (adult) =>
        adult.firstName.trim() &&
        adult.lastName.trim() &&
        adult.birthDate.trim() &&
        adult.phone.trim(),
    );

  const renderRichText = (text: string) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.map((line, index) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={`${line}-${index}`} className="mt-3 text-sm text-zinc-700">
          {parts.map((part, partIndex) =>
            partIndex % 2 === 1 ? (
              <strong key={`${line}-${partIndex}`} className="font-semibold">
                {part}
              </strong>
            ) : (
              <span key={`${line}-${partIndex}`}>{part}</span>
            ),
          )}
        </p>
      );
    });
  };

  const handlePaymentSuccess = async () => {
    if (!isFormValid || !selectedSessionId) {
      setValidationError(
        "Merci de compléter tous les champs obligatoires avant le paiement.",
      );
      return;
    }

    setValidationError(null);

    const participants = [
      ...children.map((child) => ({
        type: "CHILD" as const,
        firstName: child.firstName,
        ageRange: child.ageRange,
      })),
      ...adults.map((adult) => ({
        type: "ADULT" as const,
        firstName: adult.firstName,
        lastName: adult.lastName,
        birthDate: adult.birthDate,
        phone: adult.phone,
      })),
    ];

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          customerFirstName: bookingForm.firstName,
          customerLastName: bookingForm.lastName,
          customerEmail: bookingForm.email,
          customerPhone: bookingForm.phone,
          participants,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setValidationError(
          data?.error ?? "Une erreur est survenue lors de la réservation.",
        );
        return;
      }

      setPaymentStatus("success");
      setReservationCompleted(true);
    } catch {
      setValidationError("Une erreur est survenue lors de la réservation.");
    }
  };

  return (
    <main className="min-h-screen bg-[#1f3d2a] text-white">
      {paymentStatus ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-zinc-900 shadow-xl">
            <p className="text-sm font-semibold">
              {paymentStatus === "success"
                ? "Paiement validé"
                : "Paiement échoué"}
            </p>
            {paymentStatus === "success" ? (
              <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs">
                <p className="font-semibold text-zinc-900">Résumé de réservation</p>
                <p className="mt-2">Atelier : {atelier.title}</p>
                <p>Date : {selectedDay?.label ?? "-"}</p>
                <p>Heure : {selectedTime ?? "-"}</p>
                <p>Enfants : {childrenCount}</p>
                <p>Adultes : {adultsCount}</p>
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs">
                <p className="font-semibold text-zinc-900">
                  Aucune réservation n’a été enregistrée.
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setPaymentStatus(null)}
              className="mt-4 w-full rounded-lg bg-[#1f3d2a] px-3 py-2 text-xs font-semibold text-white"
            >
              Fermer
            </button>
          </div>
        </div>
      ) : null}
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
          <span className="text-white">{atelier.title}</span>
        </nav>

        <div className="mt-5">
          <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">
            {atelier.headline}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
            {atelier.description}
          </p>
        </div>

        <div className="mt-8 grid flex-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
          <figure className="overflow-hidden rounded-[28px] bg-[#2d5a3d] shadow-lg">
            <img
              className="h-full max-h-[360px] w-full object-cover"
              src={atelier.mainImage}
              alt={atelier.title}
            />
          </figure>

          <div className="grid gap-4 sm:grid-cols-2">
            {atelier.heroImages.map((image) => (
              <div
                key={image}
                className="overflow-hidden rounded-[22px] bg-[#2d5a3d] shadow-lg"
              >
                <img
                  className="h-40 w-full object-cover sm:h-44"
                  src={image}
                  alt={atelier.title}
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
                src={crestImage}
                alt="Blason des Ducs"
              />
              <div>
                <h2 className="text-2xl font-extrabold">{atelier.headline}</h2>
                <p className="mt-2 text-sm text-zinc-700">
                  {atelier.description}
                </p>
              </div>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-zinc-800">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f3d8dc] text-[#6b1515]">
                    ✓
                  </span>
                  <span className="font-semibold text-zinc-900">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-zinc-700">
              Partez à l'aventure dans le monde du cuir avec les Ducs. Ceux-ci ont fixé
              aux participants un nouveau défi : fabriquer un véritable porte-monnaie
              d'aventurier, robuste, personnalisé et prêt à accompagner les explorateurs
              de Djogo dans leurs quêtes !
            </p>

            <div className="mt-6">
              <div className="text-sm text-zinc-700">
                {renderRichText(longDescription)}
              </div>
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

          <aside
            ref={asideRef}
            className={`${
              showCalendar ? "" : "sticky top-24"
            } self-start`}
            style={
              showCalendar && frozenOffset !== null
                ? { marginTop: frozenOffset }
                : undefined
            }
          >
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
                  {priceMode === "solo" ? priceSolo : priceDuo}
                </p>
                <p className="text-sm text-zinc-600">
                  {priceMode === "solo"
                    ? "par enfant"
                    : "pour un duo Enfant + Adulte"}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!showCalendar && asideRef.current) {
                      const rect = asideRef.current.getBoundingClientRect();
                      const currentDocTop = rect.top + window.scrollY;
                      const naturalTop =
                        naturalTopRef.current ?? currentDocTop;
                      setFrozenOffset(
                        Math.max(currentDocTop - naturalTop, 0),
                      );
                    } else if (showCalendar) {
                      setFrozenOffset(null);
                    }

                    setShowCalendar((prev) => !prev);
                    if (!showCalendar) {
                      requestAnimationFrame(() => {
                        const target = bookingFormRef.current;
                        if (!target) {
                          return;
                        }
                        const rect = target.getBoundingClientRect();
                        if (rect.top < 0) {
                          target.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      });
                    }
                  }}
                  className="flex w-full items-center justify-center rounded-full bg-[#39c24a] px-4 py-3 text-sm font-extrabold text-white shadow-[0_6px_0_0_#1f8f34] transition-transform hover:-translate-y-0.5"
                >
                  RÉSERVER
                </button>
                <a
                  className="flex w-full items-center justify-center rounded-full bg-[#f8df5a] px-4 py-3 text-xs font-extrabold text-zinc-900 shadow-[0_6px_0_0_#d4b73d] transition-transform hover:-translate-y-0.5"
                  href="/contact"
                >
                  PRIVATISER POUR UN ANNIVERSAIRE
                </a>
              </div>

              {showCalendar ? (
                <div
                  ref={bookingFormRef}
                  className="mt-6 rounded-2xl border border-[#e9d9c5] bg-[#f7efe3] p-4"
                >
                  <p className="text-sm font-semibold text-zinc-900">
                    1. Choisir une date
                  </p>
                  <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (!canGoPrev) {
                            return;
                          }
                          setSelectedDay(null);
                          setSelectedTime(null);
                          if (calendarMonthIndex === 0) {
                            setCalendarYear((prev) => prev - 1);
                            setCalendarMonthIndex(11);
                          } else {
                            setCalendarMonthIndex((prev) => prev - 1);
                          }
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
                          canGoPrev ? "bg-black" : "bg-zinc-300"
                        }`}
                        aria-label="Mois précédent"
                        disabled={!canGoPrev}
                      >
                        <span className="text-lg">‹</span>
                      </button>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-zinc-900">
                        {calendarMonth} {calendarYear}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDay(null);
                          setSelectedTime(null);
                          if (calendarMonthIndex === 11) {
                            setCalendarYear((prev) => prev + 1);
                            setCalendarMonthIndex(0);
                          } else {
                            setCalendarMonthIndex((prev) => prev + 1);
                          }
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"
                        aria-label="Mois suivant"
                      >
                        <span className="text-lg">›</span>
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-zinc-700">
                      {["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."].map(
                        (dayLabel) => (
                          <span key={dayLabel}>{dayLabel}</span>
                        ),
                      )}
                    </div>

                    <div className="mt-2 grid grid-cols-7 gap-2">
                      {calendarGrid.map((day, index) => {
                        if (!day) {
                          return <div key={`empty-${index}`} />;
                        }

                        const isSelected = selectedDay?.day === day.day;
                        const isDisabled = day.status === "disabled";

                        return (
                          <button
                            key={day.day}
                            type="button"
                            onClick={() =>
                              isDisabled
                                ? null
                                : (setSelectedDay({
                                    day: day.day,
                                    label: `${day.day} ${calendarMonthLabel}`,
                                    slots: day.slots,
                                  }),
                                  setSelectedTime(null),
                                    setSelectedSessionId(null),
                                    setSelectedSessionRemaining(null))
                            }
                            className={`flex h-9 items-center justify-center rounded-md border text-sm font-semibold transition-colors ${
                              isSelected
                                ? "border-[#df3b1a] bg-[#df3b1a] text-white"
                                : isDisabled
                                  ? "border-zinc-200 bg-zinc-100 text-zinc-400"
                                  : "border-zinc-200 bg-white text-zinc-900 hover:border-[#1f3d2a]"
                            }`}
                            disabled={isDisabled}
                          >
                            {day.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Debug panels supprimés */}

                  {selectedDay ? (
                    <div className="mt-4 rounded-2xl border border-[#e9d9c5] bg-[#f7efe3] p-4">
                      <p className="text-sm font-semibold text-zinc-900">
                        2. Choisir un créneau
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {timeSlots.length ? (
                          timeSlots.map((slot) => {
                            const isDisabled = slot.status === "disabled";
                            const isSelected = selectedTime === slot.time;
                            return (
                              <button
                                key={slot.sessionId}
                                type="button"
                                onClick={() =>
                                  isDisabled
                                    ? null
                                    : (setSelectedTime(slot.time),
                                      setSelectedSessionId(slot.sessionId),
                                      setSelectedSessionRemaining(slot.unitsRemaining ?? 0))
                                }
                                className={`flex h-11 flex-col items-center justify-center gap-0.5 rounded-md border text-sm font-semibold transition-colors ${
                                  isSelected
                                    ? "border-[#df3b1a] bg-[#df3b1a] text-white"
                                    : isDisabled
                                      ? "border-zinc-200 bg-zinc-100 text-zinc-400"
                                      : "border-zinc-200 bg-white text-zinc-900 hover:border-[#1f3d2a]"
                                }`}
                                disabled={isDisabled}
                              >
                                <span>{slot.time}</span>
                                {slot.isPast ? null : (
                                  <span className="text-[10px] font-medium">
                                    {Math.max(Math.floor(slot.unitsRemaining ?? 0), 0)} places
                                  </span>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="col-span-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-500">
                            Aucun créneau disponible pour cette date.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {selectedDay && selectedTime ? (
                    <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-zinc-900">
                        Réservation pour {selectedDay.label} à {selectedTime}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {availableUnits} places disponibles
                      </p>
                      {reservationCompleted ? (
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                            ✓
                          </span>
                          <span className="font-semibold">
                            Réservation déjà effectuée
                          </span>
                        </div>
                      ) : (
                        <div className="mt-3 grid gap-3 text-sm">
                          <label className="grid gap-1">
                            <span className="text-xs font-semibold text-zinc-600">Nom</span>
                            <input
                              value={bookingForm.lastName}
                              onChange={(event) =>
                                setBookingForm((prev) => ({
                                  ...prev,
                                  lastName: event.target.value,
                                }))
                              }
                              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                              placeholder="Nom du responsable de la réservation"
                              type="text"
                            />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-xs font-semibold text-zinc-600">Prénom</span>
                            <input
                              value={bookingForm.firstName}
                              onChange={(event) =>
                                setBookingForm((prev) => ({
                                  ...prev,
                                  firstName: event.target.value,
                                }))
                              }
                              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                              placeholder="Prénom du responsable de la réservation"
                              type="text"
                            />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-xs font-semibold text-zinc-600">Adresse mail</span>
                            <input
                              value={bookingForm.email}
                              onChange={(event) =>
                                setBookingForm((prev) => ({
                                  ...prev,
                                  email: event.target.value,
                                }))
                              }
                              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                              placeholder="camille@email.com"
                              type="email"
                            />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-xs font-semibold text-zinc-600">
                              Numéro de téléphone
                            </span>
                            <input
                              value={bookingForm.phone}
                              onChange={(event) =>
                                setBookingForm((prev) => ({
                                  ...prev,
                                  phone: event.target.value,
                                }))
                              }
                              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                              placeholder="06 00 00 00 00"
                              type="tel"
                            />
                          </label>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={() =>
                                setChildren((prev) => [
                                  ...prev,
                                  { firstName: "", ageRange: "" },
                                ])
                              }
                              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:border-[#1f3d2a]"
                            >
                              + Ajouter un enfant
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setAdults((prev) => [
                                  ...prev,
                                  {
                                    firstName: "",
                                    lastName: "",
                                    birthDate: "",
                                    phone: "",
                                  },
                                ])
                              }
                              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:border-[#1f3d2a]"
                            >
                              + Ajouter un adulte
                            </button>
                          </div>

                          {children.length ? (
                            <div className="space-y-2">
                              {children.map((child, index) => (
                                <details
                                  key={`child-${index}`}
                                  className="group rounded-xl border border-zinc-200 bg-white px-3 py-2"
                                >
                                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-zinc-900">
                                    <span>
                                      {child.firstName.trim()
                                        ? child.firstName
                                        : "Informations enfant"}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {index > 0 ? (
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            setChildren((prev) =>
                                              prev.filter(
                                                (_, itemIndex) => itemIndex !== index,
                                              ),
                                            );
                                          }}
                                          className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-rose-600"
                                        >
                                          Supprimer
                                        </button>
                                      ) : null}
                                      <span className="text-zinc-400">▾</span>
                                    </div>
                                  </summary>
                                  <div className="mt-3 grid gap-2">
                                    <label className="grid gap-1">
                                      <span className="text-xs font-semibold text-zinc-600">
                                        Prénom
                                      </span>
                                      <input
                                        value={child.firstName}
                                        onChange={(event) =>
                                          setChildren((prev) =>
                                            prev.map((item, itemIndex) =>
                                              itemIndex === index
                                                ? {
                                                    ...item,
                                                    firstName: event.target.value,
                                                  }
                                                : item,
                                            ),
                                          )
                                        }
                                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                                        placeholder="Prénom"
                                        type="text"
                                      />
                                    </label>
                                    <label className="grid gap-1">
                                      <span className="text-xs font-semibold text-zinc-600">
                                        Tranche d'âge
                                      </span>
                                      <select
                                        value={child.ageRange}
                                        onChange={(event) =>
                                          setChildren((prev) =>
                                            prev.map((item, itemIndex) =>
                                              itemIndex === index
                                                ? {
                                                    ...item,
                                                    ageRange: event.target.value,
                                                  }
                                                : item,
                                            ),
                                          )
                                        }
                                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                                      >
                                        <option value="">Sélectionner</option>
                                        {ageRanges.map((range) => (
                                          <option key={range} value={range}>
                                            {range}
                                          </option>
                                        ))}
                                      </select>
                                    </label>
                                  </div>
                                </details>
                              ))}
                            </div>
                          ) : null}

                          {selectedDay && children.length > availableUnits ? (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                              Le nombre d'enfants dépasse les places disponibles ({availableUnits}).
                            </div>
                          ) : null}

                          {adults.length ? (
                            <div className="space-y-2">
                              {adults.map((adult, index) => (
                                <details
                                  key={`adult-${index}`}
                                  className="group rounded-xl border border-zinc-200 bg-white px-3 py-2"
                                >
                                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-zinc-900">
                                    <span>Adulte {index + 1}</span>
                                    <div className="flex items-center gap-2">
                                      {index === 0 ? (
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            setAdults((prev) =>
                                              prev.map((item, itemIndex) =>
                                                itemIndex === 0
                                                  ? {
                                                      ...item,
                                                      firstName: bookingForm.firstName,
                                                      lastName: bookingForm.lastName,
                                                      phone: bookingForm.phone,
                                                    }
                                                  : item,
                                              ),
                                            );
                                          }}
                                          className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-700"
                                        >
                                          Moi
                                        </button>
                                      ) : null}
                                      {index > 0 ? (
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            setAdults((prev) =>
                                              prev.filter(
                                                (_, itemIndex) => itemIndex !== index,
                                              ),
                                            );
                                          }}
                                          className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-rose-600"
                                        >
                                          Supprimer
                                        </button>
                                      ) : null}
                                      <span className="text-zinc-400">▾</span>
                                    </div>
                                  </summary>
                                  <div className="mt-3 grid gap-2">
                                    <label className="grid gap-1">
                                      <span className="text-xs font-semibold text-zinc-600">
                                        Nom
                                      </span>
                                      <input
                                        value={adult.lastName}
                                        onChange={(event) =>
                                          setAdults((prev) =>
                                            prev.map((item, itemIndex) =>
                                              itemIndex === index
                                                ? {
                                                    ...item,
                                                    lastName: event.target.value,
                                                  }
                                                : item,
                                            ),
                                          )
                                        }
                                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                                        placeholder="Nom"
                                        type="text"
                                      />
                                    </label>
                                    <label className="grid gap-1">
                                      <span className="text-xs font-semibold text-zinc-600">
                                        Prénom
                                      </span>
                                      <input
                                        value={adult.firstName}
                                        onChange={(event) =>
                                          setAdults((prev) =>
                                            prev.map((item, itemIndex) =>
                                              itemIndex === index
                                                ? {
                                                    ...item,
                                                    firstName: event.target.value,
                                                  }
                                                : item,
                                            ),
                                          )
                                        }
                                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                                        placeholder="Prénom"
                                        type="text"
                                      />
                                    </label>
                                    <label className="grid gap-1">
                                      <span className="text-xs font-semibold text-zinc-600">
                                        Date de naissance
                                      </span>
                                      <input
                                        value={adult.birthDate}
                                        onChange={(event) =>
                                          setAdults((prev) =>
                                            prev.map((item, itemIndex) =>
                                              itemIndex === index
                                                ? {
                                                    ...item,
                                                    birthDate: event.target.value,
                                                  }
                                                : item,
                                            ),
                                          )
                                        }
                                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                                        placeholder="JJ/MM/AAAA"
                                        type="text"
                                      />
                                    </label>
                                    <label className="grid gap-1">
                                      <span className="text-xs font-semibold text-zinc-600">
                                        Numéro de téléphone
                                      </span>
                                      <input
                                        value={adult.phone}
                                        onChange={(event) =>
                                          setAdults((prev) =>
                                            prev.map((item, itemIndex) =>
                                              itemIndex === index
                                                ? {
                                                    ...item,
                                                    phone: event.target.value,
                                                  }
                                                : item,
                                            ),
                                          )
                                        }
                                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                                        placeholder="06 00 00 00 00"
                                        type="tel"
                                      />
                                    </label>
                                  </div>
                                </details>
                              ))}
                            </div>
                          ) : null}
                          <label className="mt-1 flex items-start gap-2 text-xs text-zinc-700">
                            <input
                              type="checkbox"
                              checked={cgvAccepted}
                              onChange={(event) => setCgvAccepted(event.target.checked)}
                              className="mt-0.5 h-4 w-4 rounded border-zinc-300"
                            />
                            <span>
                              J’accepte les{" "}
                              <a className="font-semibold underline" href="/cgv">
                                CGV
                              </a>
                              {" "}(obligatoire)
                            </span>
                          </label>
                          <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-xs text-zinc-700">
                            <div className="flex items-center justify-between">
                              <span>Enfants x {childrenCount}</span>
                              <span>{formatEuro(childrenCount * childrenPrice)}</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <span>Adultes x {adultsCount}</span>
                              <span>{formatEuro(adultsCount * adultPrice)}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm font-semibold text-zinc-900">
                              <span>Total</span>
                              <span>{formatEuro(finalTotal)}</span>
                            </div>
                          </div>
                          {validationError ? (
                            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                              {validationError}
                            </div>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => {
                              if (!isFormValid) {
                                setValidationError(
                                  "Merci de compléter tous les champs obligatoires avant le paiement.",
                                );
                                return;
                              }
                              setValidationError(null);
                              setShowPayment(true);
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-xs font-semibold text-white ${
                              isFormValid
                                ? "bg-[#39c24a]"
                                : "bg-zinc-300 text-zinc-500"
                            }`}
                          >
                            Payer pour réserver
                          </button>

                          {showPayment ? (
                            <div className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-xs">
                              <p className="font-semibold text-zinc-900">
                                Processeur de paiement
                              </p>
                              <div className="mt-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-4 text-center text-zinc-500">
                                Champ de paiement (mock)
                              </div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <button
                                  type="button"
                                  onClick={handlePaymentSuccess}
                                  className="rounded-lg bg-[#1f3d2a] px-3 py-2 text-xs font-semibold text-white"
                                >
                                  Valider le paiement
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPaymentStatus("failed")}
                                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900"
                                >
                                  Paiement échoué
                                </button>
                              </div>
                            </div>
                          ) : null}
                          <label className="grid gap-1">
                            <span className="text-xs font-semibold text-zinc-600">
                              Tarif final
                            </span>
                            <input
                              value={formatEuro(finalTotal)}
                              readOnly
                              className="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
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
            {reviews.map((testimonial) => (
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
