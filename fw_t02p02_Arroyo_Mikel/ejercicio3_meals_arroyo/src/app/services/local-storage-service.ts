import { Injectable } from '@angular/core';
import { IUser } from '../model/i-user';


@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private static readonly KEY_USERS= 'users';

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

}
