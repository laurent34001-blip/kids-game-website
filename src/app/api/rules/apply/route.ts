import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateUnits, chooseFormula } from "@/lib/rules";

export async function POST(request: Request) {
  const body = await request.json();
  const children = Number(body.children ?? 0);
  const adults = Number(body.adults ?? body.duos ?? 0);
  const workshopId = body.workshopId ?? null;

  const rules = await prisma.pricingRule.findMany({
    include: { formula: true },
  });
  const formulas = await prisma.pricingFormula.findMany();
  const units = calculateUnits(children, adults);
  const formula = chooseFormula(rules, formulas, {
    children,
    adults,
    units,
    workshopId,
  });

  return NextResponse.json({
    data: {
      units,
      formula,
    },
  });
}
