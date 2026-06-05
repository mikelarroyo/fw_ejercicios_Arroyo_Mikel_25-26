import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { Util } from '../../model/util';
import { IWeeklyPlan } from '../../model/i-weekly-plan';

@Component({
  selector: 'app-plan-week-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card p-4">
      <h3 class="mb-4">Mis Planes Semanales</h3>

      @if (planes().length > 0) {
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Lunes (Comida)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (plan of planes(); track plan.id) {
                <tr [class.table-warning]="esActual(plan.id)">
                  <td>
                    <strong>{{ plan.id }}</strong>
                    @if (esActual(plan.id)) {
                      <span class="badge bg-warning text-dark ms-2">Actual</span>
                    }
                  </td>
                  <td>
                    @if (plan.days[0]?.lunchMealId) {
                      <span>Receta #{{ plan.days[0].lunchMealId }}</span>
                    } @else {
                      <span class="text-muted">Sin receta</span>
                    }
                  </td>
                  <td>
                    <button (click)="borrar(plan.id)" class="btn btn-sm btn-danger">Borrar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="alert alert-info">
          No tienes planes semanales. ¡Crea uno arriba!
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanWeekList implements OnInit {
  private auth = inject(AuthService);
  private localStorage = inject(LocalStorageService);

  planes = signal<IWeeklyPlan[]>([]);
  semanaActual = signal<string>('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    const session = this.auth.getCurrentUser();
    if (!session) return;

    const semana = `${new Date().getFullYear()}-W${Util.getISOWeek(new Date())}`;
    this.semanaActual.set(semana);

    const todosLosPlanes = this.localStorage.getAllWeeklyPlans(session.id);
    const ordenados = todosLosPlanes.sort((a, b) => b.id.localeCompare(a.id));
    this.planes.set(ordenados);
  }

  esActual(planId: string): boolean {
    return planId === this.semanaActual();
  }

  borrar(planId: string): void {
    if (!confirm(`¿Borrar plan ${planId}?`)) return;

    const session = this.auth.getCurrentUser();
    if (!session) return;

    this.localStorage.deleteWeeklyPlan(session.id, planId);
    this.cargar();
  }
}
