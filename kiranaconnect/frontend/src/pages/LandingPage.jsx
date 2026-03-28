import { useNavigate } from "react-router-dom";
import { ArrowRight, Store, ShoppingBasket } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleStart = (targetRole) => {
     if (!user) return navigate('/auth');
     if (user.role === 'customer' && targetRole === 'vendor') {
         alert("You are logged in as a customer. Please sign out to register a vendor account.");
         return;
     }
     navigate(targetRole === 'vendor' ? '/vendor' : '/shop');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-kirana-surface to-green-50 py-10 relative overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-kirana-green/5 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-kirana-accent/5 rounded-full blur-3xl" 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="text-center z-10 max-w-md w-full glass-panel p-8 md:p-10 rounded-3xl border border-white/80 shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10"><Store size={64}/></div>
        
        <div className="w-20 h-20 bg-gradient-to-tr from-kirana-green to-kirana-light text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl transform rotate-3 hover:rotate-6 transition-transform">
          <ShoppingBasket size={40} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-black text-kirana-text leading-[1.1] mb-5 tracking-tight">
          Your kirana, <br/>
          <span className="text-kirana-accent bg-orange-50/80 px-3 py-1 rounded-xl inline-block transform -rotate-2 border border-orange-100 shadow-sm mt-1">online</span> in minutes.
        </h1>
        
        <p className="text-gray-500 mb-10 font-medium leading-relaxed">
          Order daily essentials instantly from completely authentic neighborhood stores near you. Zero fake data.
        </p>

        <div className="space-y-4 w-full relative z-10">
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => handleStart('customer')}
            className="w-full bg-kirana-green text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(26,92,58,0.2)]"
          >
            Start Shopping as Customer <ArrowRight size={20} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => handleStart('vendor')}
            className="w-full bg-white/80 hover:bg-white text-kirana-green border-2 border-kirana-green/10 font-bold py-4 rounded-2xl transition-colors shadow-sm"
          >
            I run a local Kirana Store
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
