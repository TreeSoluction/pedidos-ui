import api from './index';

export const GetAllOrders = async () => {
  const request = await api.get('orders');

  return request.data;
};

export const GetOrderById = async (id: string) => {
  const request = await api.get(`orders/${id}`);

  return request.data;
};
