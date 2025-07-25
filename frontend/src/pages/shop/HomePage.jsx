import { useEffect, useState } from 'react';
import FilterBar from '../../components/FilterBar';
import ProductCard from '../../components/ProductCard';
import { API_BASE_URL } from '../../config';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products2`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div>
      <FilterBar />
      <div className="p-4">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
