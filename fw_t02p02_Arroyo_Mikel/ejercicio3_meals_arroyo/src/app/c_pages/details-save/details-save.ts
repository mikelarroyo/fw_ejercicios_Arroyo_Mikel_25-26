import { Component, input, inject, OnInit, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage-service';
import { AuthService } from '../../services/auth-service';
import { ApiService } from '../../services/api-service';
import { Location } from '@angular/common';
import { IMyMeal } from '../../model/i-my-meal';

@Component({
  selector: 'app-details-save',
  imports: [ReactiveFormsModule],
  templateUrl: './details-save.html',
  styleUrl: './details-save.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsSave implements OnInit{

  private localStorage= inject(LocalStorageService);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private location = inject(Location);

  id= input.required<number>();
  meal = signal<IMyMeal | null>(null);

  form = new FormGroup({
    status: new FormControl('QUIERO_HACERLA'),
    rating: new FormControl(0),
    notes: new FormControl(''),
    saveDate: new FormControl('')
  });

  constructor() {
    effect(() => {
      this.id();
      this.loadMeal();
    });
  }

  ngOnInit(): void {
    this.loadMeal();
    this.form.get('status')?.valueChanges.subscribe((status) => {
      this.updateFieldsState(status);
    });
  }

  private async loadMeal(): Promise<void> {
    try {
      const id = this.id();
      const session = this.auth.getCurrentUser()!;
      const mealData = await this.api.getMealById(id);
      this.meal.set(mealData);

      const userMeals = this.localStorage.getUserMeals(session.userId);
      const savedMeal = userMeals.find(m => m.mealId === id);

      if (savedMeal) {
        this.form.patchValue({
          status: savedMeal.status,
          rating: savedMeal.rating || 0,
          notes: savedMeal.notes || '',
          saveDate: savedMeal.saveDate || ''
        });
        this.updateFieldsState(savedMeal.status);
      }
    } catch (error) {
      console.error('Error cargando receta:', error);
    }
  }

  private updateFieldsState(status: string | null): void {
    const isCompleted = status === 'LA_HE_HECHO';
    const rating = this.form.get('rating');

    if (isCompleted) {
      rating?.setValidators([Validators.required]);
      rating?.enable();
    } else {
      rating?.clearValidators();
      rating?.disable();
    }
    rating?.updateValueAndValidity();
  }

  onSubmit(): void {
    const id = this.id();
    const session = this.auth.getCurrentUser()!;
    const formValue = this.form.value;
    const mealData = this.meal();

    if (!mealData) {
      console.error('Receta no cargada');
      return;
    }

    const userMeal = {
      userId: session.userId,
      mealId: id,
      saveDate: formValue.saveDate || new Date().toISOString(),
      status: formValue.status,
      rating: formValue.rating,
      notes: formValue.notes,
      strMeal: mealData.strMeal,
      strCategory: mealData.strCategory,
      strArea: mealData.strArea,
      strMealThumb: mealData.strMealThumb,
      ingredients: mealData.ingredients
    };
    this.localStorage.saveMeal(session.userId, userMeal);
    this.location.back();
  }

  cancel(): void {
    this.location.back();
  }
}
