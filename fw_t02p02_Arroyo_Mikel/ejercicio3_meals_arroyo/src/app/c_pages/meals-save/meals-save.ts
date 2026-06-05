import { Component, inject, signal, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { IUserMiniMeal } from '../../model/i-user-mini-meal';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meals-save',
  imports: [RouterLink],
  templateUrl: './meals-save.html',
  styleUrl: './meals-save.css',
})
export class MealsSave {
  private auth = inject(AuthService);
  private localStorage= inject(LocalStorageService);

  meals = signal<IUserMiniMeal[]>([]);

  ngOnInit(): void {
    const session = this.auth.getCurrentUser();
    if (session) {
      const userMiniMeals = this.localStorage.getUserMiniMeals(session.id);
      const lastFour = userMiniMeals.slice(-4).reverse();
      this.meals.set(lastFour);
    }
  }


}
