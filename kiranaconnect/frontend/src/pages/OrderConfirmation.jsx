import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderId = state?.orderId || "UNKNOWN";

  return (
    <div className="min-h-screen bg-kirana-green flex items-center justify-center p-4">
       <div className="bg-white max-w-sm w-full rounded-3xl p-8 text-center animate-slide-up shadow-2xl relative overflow-hidden">
          {/* Confetti effect placeholder */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-kirana-accent/20 rounded-full mix-blend-multiply blur-2xl"></div>
          
          <div className="w-20 h-20 bg-green-50 text- kirana-green rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
             <CheckCircle2 size={48} className="text-kirana-green" />
          </div>
          <h2 className="text-3xl font-display font-black text-gray-900 mb-2 relative z-10">Order Confirmed!</h2>
          <p className="text-sm font-medium text-gray-500 mb-6 relative z-10">
            Your neighborhood kirana is packing your order.
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100 border-dashed relative z-10">
             <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order ID</p>
             <p className="font-mono font-bold text-lg text-gray-800">#{orderId.toUpperCase()}</p>
          </div>

          <button onClick={() => navigate('/')} className="w-full font-bold text-kirana-green bg-green-50 hover:bg-green-100 py-4 rounded-xl transition relative z-10">
            Back to Home
          </button>
       </div>
    </div>
  );
}
