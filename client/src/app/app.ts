import { Component } from '@angular/core';
import { PlannerComponent } from './features/planner/planner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
