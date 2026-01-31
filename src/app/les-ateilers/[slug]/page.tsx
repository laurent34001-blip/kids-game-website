import { redirect } from "next/navigation";

type LesAteilersSlugPageProps = {
  params: { slug: string };
};

export default function LesAteilersSlugPage({
  params,
}: LesAteilersSlugPageProps) {
  redirect(`/les-ateliers/${params.slug}`);
}
