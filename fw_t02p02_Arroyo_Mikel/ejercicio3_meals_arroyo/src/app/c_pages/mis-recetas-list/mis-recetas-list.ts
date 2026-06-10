import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage-service';
import { IUserRecipe } from '../../model/i-user-recipe';

@Component({
  selector: 'app-mis-recetas-list',
  imports: [NgOptimizedImage],
  templateUrl: './mis-recetas-list.html',
  styleUrl: './mis-recetas-list.css',
})
export class MisRecetasList implements OnInit, OnChanges {
  @Input() userId!: number;
  @Input() recargar: boolean = false;
  private localStorage = inject(LocalStorageService);

  misRecetas: IUserRecipe[] = [];
  recetaSeleccionada: IUserRecipe | null = null;
  ngOnInit(): void {
    this.cargarRecetas();
  }

  ngOnChanges(): void {
    if (this.userId) this.cargarRecetas();
  }

  private cargarRecetas(): void{
    this.misRecetas = this.localStorage.obtenerMiReceta(this.userId);
  }

  verDetalles(receta: IUserRecipe): void {
    this.recetaSeleccionada = receta;
  }

  cerrarModal(): void {
    this.recetaSeleccionada = null;
  }

  eliminarReceta(recetaId: number){
    if(!confirm('Quieres eliminar la receta?')) return;
    this.localStorage.eliminarMiReceta(this.userId, recetaId);
    this.cargarRecetas();
  }


}
