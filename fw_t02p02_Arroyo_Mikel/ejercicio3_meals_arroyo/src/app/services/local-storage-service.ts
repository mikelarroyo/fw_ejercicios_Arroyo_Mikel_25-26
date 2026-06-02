import { Injectable } from '@angular/core';
import { IUser } from '../model/i-user';
import { AuthSession } from '../model/auth-session';
import { AuthService } from './auth-service';


@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private static readonly KEY_USERS= 'users';
  private static readonly KEY_SESSION = 'session';

  public guardarUsuario( usuario : IUser): void {
    try{
      const usuarios = this.obtenerTodosUsuarios();
      usuarios.push(usuario);
      localStorage.setItem(LocalStorageService.KEY_USERS, JSON.stringify(usuarios));
    } catch (error){
      console.error('Error guardando usuario en localStorage:', error);
    }
  }
  public obtenerTodosUsuarios(): IUser[] {
    try{
      const jsonData = localStorage.getItem(LocalStorageService.KEY_USERS);
      return jsonData ? JSON.parse(jsonData) : [];
    } catch (error){
      console.error('Error obteniendo los usuarios de LocalStorage:', error);
      return [];
    }
  }
  public buscarUsuarioPorEmail(email: string): IUser | null {
    try{
      const usuarios = this.obtenerTodosUsuarios();
      const usuarioFiltrado= usuarios.find(u => u.email === email);
      return usuarioFiltrado? usuarioFiltrado : null
      } catch(error){
      console.error('Error al obtener email del usuario:', error);
      return null;
    }
  }

  public buscarUsuarioPorId(id: number): IUser | null {
    try{
      const usuarios = this.obtenerTodosUsuarios();
      const usuarioFiltrado= usuarios.find(u=> u.id === id);
      return usuarioFiltrado || null;
    } catch(error){
      console.error('Error al buscar Usuario por id:', id);
      return null;
    }

  }

  public obtenerProximoIdUser(): number {
  try {
    const usuarios = this.obtenerTodosUsuarios();
    if (usuarios.length === 0) {
      return 1;
    }
    const maxId = Math.max(...usuarios.map(u => u.id));
    return maxId + 1;
  } catch (error) {
    console.error('Error obteniendo próximo id:', error);
    return 1;
  }
}


public setUsuarioActual(session : AuthSession):void{
  try {
    const JsonData= JSON.stringify(session);
    localStorage.setItem(LocalStorageService.KEY_SESSION, JsonData);
  }catch(error){
    console.error('Error al guardar sesion', error);
  }
}

public getUsuarioActual(): AuthSession | null {
  try{
    const jsonData = localStorage.getItem(LocalStorageService.KEY_SESSION);
    if (jsonData) {
      const data = JSON.parse(jsonData);
      return new AuthSession(data.userId, data.name, new Date(data.loginDate));
    }
    return null;

  } catch (error){
    console.error('No ha sido posible obtener el Usuario actual', error);
    return null;
  }
}

public removeUsuarioActual(): void {
  try {
    localStorage.removeItem(LocalStorageService.KEY_SESSION);
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
      localStorage.setItem(LocalStorageService.KEY_USERS, JSON.stringify(usuarios));
    }
  } catch (error) {
    console.error('Error guardando la categoría favorita', error);
  }
}

public getFavoriteCategory(userId: number): string | null {
  try {
    const usuario = this.buscarUsuarioPorId(userId);
    return usuario?.favoriteCategory || null;
  } catch (error) {
    console.error('Error al obtener la categoría favorita', error);
    return null;
  }
}
public getUserMeals(userId: number): any[] {

  try{
    const key = `userMeals_${userId}`;
    const jsonData = localStorage.getItem(key);
    return jsonData? JSON.parse(jsonData) : [];

  }catch(error){
    console.error('Error al obtener comidas guardadas')
    return[];
  }
}

public isMealSaved(userId: number, mealId: number): boolean {
  const recetaUsuario = this.getUserMeals(userId);
  return recetaUsuario.some(m => m.mealId === mealId);
}

public saveMeal(userId: number, meal: any): void {
  try {
    const key = `userMeals_${userId}`;
    const meals = this.getUserMeals(userId);
    if (!meals.some(m => m.idMeal === meal.idMeal)) {
      meals.push(meal);
      localStorage.setItem(key, JSON.stringify(meals));
    }
  } catch (error) {
    console.error('Error guardando comida:', error);
  }
}

public removeMeal(userId: number, mealId: number): void {
  try {
    const key = `userMeals_${userId}`;
    const meals = this.getUserMeals(userId);
    const filtered = meals.filter(m => m.idMeal !== mealId);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error eliminando comida:', error);
  }
}

}
