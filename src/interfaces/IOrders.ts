import { IProduct, IProductSelected } from './IProducts';

export interface IOrder {
  id: string;
  name: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: IProduct[];
  order_number: number;
}

export interface ICreateOrder {
  name?: string;
  address?: string;
  items: {
    product_id: string;
    observation: string;
  }[];
}

export interface IEditOrder {
  name?: string;
  address?: string;
  items: IProductSelected[];
}
