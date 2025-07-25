import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from "./pages/shop/HomePage";
import ProductDetailPage from "./pages/shop/ProductDetailPage";
import CartPage from "./pages/shop/CartPage";
import OrderPage from './pages/shop/OrderPage';
import Login from './pages/shop/Login';
import Signup from './pages/shop/Signup';
import AdminDashboard from './pages/admin/AdminMenuPage';
import CreateProductPage from './pages/admin/CreateProductPage';

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/products/:id" element={<ProductDetailPage />}/>
        <Route path="/cart" element={<CartPage />}/>
        <Route path="/order" element={<OrderPage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/admin" element={<AdminDashboard />}/>
        <Route path="/create-product" element={<CreateProductPage />}/>
      </Routes>

    <Footer />
    </Router>
  )
}

export default App;
