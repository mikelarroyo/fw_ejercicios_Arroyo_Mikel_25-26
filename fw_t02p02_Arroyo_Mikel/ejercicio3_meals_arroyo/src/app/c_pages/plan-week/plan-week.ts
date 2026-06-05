import { Component, inject, OnInit, ChangeDetectionStrategy, signal, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { ApiService } from '../../services/api-service';
import { Util } from '../../model/util';
import { IWeeklyPlan } from '../../model/i-weekly-plan';
import { IMyMeal } from '../../model/i-my-meal';

@Component({
  selector: 'app-plan-week',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './plan-week.html',
  styleUrl: './plan-week.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanWeek implements OnInit {
  private auth = inject(AuthService);
  private localStorage = inject(LocalStorageService);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  plan = signal<IWeeklyPlan | null>(null);
  currentWeek = signal<string>('');
  mealNames = signal<Map<number, string>>(new Map());
  allPlans = signal<IWeeklyPlan[]>([]);
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Sección 1: Búsqueda y creación
  ingredientSearch = signal<string>('');
  filteredMeals = signal<IMyMeal[]>([]);
  loadingMeals = signal<boolean>(false);
  mealToAssign = signal<IMyMeal | null>(null);
  selectedDay = 'Monday';
  selectedMomento: 'lunch' | 'dinner' = 'lunch';
  mealCache = signal<Map<number, IMyMeal>>(new Map());

  ngOnInit(): void {
    const session = this.auth.getCurrentUser();
    if (session) {
      const weekId = `${new Date().getFullYear()}-W${Util.getISOWeek(new Date())}`;
      this.currentWeek.set(weekId);

      let plan = this.localStorage.getWeeklyPlan(session.id, weekId);
      if (!plan) {
        plan = {
          id: weekId,
          userId: session.id,
          days: this.days.map(day => ({ day, lunchMealId: null, dinnerMealId: null }))
        };
      }
      this.plan.set(plan);
      this.loadMealNames(plan);
      this.loadAllPlans(session.id).catch(err => console.error('Error cargando planes:', err));
    }

    // Efecto para búsqueda de ingredientes
    effect(() => {
      const search = this.ingredientSearch();
      if (search.trim().length > 0) {
        this.searchByIngredient(search);
      } else {
        this.filteredMeals.set([]);
      }
    });
  }

  private async loadMealNames(plan: IWeeklyPlan): Promise<void> {
    const mealIds = new Set<number>();
    plan.days.forEach(day => {
      if (day.lunchMealId) mealIds.add(day.lunchMealId);
      if (day.dinnerMealId) mealIds.add(day.dinnerMealId);
    });

    for (const mealId of mealIds) {
      await this.getMealName(mealId);
    }
  }

  private async loadAllPlans(userId: number): Promise<void> {
    const plans = this.localStorage.getAllWeeklyPlans(userId);
    const sorted = plans.sort((a, b) => b.id.localeCompare(a.id));
    this.allPlans.set(sorted);

    // Pre-cargar imágenes de todas las recetas
    for (const plan of sorted) {
      for (const day of plan.days) {
        if (day.lunchMealId) await this.getMealForDisplay(day.lunchMealId);
        if (day.dinnerMealId) await this.getMealForDisplay(day.dinnerMealId);
      }
    }
    this.cdr.markForCheck();
  }

  private async searchByIngredient(ingredient: string): Promise<void> {
    this.loadingMeals.set(true);
    try {
      const meals = await this.api.searchMealsByIngredient(ingredient);
      this.filteredMeals.set(meals || []);
    } catch {
      this.filteredMeals.set([]);
    } finally {
      this.loadingMeals.set(false);
    }
  }

  asignarReceta(day: string, momento: 'lunch' | 'dinner', mealId: number): void {
    const session = this.auth.getCurrentUser();
    if (session && this.plan()) {
      const plan = this.plan()!;
      const planDay = plan.days.find(d => d.day === day);
      if (planDay) {
        if (momento === 'lunch') {
          planDay.lunchMealId = mealId;
        } else {
          planDay.dinnerMealId = mealId;
        }
        this.localStorage.saveWeeklyPlan(session.id, plan);
        this.plan.set({ ...plan });
        this.getMealName(mealId);
      }
    }
  }

  quitarReceta(day: string, momento: 'lunch' | 'dinner'): void {
    const session = this.auth.getCurrentUser();
    if (session && this.plan()) {
      const plan = this.plan()!;
      const planDay = plan.days.find(d => d.day === day);
      if (planDay) {
        if (momento === 'lunch') {
          planDay.lunchMealId = null;
        } else {
          planDay.dinnerMealId = null;
        }
        this.localStorage.saveWeeklyPlan(session.id, plan);
        this.plan.set({ ...plan });
      }
    }
  }

  async getMealName(mealId: number | null | undefined): Promise<string> {
    if (!mealId) return 'Sin asignar';

    const cached = this.mealNames().get(mealId);
    if (cached) return cached;

    try {
      const meal = await this.api.getMealById(mealId);
      this.mealNames.set(new Map(this.mealNames()).set(mealId, meal.strMeal));
      return meal.strMeal;
    } catch {
      return `Receta #${mealId}`;
    }
  }

  getMealNameSync(mealId: number | null | undefined): string {
    if (!mealId) return 'Sin asignar';
    return this.mealNames().get(mealId) || `Cargando...`;
  }

  asignarPorBuscador(day: string, momento: 'lunch' | 'dinner', meal: IMyMeal): void {
    const mealId = meal.idMeal ? Number(meal.idMeal) : 0;
    if (mealId > 0) {
      this.asignarReceta(day, momento, mealId);
      this.ingredientSearch.set('');
      this.filteredMeals.set([]);
    }
  }

  hasAtLeastOneRecipe(): boolean {
    const plan = this.plan();
    if (!plan) return false;
    return plan.days.some(day => day.lunchMealId || day.dinnerMealId);
  }

  guardarCambios(): void {
    if (!this.hasAtLeastOneRecipe()) {
      alert('Debes asignar al menos una receta en algún día.');
      return;
    }
    const session = this.auth.getCurrentUser();
    if (session && this.plan()) {
      this.localStorage.saveWeeklyPlan(session.id, this.plan()!);
      alert('Plan guardado correctamente.');
    }
  }

  cancelar(): void {
    const session = this.auth.getCurrentUser();
    if (session) {
      const weekId = this.currentWeek();
      let plan = this.localStorage.getWeeklyPlan(session.id, weekId);
      if (!plan) {
        plan = {
          id: weekId,
          userId: session.id,
          days: this.days.map(day => ({ day, lunchMealId: null, dinnerMealId: null }))
        };
      }
      this.plan.set(plan);
      this.loadMealNames(plan);
    }
  }

  deletePlan(planId: string): void {
    if (confirm(`¿Estás seguro de que quieres borrar el plan ${planId}?`)) {
      const session = this.auth.getCurrentUser();
      if (session) {
        this.localStorage.deleteWeeklyPlan(session.id, planId);
        this.loadAllPlans(session.id);
      }
    }
  }

  isCurrentWeek(planId: string): boolean {
    return planId === this.currentWeek();
  }

  async getMealForDisplay(mealId: number | null | undefined): Promise<IMyMeal | null> {
    if (!mealId) return null;

    const cached = this.mealCache().get(mealId);
    if (cached) return cached;

    try {
      const meal = await this.api.getMealById(mealId);
      this.mealCache.set(new Map(this.mealCache()).set(mealId, meal));
      return meal;
    } catch {
      return null;
    }
  }

  getMealForDisplaySync(mealId: number | null | undefined): IMyMeal | null {
    if (!mealId) return null;
    return this.mealCache().get(mealId) || null;
  }
}
