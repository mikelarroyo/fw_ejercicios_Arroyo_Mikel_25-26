import { Component, inject, signal, Input, OnChanges, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage-service';
import { IUserMiniMeal } from '../../model/i-user-mini-meal';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-meals-save',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './meals-save.html',
  styleUrl: './meals-save.css',
})
export class MealsSave implements OnInit, OnChanges {
  @Input() userId: number | null = null;
  private localStorage = inject(LocalStorageService);

  meals = signal<IUserMiniMeal[]>([]);

  ngOnInit(): void {
    this.cargarRecetas();
  }

  ngOnChanges(): void {
    if (this.userId) this.cargarRecetas();
  }

  private cargarRecetas(): void {
    if (!this.userId) return;
    const userMiniMeals = this.localStorage.getUserMiniMeals(this.userId);
    this.meals.set(userMiniMeals.slice(-4).reverse());
  }
}
