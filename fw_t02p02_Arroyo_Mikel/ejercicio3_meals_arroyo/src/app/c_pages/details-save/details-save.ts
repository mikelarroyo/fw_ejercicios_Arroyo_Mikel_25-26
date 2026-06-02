import { Component, input, inject, OnInit, ChangeDetectionStrategy, signal, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage-service';
import { AuthService } from '../../services/auth-service';
import { Location } from '@angular/common';

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
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);

  id= input.required<number>();
  isCompleted = signal(false);
  isSaved = signal(false);

  form = new FormGroup({
    status: new FormControl('QUIERO_HACERLA'),
    rating: new FormControl(0),
    notes: new FormControl(''),
    saveDate: new FormControl('')
  });

  ngOnInit(): void {
    const id= this.id();
    const session= this.auth.getCurrentUser()!;
    const userMeals = this.localStorage.getUserMeals(session.id);
    const savedMeal = userMeals.find(m=> m.mealId === id);

    if(savedMeal){
      this.isSaved.set(true);
      this.form.patchValue({
        status: savedMeal.status,
        rating: savedMeal.rating || 0,
        notes: savedMeal.notes || '',
        saveDate: savedMeal.saveDate || ''
      });
      this.updateFieldsState(savedMeal.status);
    }

    this.form.get('status')?.valueChanges.subscribe((status) => {
      this.updateFieldsState(status);
    });
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

  onSubmit(): void{
    const id= this.id();
    const session = this.auth.getCurrentUser()!;
    const formValue= this.form.value;

    const userMeal = {
      userId: session.id,
      mealId: id,
      saveDate: formValue.saveDate || new Date().toISOString(),
      status: formValue.status,
      rating: formValue.rating,
      notes: formValue.notes
    };
    this.localStorage.saveMeal(session.id, userMeal);
    this.location.back();
  }

  cancel(): void {
    this.location.back();
  }
}
