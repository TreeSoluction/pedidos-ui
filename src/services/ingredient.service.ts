import { ICreateIngredient, IEditIngredient } from '@/interfaces/IIngredients';
import api from './index';

export const GetAllIngredients = async () => {
  const request = await api.get('ingredients');

  return request.data;
};

export const GetIngredientById = async (id: string) => {
  const request = await api.get(`ingredients/${id}`);

  return request.data;
};

export const CreateIngredients = async (data: ICreateIngredient) => {
  const request = await api.post('ingredients', data);

  return request.data;
};

export const EditIngredient = async (data: IEditIngredient) => {
  const request = await api.patch(`ingredients/${data.id}`, data);

  return request.data;
};

export const DeleteIngredients = async (id: string) => {
  const request = await api.delete(`ingredients/${id}`);

  return request.data;
};
