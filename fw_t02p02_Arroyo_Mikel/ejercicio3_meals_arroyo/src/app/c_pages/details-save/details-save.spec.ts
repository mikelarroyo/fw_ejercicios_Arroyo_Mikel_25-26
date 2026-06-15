import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { DetailsSave } from './details-save';
import { AuthService } from '../../services/auth-service';
import { ApiService } from '../../services/api-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { IMyMeal } from '../../model/i-my-meal';

describe('DetailsSave', () => {
  let component: DetailsSave;
  let fixture: ComponentFixture<DetailsSave>;
  let authService: AuthService;
  let apiService: ApiService;
  let localStorageService: LocalStorageService;
  let location: Location;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DetailsSave],
      providers: [provideRouter([])],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    apiService = TestBed.inject(ApiService);
    localStorageService = TestBed.inject(LocalStorageService);
    location = TestBed.inject(Location);
  });

  afterEach(() => vi.restoreAllMocks());

  it('LA_HE_HECHO con comentarios y valoración → se guarda correctamente en localStorage', async () => {
    // Arrange
    const fakeMeal: IMyMeal = {
      idMeal: 52772,
      strMeal: 'Teriyaki Chicken',
      strCategory: 'Chicken',
      strArea: 'Japanese',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/teriyaki.jpg',
      ingredients: [],
    };

    vi.spyOn(authService, 'getCurrentUser').mockReturnValue({
      userId: 1,
      name: 'Mikel',
      loginDate: new Date(),
    });
    vi.spyOn(apiService, 'getMealById').mockResolvedValue(fakeMeal);
    vi.spyOn(location, 'back').mockReturnValue();

    fixture = TestBed.createComponent(DetailsSave);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 52772);

    fixture.detectChanges();       // ngOnChanges → loadMeal()
    await fixture.whenStable();    // espera a que getMealById resuelva
    fixture.detectChanges();

    // Act — rellenamos el formulario con LA_HE_HECHO, valoración y comentarios
    component.form.patchValue({
      status: 'LA_HE_HECHO',
      rating: 4,
      notes: 'Muy buena, repetiría',
      saveDate: '2026-06-15',
    });
    component.onSubmit();

    // Assert — leemos directamente del localStorage para verificar que el servicio guardó bien
    const guardado = localStorageService.getUserMeals(1);
    expect(guardado).toHaveLength(1);
    expect(guardado[0]).toEqual(expect.objectContaining({
      userId: 1,
      mealId: 52772,
      status: 'LA_HE_HECHO',
      rating: 4,
      notes: 'Muy buena, repetiría',
    }));
  });
});
