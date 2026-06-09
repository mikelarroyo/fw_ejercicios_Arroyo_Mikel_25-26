import { Component, inject, input, signal, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { IWeeklyPlan } from '../../model/i-weekly-plan';
import { IUserMiniMeal } from '../../model/i-user-mini-meal';
import { IWeeklyPlanDay } from '../../model/i-weekly-plan-day';
import { Util } from '../../model/util';



@Component({
  selector: 'app-plan-week-create',
  imports: [ReactiveFormsModule],
  templateUrl: './plan-week-create.html',
  styleUrl: './plan-week-create.css',
})
export class PlanWeekCreate {
  userId = input.required<number>();
  @Output() planGuardado = new EventEmitter<void>();
  private api = inject(ApiService);
  private localStorage = inject(LocalStorageService)


  fechaForm = new FormGroup({
    fecha: new FormControl('', [Validators.required])
  });

  ingredienteForm = new FormGroup({
    buscarIngrediente: new FormControl('', [Validators.required])
  });

  public fechaSeleccionada = signal<Date | null>(null);
  public platosEncontrados = signal<IUserMiniMeal[] | null>(null);
  public platoSeleccionado = signal<IUserMiniMeal | null>(null);
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  planesDiarios: IWeeklyPlanDay[] = this.generarPlanesDiarios();

  private generarPlanesDiarios(): IWeeklyPlanDay[] {
    return this.diasSemana.map(dia => ({
      day: dia,
      lunchMealId: null,
      dinnerMealId: null
    }));
  }
  public existePlanSemanal: boolean = false;
  sinRecetas: boolean = false;

  //submit del form fecha
  handleFechaSeleccionada() {
    if (this.fechaForm.invalid) return;
    const fecha = this.fechaForm.get('fecha')?.value;
    this.fechaSeleccionada.set(new Date(fecha!));
  }


  //submit buscador ingrediente y devolvemos platosEncontrados, transformamos Mymeal en miniMeal
  async buscarIngrediente() {
    if (this.ingredienteForm.invalid) return;
    const ingrediente = this.ingredienteForm.get('buscarIngrediente')?.value;
    const resultados = await this.api.searchMealsByIngredient(ingrediente!);
    this.platosEncontrados.set(resultados.map(m => Util.transformarMyMealAMiniMeal(m)));
  }

  //guardar seleccionado en click
  seleccionarReceta(resultado: IUserMiniMeal) {
    this.platoSeleccionado.set(resultado);
  }


  //agreagamos a la tabla
  agregarReceta(comidaCena: 'comida' | 'cena', dia: string) {
    const diaPlan = this.planesDiarios.find(d => d.day === dia);
    if (!diaPlan || !this.platoSeleccionado()) return;
    if (comidaCena === 'comida') {
      diaPlan.lunchMealId = this.platoSeleccionado()!.mealId;
    } else {
      diaPlan.dinnerMealId = this.platoSeleccionado()!.mealId;
    }
  }

  //guardamos cuando ya esta listo
  crearPlanSemanal() {
    if (!this.planesDiarios.some(d => d.lunchMealId || d.dinnerMealId)) {
      this.sinRecetas = true;
      return;
    }

    // comprueba si ya existe un plan para esa semana
    const semana = Util.getISOWeek(this.fechaSeleccionada()!);
    const planes = this.localStorage.obtenerPlanesSemanalUsuario(this.userId());
    if (planes.some(p => p.id === semana)) {
      this.existePlanSemanal = true;
      return;
    }

    const nuevoPlan: IWeeklyPlan = {
      id: semana,
      userId: this.userId(),
      days: this.planesDiarios
    };
    this.localStorage.guardarPlanSemanal(nuevoPlan);
    this.planGuardado.emit();
    this.limpiarPlan();
  }


  //reset
  limpiarPlan() {
    this.planesDiarios = this.generarPlanesDiarios();
    this.platosEncontrados.set(null);
    this.platoSeleccionado.set(null);
    this.fechaSeleccionada.set(null);
    this.fechaForm.reset();
    this.ingredienteForm.reset();
    this.sinRecetas = false;
    this.existePlanSemanal = false;
  }








}
