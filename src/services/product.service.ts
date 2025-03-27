import { ICreateProduct, IEditProduct } from '@/interfaces/IProducts';
import api from './index';

export const GetAllProducts = async () => {
  const request = await api.get('products');

  return request.data;
};

export const GetProductById = async (id: string) => {
  const request = await api.get(`products/${id}`);

  return request.data;
};

export const CreateProduct = async (data: ICreateProduct) => {
  const request = await api.post('products', data);

  return request.data;
};

export const EditProduct = async (data: IEditProduct, id: string) => {
  const request = await api.put(`products/${id}`, data);

  return request.data;
};
