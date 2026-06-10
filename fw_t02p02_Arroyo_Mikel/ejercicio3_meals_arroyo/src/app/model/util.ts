import { IMyMeal } from "./i-my-meal";
import { IUserMiniMeal } from "./i-user-mini-meal";
import { IWeeklyPlan } from "./i-weekly-plan";

export class Util {
  static getISOWeek(date: Date): IWeeklyPlan['id'] {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const isoYear = d.getUTCFullYear();
    const yearStart = new Date(Date.UTC(isoYear, 0, 1));
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${isoYear}-W${weekNo.toString().padStart(2, '0')}` as IWeeklyPlan['id'];
  }

  static transformarMyMealAMiniMeal(meal: IMyMeal): IUserMiniMeal {
    return {
      mealId: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb
    };
  }
}
