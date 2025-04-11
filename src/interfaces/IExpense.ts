export interface IExpense {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateExpense {
  name: string;
  price: number;
}

export interface IEditExpense {
  id: string;
  name: string;
  price: number;
}
