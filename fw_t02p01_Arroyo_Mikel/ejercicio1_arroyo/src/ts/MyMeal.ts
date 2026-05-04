export interface MyMeal {
    idMeal: number;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
    strInstructions?: string;
    ingredients: { name: string; measure: string }[];
}
