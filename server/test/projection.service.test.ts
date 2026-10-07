import { describe, it, expect } from 'vitest';
import { projectRetirement } from '../src/services/projection.service';

describe('projectRetirement', () => {
  it('computes a correct projection with zero return', () => {
    const result = projectRetirement({
      currentAge: 30,
      retirementAge: 35,
      currentSavings: 0,
      monthlyContribution: 1000,
      annualReturnPct: 0,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.finalBalance).toBe(60000); // 1000 * 12 * 5
    expect(result.value.years).toHaveLength(5);
    expect(result.value.totalContributions).toBe(60000);
    expect(result.value.totalGrowth).toBe(0);
  });

  it('compounds growth correctly', () => {
    const result = projectRetirement({
      currentAge: 30,
      retirementAge: 31,
      currentSavings: 100000,
      monthlyContribution: 0,
      annualReturnPct: 10,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.finalBalance).toBe(110000);
    expect(result.value.totalGrowth).toBe(10000);
  });

  it('rejects invalid input', () => {
    const invalidRetirement = projectRetirement({
      currentAge: 40,
      retirementAge: 40,
      currentSavings: 0,
      monthlyContribution: 0,
      annualReturnPct: 7,
    });
    expect(invalidRetirement.ok).toBe(false);

    const negativeSavings = projectRetirement({
      currentAge: 30,
      retirementAge: 60,
      currentSavings: -1,
      monthlyContribution: 0,
      annualReturnPct: 7,
    });
    expect(negativeSavings.ok).toBe(false);
  });

  it('computes 4% sustainable income and shortfall against a goal', () => {
    const result = projectRetirement({
      currentAge: 30,
      retirementAge: 60,
      currentSavings: 500000,
      monthlyContribution: 0,
      annualReturnPct: 0,
      desiredAnnualIncome: 25000,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.sustainableAnnualIncome).toBe(20000); // 4% of 500k
    expect(result.value.shortfall).toBe(5000);
    expect(result.value.onTrack).toBe(false);
  });
});
