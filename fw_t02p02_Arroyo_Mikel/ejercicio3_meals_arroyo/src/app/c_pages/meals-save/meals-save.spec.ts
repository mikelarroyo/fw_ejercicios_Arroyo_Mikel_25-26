import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MealsSave } from './meals-save';
import { LocalStorageService } from '../../services/local-storage-service';
import { IUserMiniMeal } from '../../model/i-user-mini-meal';

function makeMiniMeal(id: number): IUserMiniMeal {
  return {
    mealId: id,
    strMeal: `Receta ${id}`,
    strMealThumb: `https://www.themealdb.com/images/media/meals/meal${id}.jpg`,
  };
}

describe('MealsSave', () => {
  let component: MealsSave;
  let fixture: ComponentFixture<MealsSave>;
  let localStorageService: LocalStorageService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MealsSave],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MealsSave);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(LocalStorageService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('logueado con 2 recetas guardadas → se pintan las 2 cards en el DOM', () => {
    // Arrange — usuario logueado con 2 recetas en localStorage
    const fakeRecetas: IUserMiniMeal[] = [makeMiniMeal(1), makeMiniMeal(2)];
    vi.spyOn(localStorageService, 'getUserMiniMeals').mockReturnValue(fakeRecetas);
    fixture.componentRef.setInput('userId', 1);

    // Act
    fixture.detectChanges();

    // Assert
    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('.card');
    expect(cards).toHaveLength(2);
  });

  it('logueado sin recetas guardadas → muestra mensaje "No hay recetas guardadas"', () => {
    // Arrange — usuario logueado (userId = 1) pero sin recetas en localStorage
    vi.spyOn(localStorageService, 'getUserMiniMeals').mockReturnValue([]);
    fixture.componentRef.setInput('userId', 1);

    // Act
    fixture.detectChanges();

    // Assert
    const el = fixture.nativeElement as HTMLElement;
    const mensaje = el.querySelector('.alert-info');
    expect(mensaje?.textContent?.trim()).toBe('No hay recetas guardadas');
  });
});
