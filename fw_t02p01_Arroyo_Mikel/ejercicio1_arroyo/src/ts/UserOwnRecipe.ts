import { User } from "./User.js";

export interface UserOwnRecipeIngredient {
    name: string;
    measure: string;
}

export interface UserOwnRecipe {
    id: string;
    userId: User["id"];
    name: string;
    category: string;
    area: string;
    instructions: string;
    ingredients: UserOwnRecipeIngredient[];
    images: string[];
    createdAt: Date;
}
