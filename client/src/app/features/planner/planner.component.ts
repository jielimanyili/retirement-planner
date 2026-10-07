import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectionService } from '../../services/projection.service';
import { ProjectionInput, ProjectionResult } from '../../models/projection.model';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
})
export class PlannerComponent {
  private readonly service = inject(ProjectionService);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    currentAge: [30, [Validators.required, Validators.min(18), Validators.max(80)]],
    retirementAge: [65, [Validators.required, Validators.min(18), Validators.max(100)]],
    currentSavings: [50000, [Validators.required, Validators.min(0)]],
    monthlyContribution: [500, [Validators.required, Validators.min(0)]],
    annualReturnPct: [7, [Validators.required, Validators.min(0), Validators.max(20)]],
    desiredAnnualIncome: [40000, [Validators.min(0)]],
  });

  readonly result = signal<ProjectionResult | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  readonly chartPoints = computed(() => {
    const r = this.result();
    if (!r || r.years.length === 0) return '';
    const w = 640;
    const h = 240;
    const pad = 12;
    const values = r.years.map((y) => y.balance);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 1);
    const range = max - min || 1;
    const stepX = r.years.length > 1 ? (w - pad * 2) / (r.years.length - 1) : 0;
    return r.years
      .map((y, i) => {
        const x = pad + i * stepX;
        const yy = h - pad - ((y.balance - min) / range) * (h - pad * 2);
        return `${x.toFixed(1)},${yy.toFixed(1)}`;
      })
      .join(' ');
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    if (Number(v.retirementAge) <= Number(v.currentAge)) {
      this.error.set('Retirement age must be greater than current age.');
      return;
    }
    const payload: ProjectionInput = {
      currentAge: Number(v.currentAge),
      retirementAge: Number(v.retirementAge),
      currentSavings: Number(v.currentSavings),
      monthlyContribution: Number(v.monthlyContribution),
      annualReturnPct: Number(v.annualReturnPct),
    };
    if (
      v.desiredAnnualIncome !== null &&
      v.desiredAnnualIncome !== undefined &&
      v.desiredAnnualIncome !== ''
    ) {
      payload.desiredAnnualIncome = Number(v.desiredAnnualIncome);
    }

    this.loading.set(true);
    this.error.set(null);
    this.service.project(payload).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Something went wrong. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
