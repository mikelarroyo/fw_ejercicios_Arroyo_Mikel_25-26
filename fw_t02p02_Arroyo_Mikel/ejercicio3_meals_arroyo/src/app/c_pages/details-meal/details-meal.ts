import { Component, input, signal, OnInit, ChangeDetectionStrategy, inject, effect, output } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { IMyMeal } from '../../model/i-my-meal';

@Component({
  selector: 'app-details-meal',
  templateUrl: './details-meal.html',
  styleUrl: './details-meal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsMeal implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private localStorage= inject(LocalStorageService);

  id = input.required<number>();
  meal= signal<IMyMeal | null>(null);
  isSaved = signal(false);
  isSavedChange = output<boolean>();

  constructor() {
    effect(() => {
      this.loadMeal(this.id());
    });
  }

  ngOnInit(): void {}

  private async loadMeal(id: number): Promise<void> {
    try {
      const meal = await this.api.getMealById(id);
      this.meal.set(meal);

      const session = this.auth.getCurrentUser();
      if(session) {
        const userMiniMeals = this.localStorage.getUserMiniMeals(session.id);
        const isSaved = userMiniMeals.some(m => Number(m.mealId) === id);
        this.isSaved.set(isSaved);
        this.isSavedChange.emit(isSaved);
      }

    } catch (error) {
      console.error('Error cargando recetas:', error);
    }
  }

  toggleSave(): void {
    const meal = this.meal();
    const session = this.auth.getCurrentUser()!;

    console.log('toggleSave llamado. isSaved:', this.isSaved());

    if (this.isSaved()) {
      this.localStorage.removeMiniMeal(session.id, meal!.idMeal);
      this.isSaved.set(false);
      this.isSavedChange.emit(false);
    } else {
      const userMiniMeal = {
        mealId: meal!.idMeal,
        strMeal: meal!.strMeal,
        strMealThumb: meal!.strMealThumb
      };
      this.localStorage.saveMiniMeal(session.id, userMiniMeal);
      this.isSaved.set(true);
      this.isSavedChange.emit(true);
    }
  }






}
