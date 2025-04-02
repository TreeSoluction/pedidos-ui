import { IProductIngredients } from './IProducts';

export interface IIngredient {
  id: string;
  name: string;
  sold_price: number;
  product_ingredients: IProductIngredients[];
}

export interface IIngredientInProduct extends IIngredient {
  quantity: number;
}

export interface ICreateIngredient {
  name: string;
  sold_price: number;
}

export interface IEditIngredient {
  id: string;
  name: string;
  sold_price: number;
}
