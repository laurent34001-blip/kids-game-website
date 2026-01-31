"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type AtelierReview = {
  name: string;
  text: string;
  span?: string;
};

type AtelierLandingProps = {
  atelier: {
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
};

const sharedHighlights = [
  "1h30 d'atelier avec un animateur ou une animatrice diplômé.e",
  "Repars à la maison avec ta création",
  "7-12 ans pour les enfants seuls, 4-12 ans avec un adulte accompagnant",
];

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

export default function AtelierLandingClean({ atelier }: AtelierLandingProps) {
  const [priceMode, setPriceMode] = useState<"solo" | "duo">("duo");
  const [isFading, setIsFading] = useState(false);
  const fadeTimeoutRef = useRef<number | null>(null);

  const triggerFade = (mode: "solo" | "duo") => {
    if (mode === priceMode) {
      return;
    }
    setIsFading(true);
    setPriceMode(mode);
    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current);
    }
    fadeTimeoutRef.current = window.setTimeout(() => {
      setIsFading(false);
    }, 160);
  };

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const reviews = useMemo(() => {
    if (!atelier.reviews || atelier.reviews.length === 0) {
      return [];
    }
    const spans = [
      "lg:col-span-4",
      "lg:col-span-4",
      "lg:col-span-4",
      "lg:col-span-6",
      "lg:col-span-6",
    ];
    return atelier.reviews.map((review, index) => ({
      ...review,
      span: review.span ?? spans[index % spans.length],
    }));
  }, [atelier.reviews]);

  return (
    <main className="min-h-screen bg-[#1f3d2a] text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-10 pt-6 min-h-[calc(100vh-80px)]">
        <nav className="text-xs font-semibold uppercase tracking-wide text-white/70">
          <Link className="hover:text-white" href="/">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link className="hover:text-white" href="/#ateliers">
            Ateliers
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{atelier.title}</span>
        </nav>

        <div className="mt-5">
          <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">
            {atelier.headline ?? atelier.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
            {atelier.description}
          </p>
        </div>

        <div className="mt-8 grid flex-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
          <figure className="overflow-hidden rounded-[28px] bg-[#2d5a3d] shadow-lg">
            {atelier.mainImage ? (
              <img
                className="h-full max-h-[360px] w-full object-cover"
                src={atelier.mainImage}
                alt={atelier.title}
              />
            ) : null}
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
              {atelier.crestImage ? (
                <img className="h-16 w-16" src={atelier.crestImage} alt="Blason" />
              ) : null}
              <div>
                <h2 className="text-2xl font-extrabold">
                  {atelier.headline ?? atelier.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-700">{atelier.description}</p>
              </div>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-zinc-800">
              {sharedHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f3d8dc] text-[#6b1515]">
                    ✓
                  </span>
                  <span className="font-semibold text-zinc-900">{item}</span>
                </li>
              ))}
            </ul>

            {atelier.longDescription ? (
              <div className="mt-6 text-sm text-zinc-700">
                {renderRichText(atelier.longDescription)}
              </div>
            ) : null}
          </div>

          <aside className="sticky top-24 self-start">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
              <div className="flex gap-3 rounded-full bg-zinc-100 p-2 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => triggerFade("solo")}
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
                  onClick={() => triggerFade("duo")}
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
                  {priceMode === "solo"
                    ? atelier.priceSolo ?? "-"
                    : atelier.priceDuo ?? "-"}
                </p>
                <p className="text-sm text-zinc-600">
                  {priceMode === "solo"
                    ? "par enfant"
                    : "pour un duo Enfant + Adulte"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {reviews.length > 0 ? (
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
                  <p className="mt-2 text-sm font-semibold text-zinc-500">
                    {testimonial.name}
                  </p>
                  <p className="mt-3 text-sm text-zinc-800">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
