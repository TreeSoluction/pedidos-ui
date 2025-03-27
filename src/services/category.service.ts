import api from './index';

export const GetAllCategories = async () => {
  const request = await api.get('category');

  return request.data;
};

export const GetCategoryById = async (id: string) => {
  const request = await api.get(`category/${id}`);

  return request.data;
};
