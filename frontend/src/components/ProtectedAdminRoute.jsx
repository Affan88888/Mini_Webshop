import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Loading dok se ceka da check-auth routa runna
  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    // Nije prijavljen korisnik
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // Nije admin korisnik
    return <Navigate to="/" replace />;
  }

  // Autentifikovan i ima admin privilegije
  return children;
};

export default ProtectedAdminRoute;
