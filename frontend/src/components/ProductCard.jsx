import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="border rounded shadow p-4 flex flex-col items-center">
        <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover" />
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <span className="text-lg font-semibold mt-2">{product.price}</span>
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add to Cart</button>
      </div>
    </Link>
  );
};

export default ProductCard;
