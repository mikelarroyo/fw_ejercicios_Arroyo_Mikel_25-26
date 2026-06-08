import { AuthService } from './../../services/auth-service';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanWeekCreate } from '../plan-week-create/plan-week-create';
import { PlanWeekList } from '../plan-week-list/plan-week-list';
import { LocalStorageService } from '../../services/local-storage-service';
import { ApiService } from '../../services/api-service';
import { IWeeklyPlan } from '../../model/i-weekly-plan';


@Component({
  selector: 'app-plan-week',
  standalone: true,
  imports: [CommonModule, PlanWeekCreate, PlanWeekList],
  templateUrl: './plan-week.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanWeek {
  private auth = inject(AuthService);
  private localStorage = inject(LocalStorageService);
  private api = inject(ApiService);


  
  //Estado
  plan = signal<IWeeklyPlan | null>(null);
}
