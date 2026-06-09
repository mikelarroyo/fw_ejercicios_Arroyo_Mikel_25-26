import { Component, inject, Input, OnChanges } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage-service';
import { IWeeklyPlan } from '../../model/i-weekly-plan';
import { Util } from '../../model/util';

@Component({
  selector: 'app-plan-week-list',
  imports: [],
  templateUrl: './plan-week-list.html',
  styleUrl: './plan-week-list.css',
})
export class PlanWeekList implements OnChanges {
  @Input() userId!: number;
  @Input() recargar: number = 0;
  private localStorage = inject(LocalStorageService);

  planesSemanales: IWeeklyPlan[] = [];
  semanaActual: string = Util.getISOWeek(new Date());

  ngOnChanges(): void {
    if (this.userId) this.cargarPlanes();
  }

  private cargarPlanes(): void {
    this.planesSemanales = this.localStorage
      .obtenerPlanesSemanalUsuario(this.userId)
      .sort((a, b) => b.id.localeCompare(a.id));
  }

  esSemanaActual(planId: string): boolean {
    return planId === this.semanaActual;
  }

  eliminarPlan(planId: string) {
    if (!confirm('¿Seguro que quieres eliminar este plan?')) return;
    this.localStorage.eliminarPlanSemanal(this.userId, planId);
    this.cargarPlanes();
  }
}
