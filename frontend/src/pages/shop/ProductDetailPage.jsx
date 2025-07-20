import { useParams } from 'react-router-dom';
import { useEffect, useState} from 'react';
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8000/products/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Failed fetchi product: ", error);           
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <p className="p-4">Loading product...</p>
    }

    return (
        <div>
            <div className="p-8">
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-64 h-64 object-cover mb-4" 
                />
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-xl font-semibold">{product.price}</p>
                <p className="text-sm text-gray-500">Available: {product.quantity}</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetailPage;