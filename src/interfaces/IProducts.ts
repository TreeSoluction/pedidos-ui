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

export interface ICreateProduct {
  category: {
    connect: {
      id: string;
    };
  };
  name: string;
  purchase_price?: number;
  buy_price?: number;
}

export interface IEditProduct {
  category: {
    connect: {
      id: string;
    };
  };
  name: string;
  purchase_price?: number;
  buy_price?: number;
}
