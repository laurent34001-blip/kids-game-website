import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { defaultWorkshops } from "@/lib/workshops";
import AdminSessionCalendar from "@/app/admin/session/AdminSessionCalendar";

export const runtime = "nodejs";

const ensureDefaultWorkshops = async () => {
  const existing = await prisma.workshop.findMany({
    select: { slug: true },
  });
  const existingSlugs = new Set(existing.map((item) => item.slug).filter(Boolean));

  for (const workshop of defaultWorkshops) {
    if (existingSlugs.has(workshop.slug)) {
      continue;
    }
    await prisma.workshop.create({
      data: {
        title: workshop.title,
        description: workshop.description,
        slug: workshop.slug,
        headline: workshop.headline,
        mainImage: workshop.mainImage,
        crestImage: workshop.crestImage,
        heroImages: workshop.heroImages,
        priceSolo: workshop.priceSolo,
        priceDuo: workshop.priceDuo,
        longDescription: workshop.longDescription,
        reviews: workshop.reviews,
        category: "ARTISTES",
        basePrice: 29.9,
        durationMinutes: 90,
      },
    });
  }
};

const ensureDefaultRoom = async () => {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: "asc" },
  });
  if (rooms.length > 0) {
    return rooms;
  }

  const created = await prisma.room.create({
    data: {
      name: "Salle principale",
      maxUnits: 10.5,
      equipment: "Établis, kits créatifs, évier",
    },
  });
  return [created];
};

const withTime = (date: Date, hours: number, minutes: number) => {
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
};

const formatDateInput = (date: Date) =>
  date.toLocaleDateString("en-CA");

export default async function AdminSessionPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  await ensureDefaultWorkshops();
  const workshops = await prisma.workshop.findMany({
    orderBy: { createdAt: "asc" },
  });

  const rooms = await ensureDefaultRoom();
  const mainRoom = rooms[0];

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const slots = [
    { hour: 9, minute: 0 },
    { hour: 11, minute: 0 },
    { hour: 14, minute: 0 },
    { hour: 16, minute: 0 },
  ];

  const primaryWorkshops = workshops.slice(0, 4);

  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + dayOffset);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    for (const [index, workshop] of primaryWorkshops.entries()) {
      const existing = await prisma.session.findFirst({
        where: {
          workshopId: workshop.id,
          startAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      if (existing) {
        continue;
      }

      const slot = slots[index % slots.length];
      const startAt = withTime(day, slot.hour, slot.minute);
      const endAt = new Date(
        startAt.getTime() + workshop.durationMinutes * 60 * 1000,
      );

      await prisma.session.create({
        data: {
          workshopId: workshop.id,
          roomId: mainRoom.id,
          startAt,
          endAt,
          maxUnits: mainRoom.maxUnits,
          status: "OPEN",
          isPrivate: false,
        },
      });
    }
  }

  const sessions = await prisma.session.findMany({
    where: {
      startAt: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
    include: {
      workshop: true,
      room: true,
    },
    orderBy: { startAt: "asc" },
  });

  const formattedSessions = sessions.map((item) => ({
    id: item.id,
    startAt: item.startAt.toISOString(),
    endAt: item.endAt.toISOString(),
    maxUnits: item.maxUnits,
    status: item.status,
    isPrivate: item.isPrivate,
    workshopId: item.workshopId,
    workshopTitle: item.workshop.title,
    roomId: item.roomId,
    roomName: item.room.name,
    durationMinutes: item.workshop.durationMinutes,
    unitsUsed: item.unitsUsed,
    totalParticipants: item.totalParticipants,
  }));

  const formattedWorkshops = workshops.map((workshop) => ({
    id: workshop.id,
    title: workshop.title,
    durationMinutes: workshop.durationMinutes,
  }));

  const formattedRooms = rooms.map((room) => ({
    id: room.id,
    name: room.name,
    maxUnits: room.maxUnits,
  }));

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Gestion des sessions</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Créez, modifiez et déplacez les sessions d&apos;atelier sur le
            calendrier.
          </p>
        </div>
        <a
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600"
          href="/admin"
        >
          Retour au back-office
        </a>
      </div>

      <AdminSessionCalendar
        initialSessions={formattedSessions}
        workshops={formattedWorkshops}
        rooms={formattedRooms}
        initialStartDate={formatDateInput(startOfWeek)}
      />
    </main>
  );
}
