import api from './index';

export const GetAllCategories = async () => {
  const request = await api.get('categories');

  return request.data;
};

export const GetCategoryById = async (id: string) => {
  const request = await api.get(`categories/${id}`);

  return request.data;
};
