import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/shop/HomePage";
import ProductDetailPage from "./pages/shop/ProductDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/products/:id" element={<ProductDetailPage />}/>
      </Routes>
    </Router>
  )
}

export default App;
