import { IProduct, IProductSelected } from './IProducts';

export interface IOrder {
  id: string;
  name: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: IProduct[];
}

export interface ICreateOrder {
  name?: string;
  address?: string;
  items: IProductSelected[];
}

export interface IEditOrder {
  name?: string;
  address?: string;
  items: IProductSelected[];
}
