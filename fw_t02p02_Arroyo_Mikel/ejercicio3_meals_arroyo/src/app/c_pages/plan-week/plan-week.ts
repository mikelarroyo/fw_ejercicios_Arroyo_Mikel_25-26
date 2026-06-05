import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanWeekCreate } from './plan-week-create';
import { PlanWeekList } from './plan-week-list';

@Component({
  selector: 'app-plan-week',
  standalone: true,
  imports: [CommonModule, PlanWeekCreate, PlanWeekList],
  templateUrl: './plan-week.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanWeek {}
