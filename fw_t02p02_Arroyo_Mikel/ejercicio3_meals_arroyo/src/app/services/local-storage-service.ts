import { Injectable } from '@angular/core';
import { IUser } from '../model/i-user';
import { AuthSession } from '../model/auth-session';
import { IWeeklyPlan } from '../model/i-weekly-plan';
import { IUserMiniMeal } from '../model/i-user-mini-meal';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly KEY_USERS = 'users';
  private readonly KEY_SESSION = 'session';
  private readonly KEY_USER_MEALS = 'userMeals_';
  private readonly KEY_MINI_MEALS = 'userMiniMeals_';
  private readonly KEY_WEEKLY_PLANS = 'weeklyPlans';

  // --- Usuarios ---

  public guardarUsuario(usuario: IUser): void {
    try {
      const usuarios = this.obtenerTodosUsuarios();
      usuarios.push(usuario);
      localStorage.setItem(this.KEY_USERS, JSON.stringify(usuarios));
    } catch (error) {
      console.error('Error guardando usuario en localStorage:', error);
    }
  }

  public obtenerTodosUsuarios(): IUser[] {
    try {
      const jsonData = localStorage.getItem(this.KEY_USERS);
      return jsonData ? JSON.parse(jsonData) : [];
    } catch (error) {
      console.error('Error obteniendo los usuarios de LocalStorage:', error);
      return [];
    }
  }

  public buscarUsuarioPorEmail(email: string): IUser | null {
    try {
      const usuarios = this.obtenerTodosUsuarios();
      return usuarios.find(u => u.email === email) ?? null;
    } catch (error) {
      console.error('Error al obtener email del usuario:', error);
      return null;
    }
  }

  public actualizarUsuario(usuario: IUser): void {
    try {
      const usuarios = this.obtenerTodosUsuarios();
      const idx = usuarios.findIndex(u => u.email === usuario.email);
      if (idx !== -1) {
        usuarios[idx] = usuario;
        localStorage.setItem(this.KEY_USERS, JSON.stringify(usuarios));
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  }

  public buscarUsuarioPorId(id: number): IUser | null {
    try {
      const usuarios = this.obtenerTodosUsuarios();
      return usuarios.find(u => u.id === id) ?? null;
    } catch (error) {
      console.error('Error al buscar Usuario por id:', id);
      return null;
    }
  }

  public obtenerProximoIdUser(): number {
    try {
      const usuarios = this.obtenerTodosUsuarios();
      if (usuarios.length === 0) return 1;
      return Math.max(...usuarios.map(u => u.id)) + 1;
    } catch (error) {
      console.error('Error obteniendo próximo id:', error);
      return 1;
    }
  }

  // --- Sesión ---

  public setUsuarioActual(session: AuthSession): void {
    try {
      localStorage.setItem(this.KEY_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Error al guardar sesion', error);
    }
  }

  public getUserIdFromSession(): number | null {
    return this.getUsuarioActual()?.userId ?? null;
  }

  public getUsuarioActual(): AuthSession | null {
    try {
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
          if (broken) { broken.id = newId; localStorage.setItem(this.KEY_USERS, JSON.stringify(usuarios)); }
          session.userId = newId;
        } else {
          session.userId = broken.id;
        }
        localStorage.setItem(this.KEY_SESSION, JSON.stringify(session));
      }
      return session;
    } catch (error) {
      console.error('No ha sido posible obtener el Usuario actual', error);
      return null;
    }
  }

  public removeUsuarioActual(): void {
    try {
      localStorage.removeItem(this.KEY_SESSION);
    } catch (error) {
      console.error('Error eliminando sesión:', error);
    }
  }

  public saveFavoriteCategory(userId: number, category: string): void {
    try {
      const usuarios = this.obtenerTodosUsuarios();
      const usuario = usuarios.find(u => u.id === userId);
      if (usuario) {
        usuario.favoriteCategory = category;
        localStorage.setItem(this.KEY_USERS, JSON.stringify(usuarios));
      }
    } catch (error) {
      console.error('Error guardando la categoría favorita', error);
    }
  }

  public getFavoriteCategory(userId: number): string | null {
    try {
      return this.buscarUsuarioPorId(userId)?.favoriteCategory ?? null;
    } catch (error) {
      console.error('Error al obtener la categoría favorita', error);
      return null;
    }
  }

  // --- Comidas del usuario ---

  public getUserMeals(userId: number): any[] {
    try {
      const key = `${this.KEY_USER_MEALS}${userId}`;
      const jsonData = localStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : [];
    } catch (error) {
      console.error('Error al obtener comidas guardadas');
      return [];
    }
  }

  public isMealSaved(userId: number, mealId: number): boolean {
    return this.getUserMeals(userId).some(m => m.mealId === mealId);
  }

  public saveMeal(userId: number, meal: any): void {
    try {
      const key = `${this.KEY_USER_MEALS}${userId}`;
      const meals = this.getUserMeals(userId);
      const index = meals.findIndex(m => m.mealId === meal.mealId);
      if (index !== -1) {
        meals[index] = meal;
      } else {
        meals.push(meal);
      }
      localStorage.setItem(key, JSON.stringify(meals));
    } catch (error) {
      console.error('Error guardando comida:', error);
    }
  }

  public removeMeal(userId: number, mealId: number): void {
    try {
      const key = `${this.KEY_USER_MEALS}${userId}`;
      const filtered = this.getUserMeals(userId).filter(m => m.mealId !== mealId);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error eliminando comida:', error);
    }
  }

  // --- Mini comidas (caché de imágenes y nombres) ---

  public getUserMiniMeals(userId: number): any[] {
    try {
      const key = `${this.KEY_MINI_MEALS}${userId}`;
      const jsonData = localStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : [];
    } catch (error) {
      console.error('Error obteniendo miniMeals guardadas');
      return [];
    }
  }

  public saveMiniMeal(userId: number, miniMeal: any): void {
    try {
      const key = `${this.KEY_MINI_MEALS}${userId}`;
      const miniMeals = this.getUserMiniMeals(userId);
      const index = miniMeals.findIndex(m => m.mealId === miniMeal.mealId);
      if (index !== -1) {
        miniMeals[index] = miniMeal;
      } else {
        miniMeals.push(miniMeal);
      }
      localStorage.setItem(key, JSON.stringify(miniMeals));
    } catch (error) {
      console.error('Error guardando miniMeal:', error);
    }
  }

  public removeMiniMeal(userId: number, mealId: number): void {
    try {
      const key = `${this.KEY_MINI_MEALS}${userId}`;
      const filtered = this.getUserMiniMeals(userId).filter(m => m.mealId !== mealId);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error eliminando miniMeal:', error);
    }
  }

  public cachearMiniMeal(userId: number, meal: IUserMiniMeal): void {
    try {
      const key = `${this.KEY_MINI_MEALS}${userId}`;
      const miniMeals = this.getUserMiniMeals(userId);
      if (!miniMeals.find(m => m.mealId === meal.mealId)) {
        miniMeals.push(meal);
        localStorage.setItem(key, JSON.stringify(miniMeals));
      }
    } catch (error) {
      console.error('Error cacheando miniMeal:', error);
    }
  }

  public getCachePorId(userId: number, mealId: number): IUserMiniMeal | undefined {
    return this.getUserMiniMeals(userId).find(m => m.mealId === mealId);
  }

  // --- Planes semanales ---

  public obtenerPlanesSemanalUsuario(userId: number): IWeeklyPlan[] {
    const planesLS = localStorage.getItem(this.KEY_WEEKLY_PLANS);
    if (!planesLS) return [];
    return (JSON.parse(planesLS) as IWeeklyPlan[]).filter(p => p.userId === userId);
  }

  public guardarPlanSemanal(plan: IWeeklyPlan): void {
    const planesLS = localStorage.getItem(this.KEY_WEEKLY_PLANS);
    const planes: IWeeklyPlan[] = planesLS ? JSON.parse(planesLS) : [];
    planes.push(plan);
    localStorage.setItem(this.KEY_WEEKLY_PLANS, JSON.stringify(planes));
  }

  public eliminarPlanSemanal(userId: number, planId: string): void {
    const planesLS = localStorage.getItem(this.KEY_WEEKLY_PLANS);
    if (!planesLS) return;
    const planes = (JSON.parse(planesLS) as IWeeklyPlan[]).filter(p => !(p.userId === userId && p.id === planId));
    localStorage.setItem(this.KEY_WEEKLY_PLANS, JSON.stringify(planes));
  }

}
