import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const sanitizeFilename = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((value) => value instanceof File) as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uploadedPaths: string[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = sanitizeFilename(file.name || "image");
    const ext = path.extname(originalName) || ".png";
    const base = path.basename(originalName, ext) || "image";
    const filename = `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);
    uploadedPaths.push(`/uploads/${filename}`);
  }

  return NextResponse.json({ data: uploadedPaths });
}
