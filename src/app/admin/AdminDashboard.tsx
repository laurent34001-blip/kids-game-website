"use client";

import { useMemo, useState } from "react";

type AtelierReview = {
  name: string;
  text: string;
};

type Atelier = {
  id: string;
  title: string;
  headline: string;
  description: string;
  mainImage: string;
  heroImages: string[];
  priceSolo: string;
  priceDuo: string;
  reviews: AtelierReview[];
};

const sharedData = [
  "Durée standard : 1h30",
  "Animateurs diplômés (BAFA, BPJEPS)",
  "Repart avec sa création",
  "Session enfant seul ou duo parent/enfant",
  "Matériel fourni et sécurisé",
];

const defaultAtelier: Atelier = {
  id: "porte-monnaie",
  title: "Le porte-monnaie des aventuriers",
  headline: "Fabrique ton propre porte-monnaie en cuir de A à Z !",
  description:
    "Découvre les gestes des maroquiniers, apprends à couper, percer et assembler le cuir, puis repars avec ta création personnalisée.",
  mainImage: "/images/cat_portefeuille.webp",
  heroImages: [
    "/images/atelier_portefeuille.webp",
    "/images/atelier_portefeuille_2.webp",
    "/images/atelier_portefeuille_3.webp",
    "/images/atelier_portefeuille_4.webp",
  ],
  priceSolo: "29,90 €",
  priceDuo: "39,90 €",
  reviews: [
    {
      name: "Aurélie, maman de Léonce",
      text: "Super expérience avec ma fille, on a pas vu le temps passer et on aurait pas pensé réussir à réaliser un si bel objet !",
    },
    {
      name: "Sophie, maman de Lucie",
      text: "Supers ateliers aussi bien pour des enfants que pour des pré-ados ! C'est ludique, instructif, bien cadré !",
    },
    {
      name: "Hervé, papa de Tiego",
      text: "Très bien encadré, beaucoup de pédagogie et de patience. Une super expérience !",
    },
  ],
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"ateliers" | "sessions">(
    "ateliers",
  );
  const [ateliers, setAteliers] = useState<Atelier[]>([defaultAtelier]);
  const [selectedAtelierId, setSelectedAtelierId] = useState<string>(
    defaultAtelier.id,
  );
  const [formState, setFormState] = useState({
    title: "",
    headline: "",
    description: "",
    mainImage: "",
    heroImages: "",
    priceSolo: "",
    priceDuo: "",
  });

  const selectedAtelier = useMemo(
    () => ateliers.find((atelier) => atelier.id === selectedAtelierId),
    [ateliers, selectedAtelierId],
  );

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAtelier = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = formState.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const heroImages = formState.heroImages
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const newAtelier: Atelier = {
      id: id || `atelier-${Date.now()}`,
      title: formState.title || "Nouvel atelier",
      headline: formState.headline || "Nouvelle expérience créative",
      description:
        formState.description ||
        "Description à compléter pour cet atelier.",
      mainImage: formState.mainImage || "/images/cat_portefeuille.webp",
      heroImages: heroImages.length > 0 ? heroImages : defaultAtelier.heroImages,
      priceSolo: formState.priceSolo || "29,90 €",
      priceDuo: formState.priceDuo || "39,90 €",
      reviews: [],
    };

    setAteliers((prev) => [newAtelier, ...prev]);
    setSelectedAtelierId(newAtelier.id);
    setFormState({
      title: "",
      headline: "",
      description: "",
      mainImage: "",
      heroImages: "",
      priceSolo: "",
      priceDuo: "",
    });
  };

  return (
    <section className="mt-8">
      <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("ateliers")}
          className={`rounded-full px-4 py-2 font-semibold transition-colors ${
            activeTab === "ateliers"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600"
          }`}
        >
          Ateliers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`rounded-full px-4 py-2 font-semibold transition-colors ${
            activeTab === "sessions"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600"
          }`}
        >
          Sessions
        </button>
      </div>

      {activeTab === "ateliers" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <form
            onSubmit={handleCreateAtelier}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold">Créer un atelier</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Renseignez les éléments visibles dans la page atelier. Le reste des
              informations est partagé.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <label className="text-xs font-semibold text-zinc-600">Titre</label>
                <input
                  value={formState.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                  placeholder="Le porte-monnaie des aventuriers"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Accroche (H1)
                </label>
                <input
                  value={formState.headline}
                  onChange={(event) => handleChange("headline", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                  placeholder="Fabrique ton propre porte-monnaie en cuir de A à Z !"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Description
                </label>
                <textarea
                  value={formState.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  className="mt-2 min-h-[120px] w-full rounded-2xl border border-zinc-200 px-4 py-3"
                  placeholder="Découvre les gestes des maroquiniers..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Image principale (cat_)
                </label>
                <input
                  value={formState.mainImage}
                  onChange={(event) => handleChange("mainImage", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                  placeholder="/images/cat_portefeuille.webp"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Images héro (séparées par des virgules)
                </label>
                <input
                  value={formState.heroImages}
                  onChange={(event) => handleChange("heroImages", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                  placeholder="/images/atelier_portefeuille.webp, ..."
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-600">
                    Prix enfant seul
                  </label>
                  <input
                    value={formState.priceSolo}
                    onChange={(event) => handleChange("priceSolo", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                    placeholder="29,90 €"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-600">
                    Prix duo
                  </label>
                  <input
                    value={formState.priceDuo}
                    onChange={(event) => handleChange("priceDuo", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                    placeholder="39,90 €"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Créer l'atelier
            </button>

            <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
              <p className="font-semibold">Données partagées</p>
              <ul className="mt-2 space-y-1">
                {sharedData.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Ateliers créés</h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Sélectionnez un atelier pour voir son contenu.
                  </p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                  {ateliers.length} atelier(s)
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {ateliers.map((atelier) => (
                  <button
                    key={atelier.id}
                    type="button"
                    onClick={() => setSelectedAtelierId(atelier.id)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      selectedAtelierId === atelier.id
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-700"
                    }`}
                  >
                    <span className="font-semibold">{atelier.title}</span>
                    <span className="text-xs">Voir</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedAtelier ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Aperçu</h3>
                  <span className="text-xs text-zinc-500">
                    Image principale + héro
                  </span>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                  <div className="overflow-hidden rounded-2xl bg-zinc-100">
                    <img
                      src={selectedAtelier.mainImage}
                      alt={selectedAtelier.title}
                      className="h-full max-h-[220px] w-full object-cover"
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedAtelier.heroImages.map((image) => (
                      <div
                        key={image}
                        className="overflow-hidden rounded-2xl bg-zinc-100"
                      >
                        <img
                          src={image}
                          alt={selectedAtelier.title}
                          className="h-24 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-base font-semibold">{selectedAtelier.headline}</h4>
                  <p className="mt-2 text-sm text-zinc-600">
                    {selectedAtelier.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-700">
                    Enfant seul : {selectedAtelier.priceSolo}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-700">
                    Duo : {selectedAtelier.priceDuo}
                  </span>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-zinc-700">
                    Avis
                  </h4>
                  {selectedAtelier.reviews.length === 0 ? (
                    <p className="mt-2 text-xs text-zinc-500">
                      Aucun avis renseigné pour cet atelier.
                    </p>
                  ) : (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {selectedAtelier.reviews.map((review) => (
                        <div
                          key={review.name}
                          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                        >
                          <p className="text-xs font-semibold text-zinc-600">
                            {review.name}
                          </p>
                          <p className="mt-2 text-sm text-zinc-700">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
          <h2 className="text-lg font-semibold text-zinc-900">Sessions</h2>
          <p className="mt-2">
            Les sessions seront gérées dans un module dédié (planning, jauges,
            privatisations). Vous pourrez y connecter les ateliers créés ci-dessus.
          </p>
        </div>
      )}
    </section>
  );
}
