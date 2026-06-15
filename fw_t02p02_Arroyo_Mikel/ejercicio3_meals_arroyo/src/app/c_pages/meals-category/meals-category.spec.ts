import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MealsCategory } from './meals-category';
import { ApiService } from '../../services/api-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { AuthService } from '../../services/auth-service';
import { IMyMeal } from '../../model/i-my-meal';

function makeMeal(id: number): IMyMeal {
  return {
    idMeal: id,
    strMeal: `Meal ${id}`,
    strCategory: 'Category',
    strArea: 'Area',
    strMealThumb: `https://www.themealdb.com/images/media/meals/meal${id}.jpg`,
    ingredients: [],
  };
}

describe('MealsCategory', () => {
  let component: MealsCategory;
  let fixture: ComponentFixture<MealsCategory>;
  let apiService: ApiService;
  let localStorageService: LocalStorageService;
  let authService: AuthService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MealsCategory],
      providers: [provideRouter([])],
    }).compileComponents();

    // Inyectamos los servicios ANTES de createComponent para poder hacer spies
    // antes de que el componente los use en su inicialización
    apiService = TestBed.inject(ApiService);
    localStorageService = TestBed.inject(LocalStorageService);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('should render 8 meal cards in the DOM', async () => {
    // Arrange
    const fakeMeals = Array.from({ length: 8 }, (_, i) => makeMeal(i + 1));
    vi.spyOn(apiService, 'get8RandomMeals').mockResolvedValue(fakeMeals);

    fixture = TestBed.createComponent(MealsCategory);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards).toHaveLength(8);
  });

  it('usuario logueado con categoría favorita → select muestra esa categoría y se pintan 8 recetas', async () => {
    // Arrange — los spies se ponen ANTES de createComponent porque getCurrentUserId()
    // se llama en la inicialización del componente: public userId = this.authService.getCurrentUserId()
    const fakeMeals = Array.from({ length: 8 }, (_, i) => makeMeal(i + 1));
    const spyGetUserId = vi.spyOn(authService, 'getCurrentUserId').mockReturnValue(1);
    vi.spyOn(localStorageService, 'getFavoriteCategory').mockReturnValue('Seafood');
    vi.spyOn(apiService, 'getAllCategories').mockResolvedValue(['Seafood', 'Beef', 'Chicken']);
    vi.spyOn(apiService, 'get8MealsByCategory').mockResolvedValue(fakeMeals);

    fixture = TestBed.createComponent(MealsCategory);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    expect(spyGetUserId).toHaveBeenCalled();             // el componente verificó si había usuario logueado
    expect(component.selectedCategory()).toBe('Seafood'); // el select cargó la categoría favorita
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards).toHaveLength(8);                       // se pintaron 8 recetas de esa categoría
  });
});
