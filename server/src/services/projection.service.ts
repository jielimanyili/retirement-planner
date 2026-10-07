import {
  ProjectionInput,
  ProjectionResult,
  ServiceResult,
  YearRow,
} from '../types';

/** Sustainable withdrawal rate (the "4% rule"). */
const WITHDRAWAL_RATE = 0.04;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Projects retirement savings growth year-over-year using annual compounding:
 * balance = (balance + annualContribution) * (1 + rate).
 */
export function projectRetirement(
  input: ProjectionInput,
): ServiceResult<ProjectionResult> {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturnPct,
    desiredAnnualIncome,
  } = input ?? {};

  // --- validation ---------------------------------------------------------
  if (!Number.isInteger(currentAge) || !Number.isInteger(retirementAge)) {
    return { ok: false, error: 'currentAge and retirementAge must be integers.' };
  }
  if (currentAge < 0 || retirementAge <= currentAge) {
    return { ok: false, error: 'retirementAge must be greater than currentAge.' };
  }
  if (typeof currentSavings !== 'number' || currentSavings < 0) {
    return { ok: false, error: 'currentSavings must be a number >= 0.' };
  }
  if (typeof monthlyContribution !== 'number' || monthlyContribution < 0) {
    return { ok: false, error: 'monthlyContribution must be a number >= 0.' };
  }
  if (typeof annualReturnPct !== 'number' || annualReturnPct < 0 || annualReturnPct > 30) {
    return { ok: false, error: 'annualReturnPct must be between 0 and 30.' };
  }
  if (
    desiredAnnualIncome !== undefined &&
    desiredAnnualIncome !== null &&
    (typeof desiredAnnualIncome !== 'number' || desiredAnnualIncome < 0)
  ) {
    return { ok: false, error: 'desiredAnnualIncome must be a number >= 0 when provided.' };
  }

  // --- projection ---------------------------------------------------------
  const years = retirementAge - currentAge;
  const rate = annualReturnPct / 100;
  const annualContribution = monthlyContribution * 12;

  let balance = currentSavings;
  const yearRows: YearRow[] = [];
  for (let i = 0; i < years; i++) {
    balance = (balance + annualContribution) * (1 + rate);
    yearRows.push({
      year: i + 1,
      age: currentAge + i + 1,
      balance: round2(balance),
    });
  }

  const finalBalance = round2(balance);
  const totalContributions = round2(currentSavings + annualContribution * years);
  const totalGrowth = round2(finalBalance - totalContributions);
  const sustainableAnnualIncome = round2(finalBalance * WITHDRAWAL_RATE);

  const hasGoal = desiredAnnualIncome !== undefined && desiredAnnualIncome !== null;
  const shortfall = hasGoal
    ? round2(Math.max(0, desiredAnnualIncome! - sustainableAnnualIncome))
    : null;
  const onTrack = hasGoal ? sustainableAnnualIncome >= desiredAnnualIncome! : null;

  return {
    ok: true,
    value: {
      years: yearRows,
      finalBalance,
      totalContributions,
      totalGrowth,
      sustainableAnnualIncome,
      desiredAnnualIncome: hasGoal ? desiredAnnualIncome! : null,
      shortfall,
      onTrack,
    },
  };
}
