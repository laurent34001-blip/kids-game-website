-- Recreate Reservation to support new customer fields
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Reservation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sessionId" TEXT NOT NULL,
  "customerFirstName" TEXT NOT NULL,
  "customerLastName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "totalPrice" REAL NOT NULL DEFAULT 0,
  "pricingFormulaId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("pricingFormulaId") REFERENCES "PricingFormula" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_Reservation" (
  "id",
  "sessionId",
  "customerFirstName",
  "customerLastName",
  "customerEmail",
  "customerPhone",
  "status",
  "totalPrice",
  "pricingFormulaId",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "sessionId",
  COALESCE("customerName", ''),
  '',
  "customerEmail",
  COALESCE("customerPhone", ''),
  "status",
  "totalPrice",
  "pricingFormulaId",
  "createdAt",
  "updatedAt"
FROM "Reservation";

DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";

CREATE TABLE "new_Participant" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "reservationId" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('CHILD','ADULT')),
  "firstName" TEXT NOT NULL,
  "lastName" TEXT,
  "birthDate" DATETIME,
  "phone" TEXT,
  "ageRange" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Participant" (
  "id",
  "reservationId",
  "type",
  "firstName",
  "lastName",
  "birthDate",
  "phone",
  "ageRange",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "reservationId",
  CASE WHEN "type" = 'DUO' THEN 'ADULT' ELSE "type" END,
  "name",
  NULL,
  NULL,
  NULL,
  CASE WHEN "age" IS NOT NULL THEN CAST("age" AS TEXT) ELSE NULL END,
  "createdAt",
  "updatedAt"
FROM "Participant";

DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";

PRAGMA foreign_keys=ON;
