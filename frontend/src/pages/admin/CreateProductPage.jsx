import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: e.target.files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('quantity', form.quantity);
    formData.append('price', form.price);
    formData.append('image', form.image);

    try {
      const response = await fetch(`${API_BASE_URL}/create-product`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        navigate('/admin');
      } else {
        console.error('Failed to create product');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="file" name="image" onChange={handleChange} className="w-full p-2" accept="image/*" required />
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProductPage;
