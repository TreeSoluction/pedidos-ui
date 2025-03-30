import api from './index';

export const GetTrendingProductsWeeksOld = async () => {
  const request = await api.get('/plot/weeksold/trending-products');
  return request.data;
};

export const GetProductDaySold = async (productId: string) => {
  const request = await api.get(`/plot/daysold/product?productId=${productId}`);
  return request.data;
};

export const GetProductWeekSold = async (productId: string) => {
  const request = await api.get(
    `/plot/weeksold/product?productId=${productId}`,
  );
  return request.data;
};

export const GetWeekSold = async () => {
  const request = await api.get('/plot/weeksold');
  return request.data;
};

export const GetDiarySold = async () => {
  const request = await api.get('/plot/diarysold');
  return request.data;
};
