import { ICategory } from './ICategories';

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
  category: {
    connect: {
      id: string;
    };
  };
  name: string;
  sold_price?: number;
  buy_price?: number;
}

export interface IEditProduct {
  category: {
    connect: {
      id: string;
    };
  };
  name: string;
  sold_price?: number;
  buy_price?: number;
}
