import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanWeekCreate } from './plan-week-create/plan-week-create';
import { PlanWeekList } from './plan-week-list/plan-week-list';

@Component({
  selector: 'app-plan-week',
  standalone: true,
  imports: [CommonModule, PlanWeekCreate, PlanWeekList],
  template: `
    <div class="container mt-5">
      <app-plan-week-create></app-plan-week-create>
      <hr class="my-5">
      <app-plan-week-list></app-plan-week-list>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanWeek {}
