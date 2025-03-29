import { ICreateOrder } from '@/interfaces/IOrders';
import api from './index';

export const GetAllOrders = async () => {
  const request = await api.get('orders');

  return request.data;
};

export const GetOrderById = async (id: string) => {
  const request = await api.get(`orders/${id}`);

  return request.data;
};

export const CreateOrders = async (data: ICreateOrder) => {
  const request = await api.post('orders', data);

  return request.data;
};

export const DeleteOrders = async (id: string) => {
  const request = await api.delete(`orders/${id}`);

  return request.data;
};
