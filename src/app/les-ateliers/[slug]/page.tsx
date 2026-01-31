import AtelierSlugWrapper from "@/components/atelier/AtelierSlugWrapper";

export const dynamic = "force-dynamic";

export default async function AtelierSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  return <AtelierSlugWrapper slug={params.slug} />;
}
