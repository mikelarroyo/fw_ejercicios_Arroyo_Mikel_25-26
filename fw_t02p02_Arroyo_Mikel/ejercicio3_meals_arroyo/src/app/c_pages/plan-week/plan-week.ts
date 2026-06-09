import { Component,inject,} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { PlanWeekCreate } from '../plan-week-create/plan-week-create';
import { PlanWeekList } from '../plan-week-list/plan-week-list';

@Component({
  selector: 'app-plan-week',
  imports: [PlanWeekCreate,PlanWeekList],
  templateUrl: './plan-week.html',
  styleUrl: './plan-week.css',
})
export class PlanWeek {
  private authservice = inject(AuthService);
  public userId= this.authservice.getCurrentUserId();

}
