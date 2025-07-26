import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../../config';

const OrderPage = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", surname: "", address: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const order = {
            customer: form,
            items: cart,
            timestamp: new Date().toISOString()
        };

        const res = await fetch(`${API_BASE_URL}/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        if (res.ok) {
            clearCart();
            navigate("/order-confirmation");
        } else {
            alert("Failed to place order.");
        }
    };

    return (
        <div className="p-8">
            <h1 className="mb-4 text-2xl font-bold">Place Your Order</h1>

            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="block p-2 mb-2 border rounded"
            />
            <input
                name="surname"
                value={form.surname}
                onChange={handleChange}
                placeholder="Surname"
                className="block p-2 mb-2 border rounded"
            />
            <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="block p-2 mb-4 border rounded"
            />

            <h2 className="mb-2 font-semibold">Your Items:</h2>
            <ul className="mb-4">
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.name} x {item.quantity} - ${item.price}
                    </li>
                ))}
            </ul>

            <button
                onClick={handleSubmit}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
                Place Order
            </button>
        </div>
    );
};

export default OrderPage;
