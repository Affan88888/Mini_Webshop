import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        minPrice: "",
        maxPrice: "",
        minQuantity: "",
        maxQuantity: "",
        sortBy: "date",
        order: "desc",
    });

    useEffect(() => {
        const fetchProducts = async () => {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== "") {
                    params.append(key, value);
                }
            });
            
            const response = await fetch(`${API_BASE_URL}/products?${params}`);
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, [filters]);

    const handleInputChange = (e) => {
        setFilters({...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4 mb-4">
            <input name="name" placeholder="Search Name" onChange={handleInputChange} />
            <input name="min_price" placeholder="Min Price" type="number" onChange={handleInputChange} />
            <input name="max_price" placeholder="Max Price" type="number" onChange={handleInputChange} />
            <input name="min_quantity" placeholder="Min Qty" type="number" onChange={handleInputChange} />
            <input name="max_quantity" placeholder="Max Qty" type="number" onChange={handleInputChange} />
            <select name="sort_by" onChange={handleInputChange}>
                <option value="date">Date</option>
                <option value="price">Price</option>
                <option value="quantity">Quantity</option>
            </select>
            <select name="order" onChange={handleInputChange}>
                <option value="desc">DESC</option>
                <option value="asc">ASC</option>
            </select>
        </div>

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
}

export default AdminDashboard;