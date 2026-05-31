import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage-service';
import { AuthSession } from '../model/auth-session';
import { IUser } from '../model/i-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  constructor(private storage: LocalStorageService) {}

  public login(email: string, password: string): boolean {
    try{
      const usuario = this.storage.buscarUsuarioPorEmail(email);

      if(usuario && usuario.password === password){
        const session = new AuthSession(usuario.id, usuario.name, new Date());
        this.storage.setUsuarioActual(session);
        return true;
      }
    return false;

    } catch(error){
      console.error('Error en login', error);
      return false;
    }
  }

  public logout(): void{
    try{
      this.storage.removeUsuarioActual();
    }catch(error){
      console.error('Error en logout', error)
    }
  }

  public isAuthenticated(): boolean {
    return this.storage.getUsuarioActual() !== null;
  }

  public getCurrentUser(): AuthSession | null {
    try{
      return this.storage.getUsuarioActual();
    }catch(error){
      console.error('No se ha podido conseguir informacion del usuario actual', error);
      return null;
    }

  }
  public register(name: string, email:string, password: string): boolean{
    try{
      if(this.storage.buscarUsuarioPorEmail(email)){
        return false;
      }
      const nextId= this.storage.obtenerProximoIdUser();
      const usuarioNuevo= {
        id: nextId,
        name: name,
        email: email,
        password: password,
        favoriteCategory: undefined
      }
      this.storage.guardarUsuario(usuarioNuevo);
      return true;


    }catch(error){
      console.error('No se ha podido registar al usuario', error);
      return false;
    }

  }


}
