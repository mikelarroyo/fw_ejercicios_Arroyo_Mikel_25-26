import { Injectable } from '@angular/core';
import { IMyMeal } from '../model/i-my-meal';
import { IIngrMeasure } from '../model/i-ingr-measure';
import { ICategory } from '../model/i-category';
import { MealsCategory } from '../c_pages/meals-category/meals-category';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = 'https://www.themealdb.com/api/json/v1/1/';
  private readonly API_KEY = '1';

  constructor(){}

  async getRandomMeal(): Promise<IMyMeal> {
    try{
      const response = await fetch (`${this.API_URL}random.php`);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data: any = await response.json();
      const mealApi = data.meals[0];

      return this.convertJsonToInterface(mealApi);
    }catch(error){
      console.error('Error obteniendo receta aleatoria', error);
      throw error;
    }
  }

private convertJsonToInterface(mealApi: any): IMyMeal {
  return {
    idMeal: mealApi.idMeal,
    strMeal: mealApi.strMeal,
    strCategory: mealApi.strCategory,
    strArea: mealApi.strArea,
    strMealThumb: mealApi.strMealThumb,
    ingredients: this.extractIngredients(mealApi)
  };
}

async getAllCategories(): Promise<string[]> {
  try{
    const response = await fetch (`${this.API_URL}categories.php`);
    if(!response.ok){
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data: any = await response.json();
    const categories= data.categories;

    const categoryNames= categories
    .map((cat: any) => cat.strCategory)
    .sort();
    return categoryNames;

  } catch(error){
    console.error('Error obteniendo el listado de categorias', error);
    return [];
  }

}

async get8MealsByCategory(category: string): Promise<IMyMeal[]>{
  try{
    const response = await fetch (`${this.API_URL}filter.php?c=${category}`);
    if(!response.ok){
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data: any = await response.json();
    const meals = data.meals.slice(0,8);
    return meals.map((meal: any) => this.convertJsonToInterface(meal));

  } catch(error){
    console.error('No ha sido posible obtener las recetas aleatoriamente', error)
    return[];
  }
}

async getMealById(id: number): Promise<IMyMeal>{
  try{
        const response = await fetch(`${this.API_URL}lookup.php?i=${id}`);
        if(!response.ok){
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data: any = await response.json();
        const mealApi = data.meals[0];
        return this.convertJsonToInterface(mealApi);

  }catch(error){
    console.error('No ha sido posible recuperar la receta por id', error);
    throw error;
  }
}


async get8RandomMeals(): Promise<IMyMeal[]> {
  const meals: IMyMeal[] = [];
  try {
    for (let i = 0; i < 8; i++) {
      const meal = await this.getRandomMeal();
      meals.push(meal);
    }
    return meals;
  } catch (error) {
    console.error('Error obteniendo 8 recetas aleatorias:', error);
    return [];
  }
}



private extractIngredients(mealApi: any): IIngrMeasure[] {
  const ingredients: IIngrMeasure[] = [];
  for (let i = 1; i <= 20; i++) {
    if (mealApi[`strIngredient${i}`]) {
      ingredients.push({
        name: mealApi[`strIngredient${i}`],
        measure: mealApi[`strMeasure${i}`]
      });
    }
  }
  return ingredients;
}



}
