import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const navigate = useNavigate();

    const handlePlaceOrder = () => {
        navigate("../order");
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Your Cart 🛒</h1>
            {/* Cart items ce ici ovdje */}
            <p>This is your cart. Items will appear here.</p>

            <button
                onClick={handlePlaceOrder}
                className="mt-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Place Order
            </button>
        </div>
    );
};

export default CartPage