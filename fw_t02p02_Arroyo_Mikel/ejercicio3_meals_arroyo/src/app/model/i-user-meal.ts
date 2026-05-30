export enum UserMealStatus {
  QUIERO_HACERLA = 'QUIERO_HACERLA',
  LA_HE_HECHO = 'LA_HE_HECHO'
}

export interface IUserMeal {
  userId: number;
  mealId: number;
  saveDate: Date;
  status: UserMealStatus;
  notes?: string;
  rating?: number;

}
