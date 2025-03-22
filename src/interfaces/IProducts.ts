export interface IProduct {
  id: string;
  price: number;
  name: string;
  category: string;
}

export interface IProductSelected extends IProduct {
  observation: string;
  quantity: number;
}
