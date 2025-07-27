import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config';
import GoBackButton from '../../components/GoBackButton';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed fetching product: ', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="p-4">Loading product...</p>;
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="p-6">
      {/* Go Back Button */}
      <div className="max-w-md mx-auto">
        <GoBackButton />
      </div>
      {/* Detaljni o produktu */}
      <div className="max-w-md p-8 mx-auto border border-gray-300 rounded-md">
        <img
          src={`${API_BASE_URL}/${product.image_url}`}
          alt={product.name}
          className="object-cover w-64 h-64 mb-4"
        />
        <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
        <p className="mb-4 text-gray-700">{product.description}</p>
        <p className="text-xl font-semibold">{product.price}</p>
        <p className="text-sm text-gray-500">Available: {product.quantity}</p>
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
