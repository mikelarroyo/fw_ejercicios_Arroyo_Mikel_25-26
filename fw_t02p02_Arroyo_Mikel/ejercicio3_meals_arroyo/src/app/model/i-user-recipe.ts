
import { IIngrMeasure } from './i-ingr-measure';
export interface IUserRecipe {
  id:number;
  userId:number;
  nombre: string;
  categoria: string;
  pais: string;
  instrucciones: string;
  ingredientes_cantidades: IIngrMeasure[];
  imagenes: string[];

}
