import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent Link navigation when clicking button
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="flex flex-col items-center p-4 transition border rounded shadow hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="w-full text-center">
        <img
          src={`${API_BASE_URL}/${product.image_url}`}
          alt={product.name}
          className="object-cover w-32 h-32 mx-auto mb-2"
        />
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-center text-gray-600">{product.description}</p>
        <p className="text-sm text-gray-500">Available: {product.quantity}</p>
        <p className="text-sm text-gray-400">
          Added: {new Date(product.date).toLocaleDateString()}
        </p>
        <span className="mt-2 text-lg font-semibold">${product.price}</span>
      </Link>

      <button
        onClick={handleAddToCart}
        className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
