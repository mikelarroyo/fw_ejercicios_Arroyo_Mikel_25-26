import { TestBed } from '@angular/core/testing';
import { ApiService } from './api-service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('extractIngredients() → extrae correctamente los ingredientes del objeto crudo de la API', () => {
    // Arrange — simulamos el objeto raw que devuelve TheMealDB
    // Solo los primeros 3 tienen ingrediente real, el resto están vacíos
    const rawMeal: any = {
      strIngredient1: 'Chicken',
      strMeasure1: '200g',
      strIngredient2: 'Salt',
      strMeasure2: '1 tsp',
      strIngredient3: 'Olive Oil',
      strMeasure3: '2 tbsp',
      strIngredient4: '',  // vacío → no se incluye
      strMeasure4: '',
    };

    // Act — accedemos al método privado con notación de corchetes
    const result = service['extractIngredients'](rawMeal);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: 'Chicken', measure: '200g' });
    expect(result[1]).toEqual({ name: 'Salt', measure: '1 tsp' });
    expect(result[2]).toEqual({ name: 'Olive Oil', measure: '2 tbsp' });
  });

  it('searchMealsByIngredient() → llama a fetch con la URL correcta del ingrediente', async () => {
    // Arrange
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meals: [] }),
      } as Response)
    );

    // Act
    await service.searchMealsByIngredient('Chicken');

    // Assert — verificamos que se llamó a la URL correcta con el ingrediente
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://www.themealdb.com/api/json/v1/1/filter.php?i=Chicken'
    );
  });

  it('searchMealsByIngredient() → devuelve [] cuando la API no encuentra resultados', async () => {
    // Arrange — la API devuelve meals: null cuando no hay resultados
    vi.spyOn(globalThis, 'fetch').mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meals: null }),
      } as Response)
    );

    // Act
    const result = await service.searchMealsByIngredient('ingredienteInexistente');

    // Assert
    expect(result).toHaveLength(0);
  });
});
