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
      <header className="flex flex-col gap-4 px-4 py-4 text-white bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="text-xl font-bold text-center sm:text-2xl sm:text-left">
          Mini Webshop
        </Link>

        <nav className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-end sm:gap-6">
          {/* Cart Icon-a sa hover label-om iznad icone */}
          <div className="relative flex flex-col items-center group">
            <div className="absolute text-xs text-white transition-opacity opacity-0 bottom-full group-hover:opacity-100">
              Cart
            </div>
            <Link
              to="/cart"
              className="text-xl hover:text-gray-300"
              onClick={handleCartClick}
            >
              🛒
            </Link>
          </div>

          {user ? (
            <>
              <span className="text-sm font-semibold text-center sm:text-base sm:text-left">
                Welcome, {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Login / Signup
            </Link>
          )}
        </nav>
      </header>
  );
};

export default Header;
