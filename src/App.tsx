import { Route, Routes } from 'react-router';
import HomePage from './pages/home';
import ProductPage from './pages/product';
import ProductsPage from './pages/products';
import ReportsPage from './pages/reports';
import RequestPage from './pages/request';
import RequestsPage from './pages/requests';

export default function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path='products' element={<ProductsPage />} />
      <Route path='product/:pageType/:id?' element={<ProductPage />} />
      <Route path='reports' element={<ReportsPage />} />
      <Route path='requests' element={<RequestsPage />} />
      <Route path='requests' element={<RequestPage />} />
    </Routes>
  );
}
