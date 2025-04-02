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
  const items: {
    create: {
      product: {
        connect: {
          id: string;
        };
      };
      observation: string;
    };
  }[] = data.items.map(({ observation, product_id }) => {
    return {
      create: {
        observation,
        product: {
          connect: {
            id: product_id,
          },
        },
      },
    };
  });

  const request = await api.post('orders', {
    ...data,
    items,
  });

  return request.data;
};

export const DeleteOrders = async (id: string) => {
  const request = await api.delete(`orders/${id}`);

  return request.data;
};
