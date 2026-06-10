import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage-service';
import { ApiService } from '../../services/api-service';
import { IIngrMeasure } from '../../model/i-ingr-measure';
import { IUserRecipe } from '../../model/i-user-recipe';

@Component({
  selector: 'app-mis-recetas-create',
  imports: [ReactiveFormsModule, NgClass, NgOptimizedImage],
  templateUrl: './mis-recetas-create.html',
  styleUrl: './mis-recetas-create.css',
})
export class MisRecetasCreate implements OnInit {
  @Input() userId!: number;
  @Output() recetaCreada = new EventEmitter<void>();
  private localStorage = inject(LocalStorageService);
  private api = inject(ApiService);

  ingredientes: IIngrMeasure[] = [];
  imagenes: string[] = [];
  categorias: string[] = [];
  paises: string[] = [];
  todosIngredientes: string[] = [];

  async ngOnInit(): Promise<void> {
    this.categorias = await this.api.getAllCategories();
    this.paises = await this.api.getAllAreas();
    this.todosIngredientes = await this.api.getAllIngredients();
  }

  recetaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    categoria: new FormControl('', [Validators.required]),
    pais: new FormControl('', [Validators.required]),
    instrucciones: new FormControl('', [Validators.required])
  });

  ingredienteForm = new FormGroup({
  listaIngredientes: new FormControl('', [Validators.required]),
  cantidad: new FormControl('', [Validators.required]),
});

  imagenForm = new FormGroup({
    url: new FormControl('', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]),
  });

  urlDuplicada = false;
  nombreDuplicado = false;
  sinIngredientes = false;
  sinImagenes = false;
  submitted = false;

  getValidationClass(controlName: string): string {
    if (!this.submitted) return '';
    const control = this.recetaForm.get(controlName);
    if (!control) return '';
    return control.valid ? 'is-valid' : 'is-invalid';
  }

  anadirIngrediente(){
    if(this.ingredienteForm.invalid) return;
    const nombreIngrediente = this.ingredienteForm.get('listaIngredientes')?.value;
    const cantidad = this.ingredienteForm.get('cantidad')?.value;
    this.ingredientes.push({name: nombreIngrediente!, measure: cantidad!});
    this.ingredienteForm.reset();
  }

  anadirImagen(){
    if(this.imagenForm.invalid) return;
    const imagen = this.imagenForm.get('url')?.value!;
    if (this.imagenes.includes(imagen)) {
      this.urlDuplicada = true;
      return;
    }
    this.urlDuplicada = false;
    this.imagenes.push(imagen);
    this.imagenForm.reset();
  }

  onSubmit(){
    this.submitted = true;
    this.sinIngredientes = this.ingredientes.length === 0;
    this.sinImagenes = this.imagenes.length === 0;
    if(this.recetaForm.invalid || this.sinIngredientes || this.sinImagenes) return;
    const nombre = this.recetaForm.get('nombre')?.value!;
    const recetasExistentes = this.localStorage.obtenerMiReceta(this.userId);
    if (recetasExistentes.some(r => r.nombre === nombre)) {
      this.nombreDuplicado = true;
      return;
    }
    this.nombreDuplicado = false;
    const nuevaReceta: IUserRecipe = {
      id: this.localStorage.obtenerProximoIdMisRecetas(this.userId),
      userId: this.userId,
      nombre: this.recetaForm.get('nombre')?.value!,
      categoria: this.recetaForm.get('categoria')?.value!,
      pais: this.recetaForm.get('pais')?.value!,
      instrucciones: this.recetaForm.get('instrucciones')?.value!,
      ingredientes_cantidades: this.ingredientes,
      imagenes: this.imagenes,
    };
    this.localStorage.guardarMiReceta(nuevaReceta);
    this.recetaCreada.emit();
    this.ingredientes = [];
    this.imagenes = [];
    this.submitted = false;
    this.sinIngredientes = false;
    this.sinImagenes = false;
    this.recetaForm.reset();
  }

}
