import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-gray-800 text-white">
      <Link to="/" className="text-2xl font-bold">Mini Webshop</Link>
      <nav>
        <Link to="/cart" className="text-2xl hover:text-gray-300">🛒</Link>
      </nav>
    </header>
  );
};

export default Header;
