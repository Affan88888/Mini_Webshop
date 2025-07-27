import { useEffect, useState } from 'react';
import FilterBar from '../../components/FilterBar';
import ProductCard from '../../components/ProductCard';
import { API_BASE_URL } from '../../config';

// Definišemo default filtere koje ćemo koristiti i za inicijalno stanje i za reset
const defaultFilters = {
    name: "",
    min_price: "",
    max_price: "",
    min_quantity: "",
    max_quantity: "",
    sort_by: "date",
    order: "desc",
};

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(defaultFilters);

    // Kada se promijene filteri, fetchuj proizvode
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
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Greška prilikom fetchovanja proizvoda:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    // Handler za promjenu inputa u FilterBar-u
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Numeric polja pretvori u float ako nije prazan string
        const numericFields = ["min_price", "max_price", "min_quantity", "max_quantity"];
        const parsedValue = numericFields.includes(name) && value !== "" ? parseFloat(value) : value;

        setFilters((prev) => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    // Handler za Clear Filters dugme
    const clearFilters = () => {
        setFilters(defaultFilters);
    };

    return (
        <div className="p-6">

            {/* Filter komponenta sa propovima */}
            <div>
                <FilterBar
                    filters={filters}
                    onChange={handleInputChange}
                    onClear={clearFilters}
                />
            </div>

            {/* Indikator za loading */}
            {loading && (
                <div className="my-4 font-semibold text-blue-500">Učitavanje proizvoda...</div>
            )}

            <h1 className="mb-4 text-2xl font-bold"> Products </h1>

            {/* Lista proizvoda */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
