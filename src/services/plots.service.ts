import api from './index';

export const GetTrendingProductsWeeksOld = async () => {
  const request = await api.get('/plots/weeksold/trending-products');
  return request.data;
};

export const GetProductDaySold = async (productId: string) => {
  const request = await api.get(
    `/plots/daysold/product?productId=${productId}`,
  );
  return request.data;
};

export const GetDailyProfit = async () => {
  const request = await api.get(`/plots/weekprofit`);
  return request.data;
};

export const GetProductWeekSold = async (productId: string) => {
  const request = await api.get(
    `/plots/weeksold/product?productId=${productId}`,
  );
  return request.data;
};

export const GetWeekSold = async () => {
  const request = await api.get('/plots/weeksold');
  return request.data;
};

export const GetDiarySold = async () => {
  const request = await api.get('/plots/diarysold');
  return request.data;
};
