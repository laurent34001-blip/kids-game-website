-- Prevent duplicate sessions for same workshop, room and start time
CREATE UNIQUE INDEX IF NOT EXISTS "Session_workshopId_roomId_startAt_key" ON "Session"("workshopId", "roomId", "startAt");
