import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from "./pages/shop/HomePage";
import ProductDetailPage from "./pages/shop/ProductDetailPage";
import CartPage from "./pages/shop/CartPage";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/products/:id" element={<ProductDetailPage />}/>
        <Route path="/cart" element={<CartPage />}/>
      </Routes>

    <Footer />
    </Router>
  )
}

export default App;
