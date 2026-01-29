import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminAtelierEditor from "@/app/admin/atelier/AdminAtelierEditor";

export const runtime = "nodejs";

export default async function AdminAtelierDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const prismaAny = prisma as typeof prisma & {
    workshop: any;
  };
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  if (!params.id) {
    redirect("/admin/atelier");
  }

  const atelier = await prismaAny.workshop.findUnique({
    where: { id: params.id },
  });

  if (!atelier) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Atelier introuvable</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Cet atelier n&apos;existe pas ou a été supprimé.
        </p>
        <a className="mt-6 inline-flex text-sm text-zinc-600" href="/admin/atelier">
          Retour
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Éditer un atelier</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Modifiez les contenus visibles sur la page publique.
          </p>
        </div>
        <a
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600"
          href="/admin/atelier"
        >
          Retour aux ateliers
        </a>
      </div>

      <AdminAtelierEditor
        atelier={{
          id: atelier.id,
          slug: atelier.slug ?? null,
          title: atelier.title,
          headline: atelier.headline ?? null,
          description: atelier.description,
          mainImage: atelier.mainImage ?? null,
          crestImage: atelier.crestImage ?? null,
          heroImages: Array.isArray(atelier.heroImages)
            ? (atelier.heroImages as string[])
            : [],
          priceSolo: atelier.priceSolo ?? null,
          priceDuo: atelier.priceDuo ?? null,
          highlights: Array.isArray(atelier.highlights)
            ? (atelier.highlights as string[])
            : [],
          longDescription: atelier.longDescription ?? null,
          reviews: Array.isArray(atelier.reviews)
            ? (atelier.reviews as { name: string; text: string }[])
            : [],
        }}
      />
    </main>
  );
}
