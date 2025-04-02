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
  const ingredients: {
    ingredient_id: string;
    quantity: number;
  }[] = data.ingredients.map((ingredient) => {
    return {
      ingredient_id: ingredient.id,
      quantity: ingredient.quantity,
    };
  });

  const request = await api.post('products', {
    ...data,
    product_ingredients: {
      create: ingredients,
    },
    category: {
      connect: {
        id: data.category,
      },
    },
    ingredients: undefined,
  });

  return request.data;
};

export const EditProduct = async (data: IEditProduct, id: string) => {
  const ingredients: {
    product_ingredients: string;
    quantity: number;
  }[] = data.ingredients.map((ingredient) => {
    return {
      product_ingredients: ingredient.id,
      quantity: ingredient.quantity,
    };
  });

  const request = await api.put(`products/${id}`, {
    ...data,
    product_ingredients: {
      connect: ingredients,
    },
  });

  return request.data;
};
