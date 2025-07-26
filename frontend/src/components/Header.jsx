import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();  // Prevent default link navigation
      navigate('/login');
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 text-white bg-gray-800">
      <Link to="/" className="text-2xl font-bold">
        Mini Webshop
      </Link>

      <nav className="flex items-center space-x-6">
        <Link
          to="/cart"
          className="text-2xl hover:text-gray-300"
          onClick={handleCartClick}
        >
          🛒
        </Link>

        {user ? (
          <>
            <span className="mr-2 text-sm">Welcome, {user.username}</span>
            <button
              onClick={logout}
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
