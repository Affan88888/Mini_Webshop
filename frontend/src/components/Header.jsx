import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-gray-800 text-white">
      <Link to="/" className="text-2xl font-bold">Mini Webshop</Link>

      <nav className="flex items-center space-x-6">
        <Link to="/cart" className="text-2xl hover:text-gray-300">🛒</Link>
        
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Login / Signup
        </Link>
      </nav>
    </header>
  );
};

export default Header;
