import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { IMyMeal } from '../../model/i-my-meal';
import { LocalStorageService } from '../../services/local-storage-service';
import { RouterLink } from "@angular/router";
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-meals-category',
  imports: [FormsModule, RouterLink, NgOptimizedImage],
  templateUrl: './meals-category.html',
  styleUrl: './meals-category.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealsCategory implements OnInit {
  meals = signal<IMyMeal[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('Todas las categorías');

  private api = inject(ApiService);
  private authService = inject(AuthService);
  public userId = this.authService.getCurrentUserId();
  private localStorage = inject(LocalStorageService);

  ngOnInit(): void {
    this.loadCategories();
    this.loadFavoriteCategory();
  }

  private async loadCategories(): Promise<void> {
    try {
      const cats = await this.api.getAllCategories();
      this.categories.set(cats);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  }

  private async load8RandomMeals(): Promise<void> {
    try {
      const meals = await this.api.get8RandomMeals();
      this.meals.set(meals);
    } catch (error) {
      console.error('Error cargando recetas:', error);
    }
  }

  public onCategoryChangeEvent(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.onCategoryChange(value);
  }

  public async onCategoryChange(category: string): Promise<void> {
    if (category === 'Todas las categorías') {
      this.selectedCategory.set('Todas las categorías');
      await this.load8RandomMeals();
    } else {
      try {
        const meals = await this.api.get8MealsByCategory(category);
        this.meals.set(meals);
        this.selectedCategory.set(category);
      } catch (error) {
        console.error('Error cargando recetas:', error);
      }
    }
  }

  private async loadFavoriteCategory(): Promise<void> {
    if (this.userId) {
      const categoria = this.localStorage.getFavoriteCategory(this.userId);
      if (categoria) {
        await this.onCategoryChange(categoria);
      } else {
        await this.load8RandomMeals();
      }
    } else {
      await this.load8RandomMeals();
    }
  }

  public onSaveFavoriteCategory(): void {
    if (this.userId) {
      const categoria = this.selectedCategory();
      this.localStorage.saveFavoriteCategory(this.userId, categoria);
      alert(`Categoría favorita guardada: ${categoria}`);
    }
  }
}
