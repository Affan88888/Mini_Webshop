import { useEffect, useState } from 'react';
import FilterBar from '../../components/FilterBar';
import ProductCard from '../../components/ProductCard';
import { API_BASE_URL } from '../../config';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
      name: "",
      min_price: "",
      max_price: "",
      min_quantity: "",
      max_quantity: "",
      sort_by: "date",
      order: "desc",
  });

  useEffect(() => {
      const fetchProducts = async () => {
          try {
              setLoading(true);
              const params = new URLSearchParams();
              Object.entries(filters).forEach(([key, value]) => {
                  if (value !== "") {
                      params.append(key, value);
                  }
              });
                
              const response = await fetch(`${API_BASE_URL}/products?${params}`);
              if (!response.ok) {
                  throw new Error(`Error ${response.status}: ${response.statusText}`)
              }

              const data = await response.json();
              setProducts(data);
          } catch (error) {
              console.error("Failed to fetch products:", error);
          } finally {
              setLoading(false)
          }
      };

      fetchProducts();
  }, [filters]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;

      //Promijeni values od numeric fieldova iz stringa typea u float type
      const numericFields = ["min_price", "max_price", "min_quantity", "max_quantity"];
      const parsedValue = numericFields.includes(name) && value !== "" ? parseFloat(value) : value;

      setFilters((prev) => ({ ...prev, [name]: parsedValue }));
  };

  return (
    <div>
      <FilterBar filters={filters} onChange={handleInputChange} />
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
