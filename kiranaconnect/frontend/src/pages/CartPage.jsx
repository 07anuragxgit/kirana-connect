import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function CartPage({ cart }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [placing, setPlacing] = useState(false);

  const storeId = cart.cart[0]?.storeId || "store1";

  const handlePlaceOrder = async () => {
    if (!name || !phone) return alert("Please enter your details");
    setPlacing(true);
    
    try {
      const res = await axios.post("/api/orders", {
        customerName: name,
        customerPhone: phone,
        storeId,
        items: cart.cart,
        total: cart.totalPrice,
      });
      cart.clearCart();
      navigate("/order-confirmed", { state: { orderId: res.data.orderId } });
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Failed to place order. Try again.");
      setPlacing(false);
    }
  };

  if (cart.cart.length === 0)
    return (
      <div className="bg-kirana-surface min-h-screen">
        <Navbar cart={cart} showBack />
        <div className="text-center py-32 animate-fade-in max-w-sm mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <p className="text-5xl">🛒</p>
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <button onClick={() => navigate('/shop')} className="w-full bg-kirana-green text-white py-4 rounded-xl font-bold">
            Browse Stores
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-kirana-surface min-h-screen pb-10">
      <Navbar cart={cart} showBack />
      <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
        <h2 className="text-3xl font-display font-black mb-6">Checkout</h2>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {cart.cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
                    {item.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
                  </div>
                </div>
                <p className="font-bold text-kirana-green">₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-black text-xl border-t border-dashed border-gray-200 pt-4">
            <span>To Pay</span><span>₹{cart.totalPrice}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 mb-8">
           <h3 className="font-bold text-gray-800 mb-2">Delivery Details</h3>
           <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Full Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-kirana-green/20 focus:border-kirana-green outline-none transition" />
           <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel"
            placeholder="Phone Number (10 digits)" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-kirana-green/20 focus:border-kirana-green outline-none transition" />
        </div>

        <button onClick={handlePlaceOrder} disabled={placing}
          className="w-full bg-kirana-green hover:bg-kirana-light text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition disabled:opacity-70 flex justify-center items-center gap-3">
          {placing ? (
             <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            `Place Order · ₹${cart.totalPrice}`
          )}
        </button>
      </div>
    </div>
  );
}
