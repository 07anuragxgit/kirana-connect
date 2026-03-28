import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StoreCard from "../components/StoreCard";
import Navbar from "../components/Navbar";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function CustomerHome({ cart }) {
  const [stores, setStores] = useState([]);
  const [locationDetected, setLocationDetected] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/stores").then((res) => {
      setStores(res.data);
      setLoading(false);
    });
  }, []);

  const handleDetectLocation = () => {
    setTimeout(() => setLocationDetected(true), 800);
  };

  return (
    <div className="bg-kirana-surface min-h-screen pb-10">
      <Navbar cart={cart} />
      <div className="max-w-xl mx-auto px-4 py-8">
        {!locationDetected ? (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="text-center py-20 glass-panel rounded-3xl mt-10 p-8 border border-white/60 shadow-2xl">
            <div className="w-20 h-20 bg-green-50 border border-green-100 text-kirana-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <MapPin size={40} className="animate-bounce" />
            </div>
            <h2 className="text-3xl font-black mb-3 font-display tracking-tight text-gray-900">Find stores near you</h2>
            <p className="text-gray-500 mb-8 text-sm max-w-xs mx-auto">We'll filter the network to show authentic hyper-local kirana stores within 2km.</p>
            <motion.button
              whileHover={{scale:1.05}} whileTap={{scale:0.95}}
              onClick={handleDetectLocation}
              className="bg-kirana-green text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-900/20"
            >
              Allow Location Access
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="flex items-center gap-2 text-sm text-kirana-green font-bold mb-8 bg-green-50/80 w-fit px-4 py-2 rounded-xl border border-green-200/50 shadow-sm backdrop-blur-sm">
              <MapPin size={16} /> Bengaluru, Karnataka
            </div>
            
            <h2 className="text-3xl font-display font-black mb-6 tracking-tight">Nearby Stores</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse shadow-sm"></div>)}
              </div>
            ) : stores.length === 0 ? (
               <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
                  <p className="text-4xl mb-4 text-gray-300">🏪</p>
                  <p className="text-gray-500 font-medium text-sm px-8">No stores have registered in your area yet. Check back soon!</p>
               </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                {stores.map((store) => (
                  <motion.div variants={itemVariants} key={store.id}>
                    <StoreCard
                      store={store}
                      onClick={() => navigate(`/store/${store.id}`)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
