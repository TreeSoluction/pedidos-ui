export interface IProduct {
  id: string;
  category: string;
  name: string;
  purchase_price?: number;
  buy_price?: number;
}

export interface IProductSelected extends IProduct {
  observation: string;
  quantity: number;
}

export type ICreateProduct = Omit<IProduct, 'id'>;

export type IEditProduct = Omit<IProduct, 'id'>;
