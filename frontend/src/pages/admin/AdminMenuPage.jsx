import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/FilterBar';
import { API_BASE_URL } from '../../config';

const AdminMenuPage = () => {
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
      const { name, value } = e.target;

      //Promijeni values od numeric fieldova iz stringa typea u float type
      const numericFields = ["min_price", "max_price", "min_quantity", "max_quantity"];
      const parsedValue = numericFields.includes(name) && value !== "" ? parseFloat(value) : value;

      setFilters((prev) => ({ ...prev, [name]: parsedValue }));
  };

    const handleCreateClick = () => {
        navigate('/admin/create-product');
    };

    const handleOrdersClick = () => {
        navigate('/admin/created-orders')
    }

    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            // Izbrisati deletovan product iz state-a
            setProducts((prev) => prev.filter((p) => p.id !== productId));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };


    return (
    <div className="p-6">
            {/* Header sa naslovom i buttonima */}
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

            {/* Filteri */}
            <div>
                <FilterBar filters={filters} onChange={handleInputChange} />
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="my-4 font-semibold text-blue-500">Loading products...</div>
            )}

            {/* Product Lista */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="p-4 border rounded shadow">
                        <h2 className="text-lg font-bold">{product.name}</h2>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>Published: {new Date(product.date).toLocaleDateString()}</p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => navigate(`/admin/product/${product.id}`)}
                                className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                Edit Product Details
                            </button>

                            <button
                                onClick={() => handleDelete(product.id)}
                                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
>
                                Delete Product
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMenuPage;
