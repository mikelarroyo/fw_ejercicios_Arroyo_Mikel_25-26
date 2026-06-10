import { Injectable } from '@angular/core';
import { IUser } from '../model/i-user';
import { AuthSession } from '../model/auth-session';
import { IWeeklyPlan } from '../model/i-weekly-plan';
import { IUserRecipe } from '../model/i-user-recipe';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly KEY_USERS = 'users';
  private readonly KEY_SESSION = 'session';
  private readonly KEY_USER_MEALS = 'userMeals_';
  private readonly KEY_MINI_MEALS = 'userMiniMeals_';
  private readonly KEY_WEEKLY_PLANS = 'weeklyPlans';
  private readonly KEY_MIS_RECETAS = 'misRecetas';

  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T[] : [];
  }

  private setToStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- Usuarios ---

  public guardarUsuario(usuario: IUser): void {
    const usuarios = this.obtenerTodosUsuarios();
    usuarios.push(usuario);
    this.setToStorage(this.KEY_USERS, usuarios);
  }

  public obtenerTodosUsuarios(): IUser[] {
    return this.getFromStorage<IUser>(this.KEY_USERS);
  }

  public buscarUsuarioPorEmail(email: string): IUser | null {
    return this.obtenerTodosUsuarios().find(u => u.email === email) ?? null;
  }

  public actualizarUsuario(usuario: IUser): void {
    const usuarios = this.obtenerTodosUsuarios();
    const idx = usuarios.findIndex(u => u.email === usuario.email);
    if (idx !== -1) {
      usuarios[idx] = usuario;
      this.setToStorage(this.KEY_USERS, usuarios);
    }
  }

  public buscarUsuarioPorId(id: number): IUser | null {
    return this.obtenerTodosUsuarios().find(u => u.id === id) ?? null;
  }

  public obtenerProximoIdUser(): number {
    const usuarios = this.obtenerTodosUsuarios();
    if (usuarios.length === 0) return 1;
    return Math.max(...usuarios.map(u => u.id)) + 1;
  }

  // --- metodos de la Sesión ---

  public setUsuarioActual(session: AuthSession): void {
    this.setToStorage(this.KEY_SESSION, session);
  }

  public getUserIdFromSession(): number | null {
    return this.getUsuarioActual()?.userId ?? null;
  }

  public getUsuarioActual(): AuthSession | null {
    const jsonData = localStorage.getItem(this.KEY_SESSION);
    if (!jsonData) return null;
    const session = JSON.parse(jsonData) as AuthSession;
    if (!session.userId) {
      const usuarios = this.obtenerTodosUsuarios();
      const broken = usuarios.find(u => u.name === session.name);
      if (!broken?.id) {
        const newId = usuarios.length > 0
          ? Math.max(...usuarios.map(u => Number(u.id) || 0)) + 1
          : 1;
        if (broken) { broken.id = newId; this.setToStorage(this.KEY_USERS, usuarios); }
        session.userId = newId;
      } else {
        session.userId = broken.id;
      }
      this.setToStorage(this.KEY_SESSION, session);
    }
    return session;
  }

  public removeUsuarioActual(): void {
    localStorage.removeItem(this.KEY_SESSION);
  }

  public saveFavoriteCategory(userId: number, category: string): void {
    const usuarios = this.obtenerTodosUsuarios();
    const usuario = usuarios.find(u => u.id === userId);
    if (usuario) {
      usuario.favoriteCategory = category;
      this.setToStorage(this.KEY_USERS, usuarios);
    }
  }

  public getFavoriteCategory(userId: number): string | null {
    return this.buscarUsuarioPorId(userId)?.favoriteCategory ?? null;
  }

  // --- Comidas del usuario grandes---

  public getUserMeals(userId: number): any[] {
    return this.getFromStorage(`${this.KEY_USER_MEALS}${userId}`);
  }

  public saveMeal(userId: number, meal: any): void {
    const key = `${this.KEY_USER_MEALS}${userId}`;
    const meals = this.getUserMeals(userId);
    const index = meals.findIndex(m => m.mealId === meal.mealId);
    if (index !== -1) {
      meals[index] = meal;
    } else {
      meals.push(meal);
    }
    this.setToStorage(key, meals);
  }

  public removeMeal(userId: number, mealId: number): void {
    const key = `${this.KEY_USER_MEALS}${userId}`;
    const filtered = this.getUserMeals(userId).filter(m => m.mealId !== mealId);
    this.setToStorage(key, filtered);
  }

  // --- Mini comidas details guardadas---

  public getUserMiniMeals(userId: number): any[] {
    return this.getFromStorage(`${this.KEY_MINI_MEALS}${userId}`);
  }

  public saveMiniMeal(userId: number, miniMeal: any): void {
    const key = `${this.KEY_MINI_MEALS}${userId}`;
    const miniMeals = this.getUserMiniMeals(userId);
    const index = miniMeals.findIndex(m => m.mealId === miniMeal.mealId);
    if (index !== -1) {
      miniMeals[index] = miniMeal;
    } else {
      miniMeals.push(miniMeal);
    }
    this.setToStorage(key, miniMeals);
  }

  public removeMiniMeal(userId: number, mealId: number): void {
    const key = `${this.KEY_MINI_MEALS}${userId}`;
    const filtered = this.getUserMiniMeals(userId).filter(m => m.mealId !== mealId);
    this.setToStorage(key, filtered);
  }

  // --- Planes semanales ---

  public obtenerPlanesSemanalUsuario(userId: number): IWeeklyPlan[] {
    return this.getFromStorage<IWeeklyPlan>(this.KEY_WEEKLY_PLANS).filter(p => p.userId === userId);
  }

  public guardarPlanSemanal(plan: IWeeklyPlan): void {
    const planes = this.getFromStorage<IWeeklyPlan>(this.KEY_WEEKLY_PLANS);
    planes.push(plan);
    this.setToStorage(this.KEY_WEEKLY_PLANS, planes);
  }

  public eliminarPlanSemanal(userId: number, planId: string): void {
    const planes = this.getFromStorage<IWeeklyPlan>(this.KEY_WEEKLY_PLANS)
      .filter(p => !(p.userId === userId && p.id === planId));
    this.setToStorage(this.KEY_WEEKLY_PLANS, planes);
  }

  // --- Mis recetas ---

  public obtenerProximoIdMisRecetas(userId: number): number {
    const recetas = this.obtenerMiReceta(userId);
    if (recetas.length === 0) return 1;
    return Math.max(...recetas.map(r => r.id)) + 1;
  }

  public obtenerMiReceta(userId: number): IUserRecipe[] {
    return this.getFromStorage<IUserRecipe>(this.KEY_MIS_RECETAS).filter(p => p.userId === userId);
  }

  public eliminarMiReceta(userId: number, recetaId: number): void {
    const recetas = this.getFromStorage<IUserRecipe>(this.KEY_MIS_RECETAS)
      .filter(p => !(p.userId === userId && p.id === recetaId));
    this.setToStorage(this.KEY_MIS_RECETAS, recetas);
  }

  public guardarMiReceta(receta: IUserRecipe): void {
    const recetas = this.getFromStorage<IUserRecipe>(this.KEY_MIS_RECETAS);
    recetas.push(receta);
    this.setToStorage(this.KEY_MIS_RECETAS, recetas);
  }
}
