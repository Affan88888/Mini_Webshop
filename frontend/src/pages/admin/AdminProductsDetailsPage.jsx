import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const AdminProductDetailsPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
    });
    const [imageFile, setImageFile] = useState(null); // za učitavanje nove slike

    // Dobivanje detalja o proizvodu
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/products/${productId}`);
                if (!response.ok) throw new Error("Neuspješno dohvatanje proizvoda");

                const data = await response.json();
                setProduct(data);
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    price: data.price || '',
                    quantity: data.quantity || '',
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Obrada slika
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Slanje izmjena
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("quantity", formData.quantity);

        // Ako je nova slika odabrana, dodaj u formData
        if (imageFile) {
            formDataToSend.append("image", imageFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (!response.ok) throw new Error('Neuspješno ažuriranje proizvoda');
            alert('Proizvod uspješno ažuriran');
            navigate('/admin');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-4 text-blue-500">Učitavanje podataka o proizvodu...</div>;
    if (error) return <div className="p-4 text-red-500">Greška: {error}</div>;

    return (
        <div className="max-w-xl p-6 mx-auto mt-10 bg-white border rounded shadow">
            <h2 className="mb-4 text-2xl font-semibold">Uredi Proizvod</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Naziv</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Opis</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows="4"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Cijena (€)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Količina</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {product?.image_url && (
                    <div>
                    <label className="block mb-1 font-medium">Trenutna slika</label>
                    <img
                        src={`${API_BASE_URL}/${product.image_url}`}
                        alt="Trenutna slika"
                        className="w-32 h-auto rounded"
                    />
                    </div>)}
                
                <div>
                    <label className="block mb-1 font-medium">Nova slika (opcionalno)</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Spasi Promjene
                </button>
            </form>
        </div>
    );
};

export default AdminProductDetailsPage;
