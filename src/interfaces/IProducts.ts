import { ICategory } from './ICategories';
import { IIngredientInProduct } from './IIngredients';

export interface IProduct {
  id: string;
  sold_price: number;
  buy_price: number;
  name: string;
  category_id: string;
  category: ICategory;
  createdAt: string;
  updatedAt: string;
}

export interface IProductIngredients {
  id: string;
  product: IProduct;
  product_id: string;
  ingredient_id: string;
  quantity: number;
}

export interface IProductSelected extends IProduct {
  observation: string;
  quantity: number;
}

export interface ICreateProduct {
  category: string;
  name: string;
  sold_price?: number;
  buy_price?: number;
  ingredients: IIngredientInProduct[];
}

export interface IEditProduct {
  category: string;
  name: string;
  sold_price?: number;
  buy_price?: number;
  ingredients: IIngredientInProduct[];
}
