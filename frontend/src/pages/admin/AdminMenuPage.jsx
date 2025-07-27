import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/FilterBar';
import { API_BASE_URL } from '../../config';

// Definišemo default filtere koje ćemo koristiti za inicijalno stanje i za reset filtera
const defaultFilters = {
    name: "",
    min_price: "",
    max_price: "",
    min_quantity: "",
    max_quantity: "",
    sort_by: "date",
    order: "desc",
};

const AdminMenuPage = () => {
    const navigate = useNavigate();

    // State za listu proizvoda
    const [products, setProducts] = useState([]);
    // State za indikator učitavanja
    const [loading, setLoading] = useState(false);
    // State za filtere, inicijalizovan default filterima
    const [filters, setFilters] = useState(defaultFilters);

    // useEffect koji se aktivira svaki put kada se promijene filteri i učitava proizvode sa backend-a
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);  // Podesi loading na true prije fetch-a
                const params = new URLSearchParams();

                // Dodajemo samo one filtere koji nisu prazni string
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== "") {
                        params.append(key, value);
                    }
                });

                // Poziv API-ja za dohvatanje proizvoda sa query parametrima filtera
                const response = await fetch(`${API_BASE_URL}/products?${params}`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setProducts(data);  // Postavi dobijene proizvode u state
            } catch (error) {
                console.error("Greška prilikom fetchovanja proizvoda:", error);
            } finally {
                setLoading(false);  // Bez obzira na rezultat, sakrij loading indikator
            }
        };

        fetchProducts();
    }, [filters]);

    // Handler za promjenu vrijednosti input polja u FilterBar komponenti
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ["min_price", "max_price", "min_quantity", "max_quantity"];
        // Ukoliko je polje numeričko i nije prazno, parsiraj u float, inače koristi string
        const parsedValue = numericFields.includes(name) && value !== "" ? parseFloat(value) : value;

        setFilters((prev) => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    // Handler za dugme Clear Filters, resetuje filtere na default vrijednosti
    const clearFilters = () => {
        setFilters(defaultFilters);
    };

    // Navigacija na stranicu za kreiranje novog proizvoda
    const handleCreateClick = () => {
        navigate('/admin/create-product');
    };

    // Navigacija na stranicu sa pregledom kreiranih narudžbi
    const handleOrdersClick = () => {
        navigate('/admin/created-orders');
    };

    // Handler za brisanje proizvoda sa potvrdom od korisnika
    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            // Nakon uspješnog brisanja, ukloni proizvod iz liste u state-u
            setProducts((prev) => prev.filter((p) => p.id !== productId));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    return (
        <div className="p-6">
            {/* Header sa naslovom i dugmad za dodavanje proizvoda i pregled narudžbi */}
            <div className="flex flex-wrap items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex flex-col mt-4 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mt-0">
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

            {/* FilterBar komponenta sa props-ovima za filtere, promjenu i čišćenje */}
            <FilterBar
                filters={filters}
                onChange={handleInputChange}
                onClear={clearFilters}
            />

            {/* Indikator učitavanja */}
            {loading && <div className="my-4 font-semibold text-blue-500">Loading products...</div>}

            {/* Prikaz liste proizvoda u mreži */}
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

