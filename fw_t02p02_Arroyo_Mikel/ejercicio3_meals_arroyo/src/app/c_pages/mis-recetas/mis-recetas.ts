import { Component, inject } from '@angular/core';
import { MisRecetasList } from '../mis-recetas-list/mis-recetas-list';
import { MisRecetasCreate } from '../mis-recetas-create/mis-recetas-create';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-mis-recetas',
  imports: [MisRecetasList, MisRecetasCreate],
  templateUrl: './mis-recetas.html',
  styleUrl: './mis-recetas.css',
})
export class MisRecetas {
  private authService = inject(AuthService);
  public userId = this.authService.getCurrentUserId();
  public recargar = false;


  onRecetaCreada(): void {
  this.recargar = !this.recargar;
}
}
