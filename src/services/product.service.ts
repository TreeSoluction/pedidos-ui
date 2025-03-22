import api from './index';

export const GetAllProducts = async () => {
  const request = await api.get('products');

  return request.data;
};
