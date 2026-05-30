import { IWeeklyPlanDay } from "./i-weekly-plan-day"

export interface IWeeklyPlan {
  id: string
  userId: number
  days: IWeeklyPlanDay[];
}
