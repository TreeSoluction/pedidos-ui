import api from './index';

export const GetAllCategories = async () => {
  const request = await api.get('category');

  return request.data;
};
