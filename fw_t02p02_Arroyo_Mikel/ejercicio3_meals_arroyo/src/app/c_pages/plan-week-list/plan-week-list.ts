import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-plan-week-list',
  standalone: true,
  templateUrl: './plan-week-list.html',
  styleUrl: './plan-week-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanWeekList {}
