"use client";

import { useEffect, useMemo, useState } from "react";

type WorkshopOption = {
  id: string;
  title: string;
  durationMinutes: number;
};

type RoomOption = {
  id: string;
  name: string;
  maxUnits: number;
};

type SessionItem = {
  id: string;
  startAt: string;
  endAt: string;
  maxUnits: number;
  status: "DRAFT" | "OPEN" | "PRIVATE" | "CANCELLED";
  isPrivate: boolean;
  workshopId: string;
  workshopTitle: string;
  workshopCategory: string;
  roomId: string;
  roomName: string;
  durationMinutes: number;
  unitsUsed: number;
  totalParticipants: number;
};

type AdminSessionCalendarProps = {
  initialSessions: SessionItem[];
  workshops: WorkshopOption[];
  rooms: RoomOption[];
  initialStartDate: string;
};

const getBgImage = (title: string) => {
  if (title.includes("porte-monnaie") || title.includes("Porte-monnaie")) {
    return "/images/cat_portefeuille.webp";
  }
  if (title.includes("céréales") || title.includes("Barres")) {
    return "/images/cat_cereal.webp";
  }
  if (title.includes("peinture") || title.includes("Peinture")) {
    return "/images/cat_peinture.webp";
  }
  if (title.includes("dominos") || title.includes("Dominos")) {
    return "/images/cat_domino.webp";
  }
  return "";
};

const timeSlots = ["09:00", "11:00", "14:00", "16:00"];

const formatDateInput = (date: Date) =>
  date.toLocaleDateString("en-CA");

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map((part) => Number(part));
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
};

const formatTimeLabel = (date: Date) =>
  date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDayLabel = (date: Date) =>
  date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

const parseDateTime = (date: string, time: string) =>
  new Date(`${date}T${time}:00`);

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const getSlotKey = (date: Date, time: string) => `${getDateKey(date)}-${time}`;

const toSessionItem = (data: {
  id: string;
  startAt: string;
  endAt: string;
  maxUnits: number;
  status: SessionItem["status"];
  isPrivate: boolean;
  workshopId: string;
  workshop: { title: string; durationMinutes: number; category?: string };
  roomId: string;
  room: { name: string };
  unitsUsed: number;
  totalParticipants: number;
}): SessionItem => ({
  id: data.id,
  startAt: data.startAt,
  endAt: data.endAt,
  maxUnits: data.maxUnits,
  status: data.status,
  isPrivate: data.isPrivate,
  workshopId: data.workshopId,
  workshopTitle: data.workshop.title,
  workshopCategory: data.workshop.category || 'UNKNOWN',
  roomId: data.roomId,
  roomName: data.room.name,
  durationMinutes: data.workshop.durationMinutes,
  unitsUsed: data.unitsUsed,
  totalParticipants: data.totalParticipants,
});

export default function AdminSessionCalendar({
  initialSessions,
  workshops,
  rooms,
  initialStartDate,
}: AdminSessionCalendarProps) {
  const defaultRoom =
    rooms.find((room) => room.name.toLowerCase().includes("salle principale")) ??
    rooms[0];
  const [isMounted, setIsMounted] = useState(false);
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions);
  const [startDate, setStartDate] = useState<Date>(
    parseLocalDate(initialStartDate),
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    initialSessions[0]?.id ?? null,
  );
  const [movingSessionId, setMovingSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slotTabs, setSlotTabs] = useState<Record<string, string>>({});

  const [newSession, setNewSession] = useState({
    workshopId: workshops[0]?.id ?? "",
    roomId: defaultRoom?.id ?? "",
    date: formatDateInput(parseLocalDate(initialStartDate)),
    time: timeSlots[0],
    maxUnits: 10.5,
  });

  const [batchState, setBatchState] = useState({
    from: formatDateInput(parseLocalDate(initialStartDate)),
    to: formatDateInput(addDays(parseLocalDate(initialStartDate), 6)),
    roomId: defaultRoom?.id ?? "",
    maxUnits: 10.5,
    timeSlots: [...timeSlots],
  });

  const [editSession, setEditSession] = useState({
    date: "",
    time: "",
    roomId: "",
    maxUnits: "",
    status: "OPEN" as SessionItem["status"],
    isPrivate: false,
  });
  const [deletedBatchCount, setDeletedBatchCount] = useState<number | null>(
    null,
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, idx) => addDays(startDate, idx)),
    [startDate],
  );

  const sessionsBySlot = useMemo(() => {
    const map = new Map<string, SessionItem[]>();
    sessions.forEach((session) => {
      const date = new Date(session.startAt);
      const time = formatTimeLabel(date);
      const key = getSlotKey(date, time);
      const list = map.get(key) ?? [];
      map.set(key, [...list, session]);
    });
    return map;
  }, [sessions]);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) ?? null,
    [sessions, selectedSessionId],
  );

  useEffect(() => {
    if (!selectedSession) {
      return;
    }
    setEditSession({
      date: formatDateInput(new Date(selectedSession.startAt)),
      time: formatTimeLabel(new Date(selectedSession.startAt)),
      roomId: selectedSession.roomId,
      maxUnits: `${selectedSession.maxUnits}`,
      status: selectedSession.status,
      isPrivate: selectedSession.isPrivate,
    });
  }, [selectedSession]);

  const loadSessions = async (rangeStart: Date, preferredId?: string | null) => {
    setIsLoading(true);
    setError(null);
    const rangeEnd = addDays(rangeStart, 6);
    const params = new URLSearchParams({
      from: formatDateInput(rangeStart),
      to: formatDateInput(rangeEnd),
    });

    try {
      const response = await fetch(`/api/sessions?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Impossible de charger les sessions.");
      }
      const payload = (await response.json()) as {
        data: Array<{
          id: string;
          startAt: string;
          endAt: string;
          maxUnits: number;
          status: SessionItem["status"];
          isPrivate: boolean;
          workshopId: string;
          workshop: { title: string; durationMinutes: number };
          roomId: string;
          room: { name: string };
          unitsUsed: number;
          totalParticipants: number;
        }>;
      };
      setSessions(payload.data.map(toSessionItem));
      setSelectedSessionId((current) => {
        if (preferredId) {
          return payload.data.some((session) => session.id === preferredId)
            ? preferredId
            : payload.data[0]?.id ?? null;
        }
        if (!current) {
          return payload.data[0]?.id ?? null;
        }
        return payload.data.some((session) => session.id === current)
          ? current
          : payload.data[0]?.id ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    void loadSessions(startDate);
  }, [startDate]);

  const handleCreateSession = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const workshop = workshops.find(
        (item) => item.id === newSession.workshopId,
      );
      if (!workshop) {
        throw new Error("Atelier introuvable.");
      }

      const startAt = parseDateTime(newSession.date, newSession.time);
      const endAt = new Date(
        startAt.getTime() + workshop.durationMinutes * 60 * 1000,
      );

      const room = rooms.find((item) => item.id === newSession.roomId);
      const parsedMaxUnits = Number(newSession.maxUnits);
      const maxUnits = Number.isFinite(parsedMaxUnits)
        ? parsedMaxUnits
        : room?.maxUnits ?? 10.5;

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId: newSession.workshopId,
          roomId: newSession.roomId,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          maxUnits,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Création impossible.");
      }

      const payload = (await response.json()) as {
        data: {
          id: string;
          startAt: string;
          endAt: string;
          maxUnits: number;
          status: SessionItem["status"];
          isPrivate: boolean;
          workshopId: string;
          workshop: { title: string; durationMinutes: number };
          roomId: string;
          room: { name: string };
          unitsUsed: number;
          totalParticipants: number;
        };
      };

      await loadSessions(startDate, payload.data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBatchSlot = (slot: string) => {
    setBatchState((prev) => {
      const exists = prev.timeSlots.includes(slot);
      const nextSlots = exists
        ? prev.timeSlots.filter((item) => item !== slot)
        : [...prev.timeSlots, slot];
      return { ...prev, timeSlots: nextSlots };
    });
  };

  const handleCreateBatch = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (batchState.timeSlots.length === 0) {
        throw new Error("Sélectionnez au moins un créneau horaire.");
      }

      const fromDate = parseLocalDate(batchState.from);
      const toDate = parseLocalDate(batchState.to);
      const days = [];
      for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }

      const createdIds = [];
      for (const day of days) {
        for (const workshop of workshops) {
          for (const timeSlot of batchState.timeSlots) {
            const [hourStr, minuteStr] = timeSlot.split(':');
            const hour = Number(hourStr);
            const minute = Number(minuteStr);
            const startAt = new Date(day);
            startAt.setHours(hour, minute, 0, 0);
            const endAt = new Date(startAt.getTime() + workshop.durationMinutes * 60 * 1000);

            // check if already exists in current sessions
            const existing = sessions.find(s => s.workshopId === workshop.id && new Date(s.startAt).getTime() === startAt.getTime());
            if (existing) continue;

            try {
              const response = await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  workshopId: workshop.id,
                  roomId: batchState.roomId,
                  startAt: startAt.toISOString(),
                  endAt: endAt.toISOString(),
                  maxUnits: Number(batchState.maxUnits),
                }),
              });

              if (response.ok) {
                const payload = await response.json();
                createdIds.push(payload.data.id);
              }
            } catch (err) {
              // ignore errors for individual creations
            }
          }
        }
      }

      if (createdIds.length > 0) {
        setStartDate(parseLocalDate(batchState.from));
      } else {
        throw new Error("Aucune session créée.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBatch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (batchState.timeSlots.length === 0) {
        throw new Error("Sélectionnez au moins un créneau horaire.");
      }

      const response = await fetch("/api/sessions/batch-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: batchState.from,
          to: batchState.to,
          roomId: batchState.roomId,
          timeSlots: batchState.timeSlots,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Suppression du lot impossible.");
      }

      const payload = (await response.json()) as { deleted: number };
      setDeletedBatchCount(payload.deleted ?? 0);
      await loadSessions(startDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = async (
    sessionId: string,
    payload: Record<string, unknown>,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Mise à jour impossible.");
      }

      const body = (await response.json()) as {
        data: {
          id: string;
          startAt: string;
          endAt: string;
          maxUnits: number;
          status: SessionItem["status"];
          isPrivate: boolean;
          workshopId: string;
          workshop: { title: string; durationMinutes: number };
          roomId: string;
          room: { name: string };
          unitsUsed: number;
          totalParticipants: number;
        };
      };

      const updated = toSessionItem(body.data);
      setSessions((prev) =>
        prev.map((session) => (session.id === updated.id ? updated : session)),
      );
      setSelectedSessionId(updated.id);
      return updated.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const confirmed = window.confirm(
      "Supprimer définitivement cette session ?",
    );
    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Suppression impossible.");
      }

      await loadSessions(startDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotClick = async (date: Date, time: string) => {
    if (!movingSessionId) {
      return;
    }
    const session = sessions.find((item) => item.id === movingSessionId);
    if (!session) {
      setMovingSessionId(null);
      return;
    }

    const slotKey = getSlotKey(date, time);
    const occupied = sessionsBySlot.get(slotKey) ?? [];
    if (occupied.some((item) => item.id !== session.id)) {
      setError("Ce créneau est déjà occupé.");
      return;
    }

    const startAt = parseDateTime(formatDateInput(date), time);
    const endAt = new Date(
      startAt.getTime() + session.durationMinutes * 60 * 1000,
    );

    const updatedId = await updateSession(session.id, {
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    });
    if (updatedId) {
      await loadSessions(startDate, updatedId);
    }
    setMovingSessionId(null);
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSession) {
      return;
    }

    const startAt = parseDateTime(editSession.date, editSession.time);
    const endAt = new Date(
      startAt.getTime() + selectedSession.durationMinutes * 60 * 1000,
    );
    const status = editSession.status;
    const isPrivate = status === "PRIVATE" || editSession.isPrivate;

    const parsedMaxUnits = Number(editSession.maxUnits);
    const payload: Record<string, unknown> = {
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      roomId: editSession.roomId,
      status,
      isPrivate,
    };

    if (Number.isFinite(parsedMaxUnits)) {
      payload.maxUnits = parsedMaxUnits;
    }

    const updatedId = await updateSession(selectedSession.id, payload);
    if (updatedId) {
      await loadSessions(startDate, updatedId);
    }
  };

  if (!isMounted) {
    return (
      <section className="mt-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
          Chargement du calendrier...
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Planning hebdomadaire</h2>
            <p className="text-xs text-zinc-500">
              Cliquez sur un atelier pour l&apos;éditer ou activez le mode
              déplacement.
            </p>
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStartDate((prev) => addDays(prev, -7))}
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600"
            >
              Semaine -1
            </button>
            <button
              type="button"
              onClick={() => setStartDate((prev) => addDays(prev, 7))}
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600"
            >
              Semaine +1
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
            {error}
          </div>
        ) : null}

        {deletedBatchCount !== null ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-zinc-900">
                Suppression effectuée
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                {deletedBatchCount} session(s) supprimée(s).
              </p>
              <button
                type="button"
                onClick={() => setDeletedBatchCount(null)}
                className="mt-6 w-full rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white">
          <div className="min-w-[1260px]">
            <div className="grid grid-cols-[120px_repeat(7,minmax(220px,1fr))] divide-x divide-zinc-200 border-b border-zinc-300 bg-zinc-50 text-xs font-semibold text-zinc-600">
            <div className="px-4 py-3">Horaire</div>
            {days.map((date) => (
              <div key={date.toISOString()} className="px-3 py-3">
                {formatDayLabel(date)}
              </div>
            ))}
          </div>

          {timeSlots.map((slot) => (
            <div
              key={slot}
              className="grid grid-cols-[120px_repeat(7,minmax(220px,1fr))] divide-x divide-zinc-200 border-b border-zinc-200"
            >
              <div className="flex items-center px-4 py-4 text-xs font-semibold text-zinc-600">
                {slot}
              </div>
              {days.map((date) => {
                const slotKey = getSlotKey(date, slot);
                const slotSessions = sessionsBySlot.get(slotKey) ?? [];
                const activeTabId = slotTabs[slotKey] ?? slotSessions[0]?.id;
                const session = slotSessions.find(
                  (item) => item.id === activeTabId,
                );
                return (
                  <div
                    key={slotKey}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSlotClick(date, slot)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSlotClick(date, slot);
                      }
                    }}
                    className={`group flex w-full min-h-[110px] flex-col items-start justify-between gap-2 px-3 py-3 text-left text-xs transition ${
                      movingSessionId
                        ? "bg-amber-50"
                        : "hover:bg-zinc-50"
                    }`}
                    style={{ minHeight: 110, height: 'auto', minWidth: 220, width: '100%', maxWidth: 400, overflow: 'visible' }}
                  >
                    {session ? (
                      <div
                        className={`w-full rounded-2xl border text-xs text-white ${
                          session.id === selectedSessionId
                            ? "border-zinc-900"
                            : "border-zinc-200"
                        }`}
                        style={{
                          backgroundImage: `linear-gradient(${session.id === selectedSessionId ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)'}, ${session.id === selectedSessionId ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)'}), url(${getBgImage(session.workshopTitle)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedSessionId(session.id);
                        }}
                      >
                        {slotSessions.length > 1 ? (
                          <div className="flex flex-row gap-1 overflow-x-hidden">
                            {slotSessions.map((slotSession) => {
                              const isActive = slotSession.id === session.id;
                              // Affiche les 6 premiers caractères puis ... si besoin
                              const tabLabel = slotSession.workshopTitle.length > 6
                                ? slotSession.workshopTitle.slice(0, 6) + '...'
                                : slotSession.workshopTitle;
                              return (
                                <button
                                  key={slotSession.id}
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSlotTabs((prev) => ({
                                      ...prev,
                                      [slotKey]: slotSession.id,
                                    }));
                                    setSelectedSessionId(slotSession.id);
                                  }}
                                  className={`relative flex items-center px-3 py-1 text-[11px] font-medium border-b-2 transition-all rounded-t-md shadow-sm ${
                                    isActive
                                      ? "bg-white border-zinc-900 text-zinc-900 z-10"
                                      : "bg-zinc-100 border-transparent text-zinc-500 hover:bg-zinc-200 z-0"
                                  }`}
                                  style={{ minWidth: 48, maxWidth: 90 }}
                                >
                                  <span className="truncate max-w-[60px]">{tabLabel}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                        <div className="px-3 py-2">
                          <div className="font-semibold">
                            {session.workshopTitle}
                          </div>
                          <div className="mt-1 text-[11px] text-white">
                            {session.roomName} · {session.maxUnits} unités
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                              {session.status}
                            </span>
                            <span className={`text-[10px] ${session.totalParticipants >= 10 ? 'text-green-400' : session.totalParticipants >= 6 ? 'text-blue-400' : 'text-white'}`}>
                              {session.totalParticipants} pers.
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setMovingSessionId(session.id);
                              }}
                              className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600"
                            >
                              Déplacer
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : movingSessionId ? (
                      <div className="text-[10px] text-zinc-400">
                        Cliquer pour déplacer
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
          </div>
        </div>

        {isLoading ? (
          <p className="text-xs text-zinc-500">Chargement en cours...</p>
        ) : null}
      </div>

      <aside className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleCreateSession}
          className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold">Créer une session</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Sélectionnez l&apos;atelier, la salle et le créneau.
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <label className="text-xs font-semibold text-zinc-600">
                Atelier
              </label>
              <select
                value={newSession.workshopId}
                onChange={(event) =>
                  setNewSession((prev) => ({
                    ...prev,
                    workshopId: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                required
              >
                {workshops.map((workshop) => (
                  <option key={workshop.id} value={workshop.id}>
                    {workshop.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600">
                Salle
              </label>
              <select
                value={newSession.roomId}
                onChange={(event) =>
                  setNewSession((prev) => {
                    const room = rooms.find(
                      (item) => item.id === event.target.value,
                    );
                    return {
                      ...prev,
                      roomId: event.target.value,
                      maxUnits: room?.maxUnits ?? prev.maxUnits,
                    };
                  })
                }
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                required
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} · {room.maxUnits} unités
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Date
                </label>
                <input
                  type="date"
                  value={newSession.date}
                  onChange={(event) =>
                    setNewSession((prev) => ({
                      ...prev,
                      date: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Heure
                </label>
                <select
                  value={newSession.time}
                  onChange={(event) =>
                    setNewSession((prev) => ({
                      ...prev,
                      time: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                  required
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600">
                Jauge (unités)
              </label>
              <input
                type="number"
                min={1}
                step={0.5}
                value={newSession.maxUnits}
                onChange={(event) =>
                  setNewSession((prev) => ({
                    ...prev,
                    maxUnits: Number(event.target.value),
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Création en cours..." : "Créer la session"}
          </button>
        </form>

        <form
          onSubmit={handleCreateBatch}
          className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold">Créer un lot de sessions</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Génère automatiquement 1 session par atelier et par créneau.
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Du
                </label>
                <input
                  type="date"
                  value={batchState.from}
                  onChange={(event) =>
                    setBatchState((prev) => ({
                      ...prev,
                      from: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Au
                </label>
                <input
                  type="date"
                  value={batchState.to}
                  onChange={(event) =>
                    setBatchState((prev) => ({
                      ...prev,
                      to: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600">
                Salle
              </label>
              <select
                value={batchState.roomId}
                onChange={(event) =>
                  setBatchState((prev) => {
                    const room = rooms.find(
                      (item) => item.id === event.target.value,
                    );
                    return {
                      ...prev,
                      roomId: event.target.value,
                      maxUnits: room?.maxUnits ?? prev.maxUnits,
                    };
                  })
                }
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                required
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} · {room.maxUnits} unités
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600">
                Créneaux utilisés
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleBatchSlot(slot)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      batchState.timeSlots.includes(slot)
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 text-zinc-600"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600">
                Jauge (unités)
              </label>
              <input
                type="number"
                min={1}
                step={0.5}
                value={batchState.maxUnits}
                onChange={(event) =>
                  setBatchState((prev) => ({
                    ...prev,
                    maxUnits: Number(event.target.value),
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || batchState.timeSlots.length === 0}
            className="mt-5 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Création en cours..." : "Créer le lot"}
          </button>

          <button
            type="button"
            onClick={handleDeleteBatch}
            disabled={isLoading || batchState.timeSlots.length === 0}
            className="mt-2 w-full rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 disabled:opacity-60"
          >
            Supprimer le lot
          </button>
        </form>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Éditer une session</h3>
            {selectedSession ? (
              <span className="text-xs text-zinc-500">
                {selectedSession.workshopTitle}
              </span>
            ) : null}
          </div>
          {selectedSession ? (
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => handleDeleteSession(selectedSession.id)}
                className="w-full rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700"
              >
                Supprimer cette session
              </button>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-600">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editSession.date}
                    onChange={(event) =>
                      setEditSession((prev) => ({
                        ...prev,
                        date: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-600">
                    Heure
                  </label>
                  <select
                    value={editSession.time}
                    onChange={(event) =>
                      setEditSession((prev) => ({
                        ...prev,
                        time: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                    required
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Salle
                </label>
                <select
                  value={editSession.roomId}
                  onChange={(event) =>
                    setEditSession((prev) => ({
                      ...prev,
                      roomId: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} · {room.maxUnits} unités
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Jauge (unités)
                </label>
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  value={editSession.maxUnits}
                  onChange={(event) =>
                    setEditSession((prev) => ({
                      ...prev,
                      maxUnits: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-600">
                  Statut
                </label>
                <select
                  value={editSession.status}
                  onChange={(event) =>
                    setEditSession((prev) => ({
                      ...prev,
                      status: event.target.value as SessionItem["status"],
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                >
                  <option value="OPEN">Ouverte</option>
                  <option value="PRIVATE">Privatisée</option>
                  <option value="CANCELLED">Annulée</option>
                  <option value="DRAFT">Brouillon</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                <input
                  type="checkbox"
                  checked={editSession.isPrivate}
                  onChange={(event) =>
                    setEditSession((prev) => ({
                      ...prev,
                      isPrivate: event.target.checked,
                    }))
                  }
                />
                Forcer la privatisation
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isLoading ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </form>
          ) : (
            <p className="mt-3 text-xs text-zinc-500">
              Sélectionnez une session dans le calendrier.
            </p>
          )}
        </div>
      </aside>
    </section>
  );
}
