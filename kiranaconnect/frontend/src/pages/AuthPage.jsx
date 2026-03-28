import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Store, User, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        const res = await axios.post("/api/auth/login", { 
           email: formData.email, 
           password: formData.password 
        });
        login(res.data.token, res.data.user);
        navigate(res.data.user.role === 'vendor' ? '/vendor' : '/shop');
      } else {
        const res = await axios.post("/api/auth/register", { ...formData, role });
        login(res.data.token, res.data.user);
        navigate(res.data.user.role === 'vendor' ? '/vendor' : '/shop');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kirana-surface flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-kirana-green/5 rounded-full blur-3xl" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-kirana-accent/5 rounded-full blur-3xl" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="glass-panel max-w-md w-full p-8 rounded-3xl z-10 border border-white/60 shadow-2xl relative"
      >
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-gradient-to-tr from-kirana-green to-kirana-light text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl transform -rotate-3">
              <Store size={32} />
           </div>
           <h1 className="text-3xl font-display font-black text-gray-900">
             Kirana<span className="text-kirana-accent">Connect</span>
           </h1>
           <p className="text-gray-500 font-medium text-sm mt-1">
             {isLogin ? "Welcome back to your store network" : "Join the neighborhood network"}
           </p>
        </div>

        {error && (
           <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-bold border border-red-100 text-center">
             {error}
           </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}}>
              <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                 <button type="button" onClick={() => setRole('customer')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${role === 'customer' ? 'bg-white shadow-sm text-kirana-green' : 'text-gray-500 hover:text-gray-700'}`}>
                   <User size={16}/> Customer
                 </button>
                 <button type="button" onClick={() => setRole('vendor')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${role === 'vendor' ? 'bg-white shadow-sm text-kirana-green' : 'text-gray-500 hover:text-gray-700'}`}>
                   <Store size={16}/> Shopkeeper
                 </button>
              </div>
              <input 
                type="text" required placeholder="Full Name" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-kirana-green/20 outline-none transition" 
              />
            </motion.div>
          )}

          <input 
            type="email" required placeholder="Email Address" 
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-kirana-green/20 outline-none transition" 
          />
          <input 
            type="password" required placeholder="Password" 
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-kirana-green/20 outline-none transition" 
          />

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-kirana-green text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 flex justify-center items-center gap-2 transition disabled:opacity-70 mt-6"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : (
              <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="ml-2 text-kirana-green font-bold hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
