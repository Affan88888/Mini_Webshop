import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Header = () => {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    await logout();
    clearCart();
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 text-white bg-gray-800">
      <Link to="/" className="text-2xl font-bold">
        Mini Webshop
      </Link>

      <nav className="flex items-center space-x-6">
        {/* Cart Icon with Hover Label ABOVE */}
        <div className="relative flex flex-col items-center group">
          <div className="absolute text-xs text-white transition-opacity opacity-0 bottom-full group-hover:opacity-100">
            Cart
          </div>
          <Link
            to="/cart"
            className="text-2xl hover:text-gray-300"
            onClick={handleCartClick}
          >
            🛒
          </Link>
        </div>

        {user ? (
          <>
            <span className="text-lg font-semibold">Welcome, {user.username}</span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Login / Signup
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
