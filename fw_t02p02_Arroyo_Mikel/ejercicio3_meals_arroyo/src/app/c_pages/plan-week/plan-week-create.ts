import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { ApiService } from '../../services/api-service';
import { Util } from '../../model/util';
import { IMyMeal } from '../../model/i-my-meal';
import { IWeeklyPlan } from '../../model/i-weekly-plan';

@Component({
  selector: 'app-plan-week-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card mb-4 p-4">
      <h3 class="mb-4">Crear Plan Semanal - Semana {{ weekId() }}</h3>

      <!-- TABLA DE ASIGNACIÓN -->
      @if (plan(); as p) {
        <table class="table table-bordered mb-4">
          <thead>
            <tr>
              <th>Día</th>
              <th>Comida</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            @for (day of p.days; track day.day) {
              <tr>
                <td><strong>{{ day.day }}</strong></td>
                <td style="text-align: center;">
                  @if (day.lunchMealId) {
                    <span>{{ getMealName(day.lunchMealId) }}</span>
                    <button (click)="quitarReceta(day.day, 'lunch')" class="btn btn-sm btn-danger ms-2">Quitar</button>
                  } @else {
                    <span class="text-muted">-</span>
                  }
                </td>
                <td style="text-align: center;">
                  @if (day.dinnerMealId) {
                    <span>{{ getMealName(day.dinnerMealId) }}</span>
                    <button (click)="quitarReceta(day.day, 'dinner')" class="btn btn-sm btn-danger ms-2">Quitar</button>
                  } @else {
                    <span class="text-muted">-</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>

        <!-- BOTONES -->
        <div class="mb-4">
          <button (click)="guardarCambios()" class="btn btn-success me-2">Guardar Cambios</button>
          <button (click)="cancelar()" class="btn btn-secondary">Cancelar</button>
        </div>
      }

      <!-- BUSCADOR DE INGREDIENTES -->
      <h5>Buscador de Recetas por Ingrediente</h5>
      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Ej: chicken, beef, pasta..."
          [value]="busqueda()"
          (input)="busqueda.set($any($event.target).value); buscar()"
        />
      </div>

      @if (cargando()) {
        <div class="spinner-border text-primary"></div>
      }

      <!-- RESULTADOS -->
      @if (resultados().length > 0) {
        <div class="row">
          @for (meal of resultados(); track meal.idMeal) {
            <div class="col-md-3 mb-3">
              <div class="card" style="cursor: pointer;" (click)="abrirModal(meal)">
                <img [src]="meal.strMealThumb" class="card-img-top" style="height: 150px; object-fit: cover;" />
                <div class="card-body p-2">
                  <small>{{ meal.strMeal }}</small>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- MODAL -->
      @if (mealSeleccionado(); as meal) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5>{{ meal.strMeal }}</h5>
                <button type="button" class="btn-close" (click)="mealSeleccionado.set(null)"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label>Día:</label>
                  <select class="form-control" [(ngModel)]="diaSeleccionado">
                    @for (day of dias; track day) {
                      <option [value]="day">{{ day }}</option>
                    }
                  </select>
                </div>
                <div class="mb-3">
                  <label>Momento:</label>
                  <select class="form-control" [(ngModel)]="momentoSeleccionado">
                    <option value="lunch">Comida</option>
                    <option value="dinner">Cena</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="mealSeleccionado.set(null)">Cancelar</button>
                <button type="button" class="btn btn-primary" (click)="asignar(diaSeleccionado, momentoSeleccionado, meal)">Asignar</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .modal.d-block {
      display: block !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanWeekCreate implements OnInit {
  private auth = inject(AuthService);
  private localStorage = inject(LocalStorageService);
  private api = inject(ApiService);

  plan = signal<IWeeklyPlan | null>(null);
  weekId = signal<string>('');
  dias = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Buscador
  busqueda = signal<string>('');
  resultados = signal<IMyMeal[]>([]);
  cargando = signal<boolean>(false);
  mealSeleccionado = signal<IMyMeal | null>(null);
  diaSeleccionado = 'Monday';
  momentoSeleccionado: 'lunch' | 'dinner' = 'lunch';

  ngOnInit(): void {
    this.cargarPlan();
  }

  private cargarPlan(): void {
    const session = this.auth.getCurrentUser();
    if (!session) return;

    const week = `${new Date().getFullYear()}-W${Util.getISOWeek(new Date())}`;
    this.weekId.set(week);

    let plan = this.localStorage.getWeeklyPlan(session.id, week);
    if (!plan) {
      plan = {
        id: week,
        userId: session.id,
        days: this.dias.map(day => ({ day, lunchMealId: null, dinnerMealId: null }))
      };
    }
    this.plan.set(plan);
  }

  async buscar(): Promise<void> {
    const buscar = this.busqueda().trim();
    if (buscar.length === 0) {
      this.resultados.set([]);
      return;
    }

    this.cargando.set(true);
    try {
      const meals = await this.api.searchMealsByIngredient(buscar);
      this.resultados.set(meals);
    } catch {
      this.resultados.set([]);
    } finally {
      this.cargando.set(false);
    }
  }

  abrirModal(meal: IMyMeal): void {
    this.mealSeleccionado.set(meal);
  }

  asignar(dia: string, momento: 'lunch' | 'dinner', meal: IMyMeal): void {
    const p = this.plan();
    if (!p) return;

    const day = p.days.find(d => d.day === dia);
    if (!day) return;

    const mealId = Number(meal.idMeal);
    if (momento === 'lunch') {
      day.lunchMealId = mealId;
    } else {
      day.dinnerMealId = mealId;
    }

    this.plan.set({ ...p });
    this.mealSeleccionado.set(null);
    this.busqueda.set('');
    this.resultados.set([]);
  }

  quitarReceta(dia: string, momento: 'lunch' | 'dinner'): void {
    const p = this.plan();
    if (!p) return;

    const day = p.days.find(d => d.day === dia);
    if (!day) return;

    if (momento === 'lunch') {
      day.lunchMealId = null;
    } else {
      day.dinnerMealId = null;
    }

    this.plan.set({ ...p });
  }

  getMealName(mealId: number | null): string {
    if (!mealId) return '-';
    return `Receta #${mealId}`;
  }

  guardarCambios(): void {
    const p = this.plan();
    if (!p) return;

    const tieneAlMenosUna = p.days.some(d => d.lunchMealId || d.dinnerMealId);
    if (!tieneAlMenosUna) {
      alert('Debes asignar al menos una receta');
      return;
    }

    const session = this.auth.getCurrentUser();
    if (!session) return;

    this.localStorage.saveWeeklyPlan(session.id, p);
    alert('Plan guardado correctamente');
  }

  cancelar(): void {
    this.cargarPlan();
  }
}
