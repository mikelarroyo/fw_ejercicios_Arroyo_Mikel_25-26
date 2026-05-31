import { Component,inject } from '@angular/core';
import { MealsCategory } from '../meals-category/meals-category';
import { MealsSave } from '../meals-save/meals-save';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [MealsCategory, MealsSave],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected auth = inject(AuthService);
}

