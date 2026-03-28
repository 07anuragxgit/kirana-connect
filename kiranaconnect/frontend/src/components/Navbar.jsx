import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ChevronLeft, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({ cart, showBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const isVendor = location.pathname.includes('/vendor');

  return (
    <nav className="sticky top-0 z-50 glass-panel">
      <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
          )}
          <h1 
            onClick={() => navigate(user?.role === 'vendor' ? '/vendor' : '/shop')} 
            className="text-xl font-display font-black text-kirana-green cursor-pointer"
          >
            Kirana<span className="text-kirana-accent">Connect</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {!isVendor && cart && (
            <button 
              onClick={() => navigate('/cart')}
              className="relative p-2 rounded-full hover:bg-kirana-green/10 text-kirana-green transition-colors"
            >
              <ShoppingBag size={24} />
              {cart.totalItems > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-kirana-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1 shadow-sm border-2 border-white">
                  {cart.totalItems}
                </span>
              )}
            </button>
          )}

          {user && !isVendor && (
             <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
               <span className="text-xs font-bold text-kirana-green bg-green-50 px-2 py-1 rounded-md border border-green-100 hidden sm:block uppercase tracking-wider">
                 {user.name.split(" ")[0]}
               </span>
               <button onClick={logout} className="text-red-400 hover:text-red-500 transition" title="Logout">
                 <LogOut size={20} strokeWidth={2.5}/>
               </button>
             </div>
          )}
          
          {!user && (
            <button onClick={() => navigate('/auth')} className="text-xs font-bold bg-kirana-green text-white px-5 py-2 rounded-xl shadow-md hover:scale-105 transition-transform">
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
