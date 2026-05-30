import { IIngrMeasure } from "./i-ingr-measure";
export interface IMyMeal {
  idMeal: number;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  ingredients: IIngrMeasure[];

}
