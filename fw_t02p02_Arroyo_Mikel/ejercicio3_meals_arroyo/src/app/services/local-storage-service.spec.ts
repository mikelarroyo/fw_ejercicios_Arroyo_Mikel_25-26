import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage-service';
import { IUserMiniMeal } from '../model/i-user-mini-meal';
import { IUserRecipe } from '../model/i-user-recipe';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });

    service = TestBed.inject(LocalStorageService);
  });

  it('guardarMiReceta() → la receta con comentarios se guarda correctamente en el localStorage', () => {
    // Arrange
    const miReceta: IUserRecipe = {
      id: 1,
      userId: 1,
      nombre: 'Paella de Mikel',
      categoria: 'Arroces',
      pais: 'España',
      instrucciones: 'Primero sofríe el ajo...',
      ingredientes_cantidades: [
        { name: 'Arroz', measure: '200g' },
        { name: 'Azafrán', measure: '1 pizca' },
      ],
      imagenes: [],
    };

    // Act
    service.guardarMiReceta(miReceta);

    // Assert
    const recetasGuardadas = service.obtenerMiReceta(1);
    expect(recetasGuardadas).toHaveLength(1);
    expect(recetasGuardadas[0]).toEqual(miReceta);
  });

  it('saveMeal() → se guardan correctamente el status, comentarios y valoración', () => {
    // Arrange
    const mealConFormulario = {
      userId: 1,
      mealId: 52772,
      strMeal: 'Teriyaki Chicken',
      strCategory: 'Chicken',
      strArea: 'Japanese',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/teriyaki.jpg',
      ingredients: [],
      saveDate: '2026-06-15',
      status: 'LA_HE_HECHO',
      rating: 4,
      notes: 'Muy buena, repetiría',
    };

    // Act
    service.saveMeal(1, mealConFormulario);

    // Assert — verificamos que la receta entera se guardó en localStorage
    const guardado = service.getUserMeals(1);
    expect(guardado).toHaveLength(1);
    expect(guardado[0]).toEqual(mealConFormulario);
  });

  it('saveMiniMeal() → la receta se guarda correctamente en el localStorage', () => {
    // Arrange
    const receta: IUserMiniMeal = {
      mealId: 1,
      strMeal: 'Teriyaki Chicken',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/teriyaki.jpg',
    };

    // Act
    service.saveMiniMeal(1, receta);

    // Assert
    const recetasGuardadas = service.getUserMiniMeals(1);
    expect(recetasGuardadas).toHaveLength(1);
    expect(recetasGuardadas[0]).toEqual(receta);
  });
});
