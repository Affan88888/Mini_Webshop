import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/FilterBar';
import { API_BASE_URL } from '../../config';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
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
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleCreateClick = () => {
        navigate('/create-product');
    };

    const handleOrdersClick = () => {
        navigate('/created-orders')
    }

    return (
    <div className="p-6">
            {/* Header with title and right-aligned buttons */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>

                <div className="space-x-4">
                <button
                    onClick={handleCreateClick}
                    className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
                >
                    Add New Product
                </button>

                <button
                    onClick={handleOrdersClick}
                    className="px-4 py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
                >
                    Check Orders
                </button>
                </div>
            </div>

            {/* Filters */}
            <div>
                <FilterBar filters={filters} onChange={handleInputChange} />
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="my-4 font-semibold text-blue-500">Loading products...</div>
            )}

            {/* Product List */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="p-4 border rounded shadow">
                        <h2 className="font-bold">{product.name}</h2>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>Published: {new Date(product.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
