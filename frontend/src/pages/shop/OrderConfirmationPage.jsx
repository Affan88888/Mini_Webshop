import { useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 text-center">
            <h1 className="mb-4 text-3xl font-bold">Your order has been placed! ✅</h1>
            <button
                onClick={() => navigate("/")}
                className="px-6 py-3 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
                Go Back
            </button>
        </div>
    );
};

export default OrderConfirmationPage;
