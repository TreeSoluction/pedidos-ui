import { ICreateExpense, IEditExpense } from '@/interfaces/IExpense';
import api from './index';

export const GetAllExpenses = async () => {
  const request = await api.get('expenses');

  return request.data;
};

export const GetExpenseById = async (id: string) => {
  const request = await api.get(`expenses/${id}`);

  return request.data;
};

export const CreateExpense = async (data: ICreateExpense) => {
  const request = await api.post('expenses', data);

  return request.data;
};

export const EditExpense = async (data: IEditExpense) => {
  const request = await api.patch(`expenses/${data.id}`, data);

  return request.data;
};

export const DeleteExpense = async (id: string) => {
  const request = await api.delete(`expenses/${id}`);

  return request.data;
};
