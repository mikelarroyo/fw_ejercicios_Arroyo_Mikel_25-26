import { Component, input, signal, OnInit, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { DetailsSave } from '../details-save/details-save';
import { IMyMeal } from '../../model/i-my-meal';

@Component({
  selector: 'app-details-meal',
  imports: [CommonModule, DetailsSave],
  templateUrl: './details-meal.html',
  styleUrl: './details-meal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsMeal implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private localStorage = inject(LocalStorageService);

  id = input.required<number>();
  meal = signal<IMyMeal | null>(null);
  isSaved = signal(false);

  constructor() {
    effect(() => {
      this.cargarReceta(this.id());
    });
  }

  ngOnInit(): void {}

  private async cargarReceta(id: number): Promise<void> {
    try {
      const meal = await this.api.getMealById(id);
      this.meal.set(meal);

      const session = this.auth.getCurrentUser();
      if (!session) return;

      const userMeals = this.localStorage.getUserMeals(session.id);
      const guardada = userMeals.some(m => m.mealId === id);
      this.isSaved.set(guardada);

    } catch (error) {
      console.error('Error cargando receta:', error);
    }
  }

  toggleSave(): void {
    const meal = this.meal();
    const session = this.auth.getCurrentUser();

    if (!meal || !session) return;

    if (this.isSaved()) {
      this.localStorage.removeMiniMeal(session.id, meal.idMeal);
      this.isSaved.set(false);
    } else {
      const userMiniMeal = {
        mealId: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb
      };
      this.localStorage.saveMiniMeal(session.id, userMiniMeal);
      this.isSaved.set(true);
    }
  }
}
