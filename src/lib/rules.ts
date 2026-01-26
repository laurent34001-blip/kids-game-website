export type PricingRule = {
  id: string;
  name: string;
  priority: number;
  active: boolean;
  minUnits: number | null;
  minChildren: number | null;
  minDuos: number | null;
  requireChildAndDuo: boolean;
  workshopId: string | null;
  formulaId: string;
};

export type PricingFormula = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isPackage: boolean;
  priority: number;
};

export const DEFAULT_WEIGHTS = {
  child: 1,
  duo: 1.25,
};

export type SessionCounts = {
  children: number;
  duos: number;
  maxUnits: number;
};

export function calculateUnits(
  children: number,
  duos: number,
  weights = DEFAULT_WEIGHTS,
): number {
  return Number((children * weights.child + duos * weights.duo).toFixed(2));
}

export function isCapacityExceeded({
  children,
  duos,
  maxUnits,
}: SessionCounts): boolean {
  return calculateUnits(children, duos) > maxUnits;
}

export function chooseFormula(
  rules: PricingRule[],
  formulas: PricingFormula[],
  data: {
    children: number;
    duos: number;
    units: number;
    workshopId?: string | null;
  },
): PricingFormula | null {
  const activeRules = rules
    .filter((rule) => rule.active)
    .sort((a, b) => a.priority - b.priority);

  for (const rule of activeRules) {
    if (rule.workshopId && rule.workshopId !== data.workshopId) {
      continue;
    }

    if (rule.minUnits !== null && rule.minUnits !== undefined) {
      if (data.units < rule.minUnits) {
        continue;
      }
    }

    if (rule.minChildren !== null && rule.minChildren !== undefined) {
      if (data.children < rule.minChildren) {
        continue;
      }
    }

    if (rule.minDuos !== null && rule.minDuos !== undefined) {
      if (data.duos < rule.minDuos) {
        continue;
      }
    }

    if (rule.requireChildAndDuo) {
      if (!(data.children > 0 && data.duos > 0)) {
        continue;
      }
    }

    const formula = formulas.find((item) => item.id === rule.formulaId);
    if (formula) {
      return formula;
    }
  }

  return null;
}
