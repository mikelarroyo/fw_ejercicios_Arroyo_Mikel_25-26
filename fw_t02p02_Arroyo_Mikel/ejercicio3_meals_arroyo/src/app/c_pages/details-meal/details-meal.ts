import { Component, input, signal, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { IMyMeal } from '../../model/i-my-meal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-meal',
  templateUrl: './details-meal.html',
  styleUrl: './details-meal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsMeal implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private localStorage= inject(LocalStorageService);

  id = input.required<number>(); //id del padre que se lo pasamos con input
  meal= signal<IMyMeal | null>(null);
  isSaved = signal(false);

  ngOnInit(): void {
    const id= this.id();
    this.loadMeal(id);

  }

  private async loadMeal(id: number): Promise<void> {
    try {
      const meal = await this.api.getMealById(id);
      this.meal.set(meal);

      const session = this.auth.getCurrentUser();
      if(session) {
        this.isSaved.set(this.localStorage.isMealSaved(session.id, id));
      }

    } catch (error) {
      console.error('Error cargando recetas:', error);
    }
  }

  toggleSave(): void {
  const meal = this.meal();
  const session = this.auth.getCurrentUser()!;

  if (this.isSaved()) {
    this.localStorage.removeMeal(session.id, meal!.idMeal);
  } else {
    this.localStorage.saveMeal(session.id, meal!);
  }

  this.isSaved.set(!this.isSaved());
}






}
