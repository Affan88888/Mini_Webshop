import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="flex flex-col items-center p-4 border rounded shadow">
        <img src={product.imageUrl} alt={product.name} className="object-cover w-32 h-32" />
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <span className="mt-2 text-lg font-semibold">{product.price}</span>
        <button className="px-4 py-2 mt-4 text-white bg-green-600 rounded">Add to Cart</button>
      </div>
    </Link>
  );
};

export default ProductCard;
