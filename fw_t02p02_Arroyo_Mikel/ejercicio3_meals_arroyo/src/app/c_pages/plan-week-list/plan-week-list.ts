import { Component, inject, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage-service';
import { IWeeklyPlan } from '../../model/i-weekly-plan';
import { Util } from '../../model/util';

@Component({
  selector: 'app-plan-week-list',
  imports: [],
  templateUrl: './plan-week-list.html',
  styleUrl: './plan-week-list.css',
})
export class PlanWeekList implements OnInit {
  @Input() userId!: number;
  private localStorage = inject(LocalStorageService);

  planesSemanales: IWeeklyPlan[] = [];
  semanaActual: string = '';

  ngOnInit(): void {
  this.semanaActual = Util.getISOWeek(new Date());
  this.planesSemanales = this.localStorage
  .obtenerPlanesSemanalUsuario(this.userId)
  .sort((a, b) => b.id.localeCompare(a.id));
}
  esSemanaActual(planId: string): boolean{
    return planId === this.semanaActual;
  }
  eliminarPlan(planId: string) {
  if (!confirm('¿Seguro que quieres eliminar este plan?')) return;
  this.localStorage.eliminarPlanSemanal(this.userId, planId);
  this.planesSemanales = this.localStorage
    .obtenerPlanesSemanalUsuario(this.userId)
    .sort((a, b) => b.id.localeCompare(a.id));
}

}
