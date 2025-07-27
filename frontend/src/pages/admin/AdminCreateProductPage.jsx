import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import GoBackButton from '../../components/GoBackButton';

const AdminCreateProductPage = () => {
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
      <div className="p-6">
        <div className="max-w-md p-8 mx-auto mt-8 border border-gray-300 rounded-md p-18">
          <div className="max-w-md">
            <GoBackButton />
          </div>

          <h2 className="mb-6 text-2xl font-bold">Create New Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              required
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              required
            />

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              accept="image/*"
              required
            />

            <button
              type="submit"
              className="w-full px-6 py-3 text-white transition bg-blue-600 rounded hover:bg-blue-700"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
  );
};

export default AdminCreateProductPage;
