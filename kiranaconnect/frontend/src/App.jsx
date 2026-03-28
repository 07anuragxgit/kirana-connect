import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import CustomerHome from "./pages/CustomerHome";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import VendorDashboard from "./pages/VendorDashboard";
import { useCart } from "./hooks/useCart";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, token } = useContext(AuthContext);
  if (!token) return <Navigate to="/auth" />;
  if (roleRequired && user?.role !== roleRequired) return <Navigate to="/" />;
  return children;
};

export default function App() {
  const cart = useCart();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Customer Routes */}
        <Route path="/shop" element={<ProtectedRoute roleRequired="customer"><CustomerHome cart={cart} /></ProtectedRoute>} />
        <Route path="/store/:storeId" element={<ProtectedRoute roleRequired="customer"><StorePage cart={cart} /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute roleRequired="customer"><CartPage cart={cart} /></ProtectedRoute>} />
        <Route path="/order-confirmed" element={<ProtectedRoute roleRequired="customer"><OrderConfirmation /></ProtectedRoute>} />
        
        {/* Vendor Routes */}
        <Route path="/vendor" element={<ProtectedRoute roleRequired="vendor"><VendorDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
