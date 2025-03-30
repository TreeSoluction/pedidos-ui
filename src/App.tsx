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
    const preventDefault = (event) => event.preventDefault();

    document.body.style.overscrollBehavior = 'none';

    // Evita pull-to-refresh especificamente
    document.addEventListener('touchstart', preventDefault, { passive: false });

    return () => {
      document.body.style.overscrollBehavior = '';
      document.removeEventListener('touchstart', preventDefault);
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
