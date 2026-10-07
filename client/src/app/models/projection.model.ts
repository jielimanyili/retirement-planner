export interface ProjectionInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnPct: number;
  desiredAnnualIncome?: number;
}

export interface YearRow {
  year: number;
  age: number;
  balance: number;
}

export interface ProjectionResult {
  years: YearRow[];
  finalBalance: number;
  totalContributions: number;
  totalGrowth: number;
  sustainableAnnualIncome: number;
  desiredAnnualIncome: number | null;
  shortfall: number | null;
  onTrack: boolean | null;
}
