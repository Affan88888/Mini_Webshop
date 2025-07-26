import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from "./pages/shop/HomePage";
import ProductDetailPage from "./pages/shop/ProductDetailPage";
import CartPage from "./pages/shop/CartPage";
import OrderPage from './pages/shop/OrderPage';
import OrderConfirmationPage from "./pages/shop/OrderConfirmationPage";
import LoginPage from './pages/shop/LoginPage';
import SignupPage from './pages/shop/SignupPage';

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminCreateProductPage from './pages/admin/AdminCreateProductPage';
import AdminProductDetailsPage from './pages/admin/AdminProductsDetailsPage';
import AdminCheckOrdersPage from './pages/admin/AdminCheckOrdersPage';


function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* ... Public rute ... */}
        <Route path="/" element={<HomePage />}/>
        <Route path="/products/:id" element={<ProductDetailPage />}/>
        <Route path="/cart" element={<CartPage />}/>
        <Route path="/order" element={<OrderPage />}/>
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignupPage />}/>

        {/* Admin rute zaštićene */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminMenuPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/create-product"
          element={
            <ProtectedAdminRoute>
              <AdminCreateProductPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/product/:productId"
          element={
            <ProtectedAdminRoute>
              <AdminProductDetailsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/created-orders"
          element={
            <ProtectedAdminRoute>
              <AdminCheckOrdersPage />
            </ProtectedAdminRoute>
          }
        />
      </Routes>

    <Footer />
    </Router>
  )
}

export default App;
