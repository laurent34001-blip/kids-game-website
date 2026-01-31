"use client";

import { useMemo, useState } from "react";

export type AtelierReview = {
  name: string;
  text: string;
};

export type Atelier = {
  slug: string;
  title: string;
  headline: string | null;
  description: string;
  mainImage: string | null;
  crestImage: string | null;
  heroImages: string[];
  priceSolo: string | null;
  priceDuo: string | null;
  longDescription: string | null;
  reviews: AtelierReview[];
};

type AdminAtelierDashboardProps = {
  initialAteliers: Atelier[];
};

const sharedData = [
  "Durée standard : 1h30",
  "Animateurs diplômés (BAFA, BPJEPS)",
  "Repart avec sa création",
  "Session enfant seul ou duo parent/enfant",
  "Matériel fourni et sécurisé",
];

const imageOptions = [
  "/images/cat_portefeuille.webp",
  "/images/cat_peinture.webp",
  "/images/cat_cereal.webp",
  "/images/cat_domino.webp",
  "/images/atelier_portefeuille.webp",
  "/images/atelier_portefeuille_2.webp",
  "/images/atelier_portefeuille_3.webp",
  "/images/atelier_portefeuille_4.webp",
  "/images/photo_art.webp",
  "/images/photo_cuisine.webp",
  "/images/photo_peinture.webp",
  "/images/photo_diner.webp",
];

const crestOptions = [
  "/images/blason_ducs.webp",
  "/images/blason_monets.webp",
  "/images/blason_scoffs.webp",
];

export default function AdminAtelierDashboard({
  initialAteliers,
}: AdminAtelierDashboardProps) {
  const [ateliers, setAteliers] = useState<Atelier[]>(initialAteliers);
  const [selectedAtelierSlug, setSelectedAtelierSlug] = useState<string>(
    initialAteliers[0]?.slug ?? "",
  );
  const [editingAtelierSlug, setEditingAtelierSlug] = useState<string | null>(
    null,
  );
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formState, setFormState] = useState({
    title: "",
    slug: "",
    headline: "",
    description: "",
    mainImage: "",
    crestImage: "",
    heroImages: "",
    priceSolo: "",
    priceDuo: "",
    longDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAtelier = useMemo(
    () => ateliers.find((atelier) => atelier.slug === selectedAtelierSlug),
    [ateliers, selectedAtelierSlug],
  );

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const allImageOptions = [...imageOptions, ...uploadedImages];

  const parseHeroImages = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const toggleHeroImage = (src: string) => {
    setFormState((prev) => {
      const current = parseHeroImages(prev.heroImages);
      const next = current.includes(src)
        ? current.filter((image) => image !== src)
        : [...current, src];
      return { ...prev, heroImages: next.join(", ") };
    });
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return [] as string[];
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error ?? "Upload impossible.");
    }

    const data = (await response.json()) as { data: string[] };
    setUploadedImages((prev) => [...data.data, ...prev]);
    return data.data;
  };

  const fillFormFromAtelier = (atelier: Atelier) => {
    setFormState({
      title: atelier.title ?? "",
      slug: atelier.slug ?? "",
      headline: atelier.headline ?? "",
      description: atelier.description ?? "",
      mainImage: atelier.mainImage ?? "",
      crestImage: atelier.crestImage ?? "",
      heroImages: atelier.heroImages.join(", "),
      priceSolo: atelier.priceSolo ?? "",
      priceDuo: atelier.priceDuo ?? "",
      longDescription: atelier.longDescription ?? "",
    });
  };

  const resetForm = () => {
    setEditingAtelierSlug(null);
    setFormState({
      title: "",
      slug: "",
      headline: "",
      description: "",
      mainImage: "",
      crestImage: "",
      heroImages: "",
      priceSolo: "",
      priceDuo: "",
      longDescription: "",
    });
  };

  const handleCreateOrUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const editingAtelier = editingAtelierSlug
      ? ateliers.find((atelier) => atelier.slug === editingAtelierSlug)
      : undefined;
    const isEditing = Boolean(editingAtelier);

    try {
      if (isEditing && !editingAtelierSlug) {
        throw new Error("Le slug est requis pour mettre à jour l'atelier.");
      }
      const endpoint = isEditing
        ? `/api/ateliers/${editingAtelierSlug}`
        : "/api/ateliers";
      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formState.title,
          slug: formState.slug,
          headline: formState.headline,
          description: formState.description,
          mainImage: formState.mainImage,
          crestImage: formState.crestImage,
          heroImages: formState.heroImages
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          priceSolo: formState.priceSolo,
          priceDuo: formState.priceDuo,
          longDescription: formState.longDescription,
        }),
      });

      if (!response.ok) {
        const rawText = await response.text().catch(() => "");
        const data = rawText
          ? (JSON.parse(rawText) as { error?: string; detail?: string })
          : null;
        const detail = data?.detail ? ` (${data.detail})` : "";
        throw new Error(
          `${
            data?.error ??
            (isEditing
              ? "Impossible de mettre à jour l'atelier."
              : "Impossible de créer l'atelier.")
          }${detail}`,
        );
      }

      const data = (await response.json()) as { data: Atelier };
      if (isEditing) {
        setAteliers((prev) =>
          prev.map((atelier) =>
            atelier.slug === editingAtelierSlug ? data.data : atelier,
          ),
        );
        setSelectedAtelierSlug(data.data.slug ?? "");
        setEditingAtelierSlug(null);
        setFormState({
          title: "",
          slug: "",
          headline: "",
          description: "",
          mainImage: "",
          crestImage: "",
          heroImages: "",
          priceSolo: "",
          priceDuo: "",
          longDescription: "",
        });
      } else {
        setAteliers((prev) => [data.data, ...prev]);
        setSelectedAtelierSlug(data.data.slug ?? "");
        setFormState({
          title: "",
          slug: "",
          headline: "",
          description: "",
          mainImage: "",
          crestImage: "",
          heroImages: "",
          priceSolo: "",
          priceDuo: "",
          longDescription: "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
      <form
        onSubmit={handleCreateOrUpdate}
        className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">
            {editingAtelierSlug ? "Éditer un atelier" : "Créer un atelier"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600"
            >
              {editingAtelierSlug ? "Annuler" : "Créer un atelier"}
            </button>
          </div>
        </div>
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
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600">Lien</label>
            <input
              value={formState.slug}
              onChange={(event) => handleChange("slug", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
              placeholder="le-porte-monnaie-des-aventuriers"
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
            <select
              value={formState.mainImage}
              onChange={(event) => handleChange("mainImage", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
            >
              <option value="">Sélectionner une image</option>
              {allImageOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replace("/images/", "")}
                </option>
              ))}
            </select>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <label className="rounded-full border border-zinc-200 px-3 py-1 font-semibold text-zinc-600">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    try {
                      const uploaded = await uploadFiles(event.target.files);
                      if (uploaded[0]) {
                        handleChange("mainImage", uploaded[0]);
                      }
                      event.target.value = "";
                    } catch (err) {
                      setError(
                        err instanceof Error ? err.message : "Upload impossible.",
                      );
                    }
                  }}
                />
                Ajouter une image
              </label>
              <span>Formats conseillés : .webp, .jpg, .png</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {allImageOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleChange("mainImage", option)}
                  className={`overflow-hidden rounded-2xl border transition ${
                    formState.mainImage === option
                      ? "border-zinc-900"
                      : "border-zinc-200"
                  }`}
                >
                  <img
                    src={option}
                    alt={option}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600">Blason</label>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {crestOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleChange("crestImage", option)}
                  className={`overflow-hidden rounded-2xl border bg-white p-2 transition ${
                    formState.crestImage === option
                      ? "border-zinc-900"
                      : "border-zinc-200"
                  }`}
                >
                  <img
                    src={option}
                    alt={option}
                    className="h-12 w-full object-contain"
                  />
                </button>
              ))}
            </div>
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
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <label className="rounded-full border border-zinc-200 px-3 py-1 font-semibold text-zinc-600">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (event) => {
                    try {
                      const uploaded = await uploadFiles(event.target.files);
                      if (uploaded.length > 0) {
                        setFormState((prev) => ({
                          ...prev,
                          heroImages: [
                            ...parseHeroImages(prev.heroImages),
                            ...uploaded,
                          ].join(", "),
                        }));
                      }
                      event.target.value = "";
                    } catch (err) {
                      setError(
                        err instanceof Error ? err.message : "Upload impossible.",
                      );
                    }
                  }}
                />
                Ajouter des images
              </label>
              <span>Sélection multiple possible</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {allImageOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => toggleHeroImage(option)}
                  className={`overflow-hidden rounded-2xl border transition ${
                    parseHeroImages(formState.heroImages).includes(option)
                      ? "border-zinc-900"
                      : "border-zinc-200"
                  }`}
                >
                  <img
                    src={option}
                    alt={option}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
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

          <div className="mt-6">
            <label className="text-xs font-semibold text-zinc-600">
              Grande description
            </label>
            <p className="mt-1 text-xs text-zinc-500">
              Utilise **texte** pour mettre en gras. Un retour à la ligne =
              nouveau paragraphe.
            </p>
            <textarea
              value={formState.longDescription}
              onChange={(event) => handleChange("longDescription", event.target.value)}
              className="mt-2 min-h-[180px] w-full rounded-2xl border border-zinc-200 px-4 py-3"
              placeholder="**Déroulé de l'atelier**\nAccueil..."
            />
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {isSubmitting
            ? "Enregistrement..."
            : editingAtelierSlug
              ? "Mettre à jour"
              : "Créer l'atelier"}
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
              <div
                key={atelier.slug || atelier.title}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedAtelierSlug === atelier.slug
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (!atelier.slug) {
                      setError(
                        "Ajoutez un slug avant de sélectionner cet atelier.",
                      );
                      return;
                    }
                    setSelectedAtelierSlug(atelier.slug);
                  }}
                  className="text-left font-semibold"
                >
                  {atelier.title}
                </button>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    className="rounded-full bg-white/10 px-3 py-1"
                    onClick={() => {
                      if (!atelier.slug) {
                        setError(
                          "Ajoutez un slug avant d'éditer cet atelier.",
                        );
                        return;
                      }
                      setSelectedAtelierSlug(atelier.slug);
                      setEditingAtelierSlug(atelier.slug);
                      fillFormFromAtelier(atelier);
                    }}
                  >
                    Éditer
                  </button>
                  {atelier.slug ? (
                    <a
                      className="rounded-full bg-white/10 px-3 py-1"
                      href={`/les-ateliers/${atelier.slug}`}
                    >
                      Voir
                    </a>
                  ) : null}
                </div>
              </div>
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
                {selectedAtelier.mainImage ? (
                  <img
                    src={selectedAtelier.mainImage}
                    alt={selectedAtelier.title}
                    className="h-full max-h-[220px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[220px] items-center justify-center text-xs text-zinc-500">
                    Ajoutez une image principale.
                  </div>
                )}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {selectedAtelier.heroImages.length > 0 ? (
                  selectedAtelier.heroImages.map((image) => (
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
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-xs text-zinc-500">
                    Ajoutez des images héro.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-base font-semibold">
                {selectedAtelier.headline ?? selectedAtelier.title}
              </h4>
              <p className="mt-2 text-sm text-zinc-600">
                {selectedAtelier.description}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-700">
                Enfant seul : {selectedAtelier.priceSolo ?? "-"}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-700">
                Duo : {selectedAtelier.priceDuo ?? "-"}
              </span>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-zinc-700">Avis</h4>
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
    </section>
  );
}
