import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import GoBackButton from '../../components/GoBackButton';

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const handlePlaceOrder = () => {
        navigate("../order");
    };

    return (
        <div className="p-6">
            <div className="max-w-md">
                <GoBackButton />
            </div>
            <h1 className="mb-4 text-2xl font-bold">Your Cart 🛒</h1>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {cart.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between p-4 bg-gray-100 rounded"
                            >
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p>
                                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handlePlaceOrder}
                            className="px-6 py-3 text-white bg-green-600 rounded hover:bg-green-700"
                        >
                            Place Order
                        </button>
                        <button
                            onClick={clearCart}
                            className="px-6 py-3 text-white bg-red-600 rounded hover:bg-red-700"
                        >
                            Clear Cart
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
