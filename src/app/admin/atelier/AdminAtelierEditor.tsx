"use client";

import { useState } from "react";

type Review = {
  name: string;
  text: string;
};

type AtelierEditorProps = {
  atelier: {
    id: string;
    slug: string | null;
    title: string;
    headline: string | null;
    description: string;
    mainImage: string | null;
    crestImage: string | null;
    heroImages: string[];
    priceSolo: string | null;
    priceDuo: string | null;
    longDescription: string | null;
    reviews: Review[];
  };
};

const crestOptions = [
  "/images/blason_ducs.webp",
  "/images/blason_monets.webp",
  "/images/blason_scoffs.webp",
];

export default function AdminAtelierEditor({ atelier }: AtelierEditorProps) {
  const [title, setTitle] = useState(atelier.title);
  const [slug, setSlug] = useState(atelier.slug ?? "");
  const [headline, setHeadline] = useState(atelier.headline ?? "");
  const [description, setDescription] = useState(atelier.description);
  const [mainImage, setMainImage] = useState(atelier.mainImage ?? "");
  const [crestImage, setCrestImage] = useState(atelier.crestImage ?? "");
  const [heroImages, setHeroImages] = useState(atelier.heroImages.join(", "));
  const [priceSolo, setPriceSolo] = useState(atelier.priceSolo ?? "");
  const [priceDuo, setPriceDuo] = useState(atelier.priceDuo ?? "");
  const [longDescription, setLongDescription] = useState(
    atelier.longDescription ?? "",
  );
  const [reviews, setReviews] = useState<Review[]>(atelier.reviews);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReviewChange = (
    index: number,
    field: keyof Review,
    value: string,
  ) => {
    setReviews((prev) =>
      prev.map((review, i) =>
        i === index ? { ...review, [field]: value } : review,
      ),
    );
  };

  const handleAddReview = () => {
    setReviews((prev) => [...prev, { name: "", text: "" }]);
  };

  const handleRemoveReview = (index: number) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/ateliers/${atelier.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          headline,
          description,
          mainImage,
          crestImage,
          heroImages: heroImages
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          priceSolo,
          priceDuo,
          longDescription,
          reviews: reviews.filter((review) => review.name || review.text),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Impossible d'enregistrer.");
      }

      setMessage("Modifications enregistrées.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erreur lors de la sauvegarde.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]"
    >
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Contenu principal</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Ces données sont visibles sur la page publique de l'atelier.
        </p>

        <div className="mt-4 space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-zinc-600">Titre</label>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600">Slug</label>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="le-porte-monnaie-des-aventuriers"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600">Accroche</label>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600">
              Description
            </label>
            <textarea
              className="mt-2 min-h-[120px] w-full rounded-2xl border border-zinc-200 px-4 py-3"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600">
              Image principale
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
              value={mainImage}
              onChange={(event) => setMainImage(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600">Blason</label>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {crestOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setCrestImage(option)}
                  className={`overflow-hidden rounded-2xl border bg-white p-2 transition ${
                    crestImage === option ? "border-zinc-900" : "border-zinc-200"
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
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
              value={heroImages}
              onChange={(event) => setHeroImages(event.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-zinc-600">
                Prix enfant seul
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                value={priceSolo}
                onChange={(event) => setPriceSolo(event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600">Prix duo</label>
              <input
                className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                value={priceDuo}
                onChange={(event) => setPriceDuo(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-600">
              Grande description
            </label>
            <p className="mt-1 text-xs text-zinc-500">
              Utilise **texte** pour mettre en gras.
            </p>
            <textarea
              className="mt-2 min-h-[180px] w-full rounded-2xl border border-zinc-200 px-4 py-3"
              value={longDescription}
              onChange={(event) => setLongDescription(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Avis</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Ces avis seront affichés sur la page atelier.
          </p>

          <div className="mt-4 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-zinc-500">Aucun avis pour le moment.</p>
            ) : (
              reviews.map((review, index) => (
                <div
                  key={`${review.name}-${index}`}
                  className="rounded-2xl border border-zinc-200 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-zinc-500">
                      Avis {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveReview(index)}
                      className="text-xs text-red-500"
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    className="mt-3 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm"
                    placeholder="Nom"
                    value={review.name}
                    onChange={(event) =>
                      handleReviewChange(index, "name", event.target.value)
                    }
                  />
                  <textarea
                    className="mt-3 min-h-[90px] w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm"
                    placeholder="Texte de l'avis"
                    value={review.text}
                    onChange={(event) =>
                      handleReviewChange(index, "text", event.target.value)
                    }
                  />
                </div>
              ))
            )}

            <button
              type="button"
              onClick={handleAddReview}
              className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600"
            >
              Ajouter un avis
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Aperçu rapide</h2>
          <div className="mt-4 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">{headline || title}</p>
            <p className="mt-2">{description}</p>
            <p className="mt-3 text-xs text-zinc-500">
              Page publique :{" "}
              {slug ? (
                <a className="underline" href={`/les-ateliers/${slug}`}>
                  /les-ateliers/{slug}
                </a>
              ) : (
                "Slug manquant"
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        {message ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            {message}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={saving}
          className="mt-4 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
