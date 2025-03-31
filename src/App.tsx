import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import HomePage from './pages/home';
import OrderPage from './pages/order';
import OrdersPage from './pages/orders';
import ProductPage from './pages/product';
import ProductsPage from './pages/products';
import ReportsPage from './pages/reports';

export default function App() {
  useEffect(() => {
    document.body.style.overscrollBehaviorY = 'contain';

    return () => {
      document.body.style.overscrollBehaviorY = 'auto';
    };
  }, []);

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path='products' element={<ProductsPage />} />
      <Route path='product/:pageType/:id?' element={<ProductPage />} />
      <Route path='reports' element={<ReportsPage />} />
      <Route path='orders' element={<OrdersPage />} />
      <Route path='order/:pageType/:id?' element={<OrderPage />} />
    </Routes>
  );
}
