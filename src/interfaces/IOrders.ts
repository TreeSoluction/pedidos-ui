import { IProduct } from './IProducts';

export interface IOrder {
  id: string;
  name: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: IProduct[];
}
