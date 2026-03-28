import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const staggers = { show: { transition: { staggerChildren: 0.05 } } };
const variant = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function StorePage({ cart }) {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, prodsRes] = await Promise.all([
          axios.get("/api/stores"),
          axios.get(`/api/stores/${storeId}/products`)
        ]);
        const currentStore = storesRes.data.find(s => s.id === storeId);
        setStore(currentStore);
        setAllProducts(prodsRes.data);
        setDisplayedProducts(prodsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching store data", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setDisplayedProducts(allProducts);
      return;
    }
    const lowerQ = q.toLowerCase();
    const filtered = allProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQ) || 
      p.category.toLowerCase().includes(lowerQ)
    );
    setDisplayedProducts(filtered);
  };

  return (
    <div className="bg-kirana-surface min-h-screen pb-20">
      <Navbar cart={cart} showBack />
      
      {loading ? (
        <div className="max-w-xl mx-auto px-4 py-8 space-y-4 animate-pulse">
           <div className="h-24 bg-white rounded-3xl border border-gray-100"></div>
           <div className="h-12 bg-white rounded-xl border border-gray-100"></div>
           <div className="grid grid-cols-2 gap-4"><div className="h-48 bg-white rounded-3xl"></div><div className="h-48 bg-white rounded-3xl"></div></div>
        </div>
      ) : (
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-xl mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl p-6 mb-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-kirana-green/5 rounded-full -z-0 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-display font-black text-gray-900 mb-1">{store?.name}</h1>
              <p className="text-sm text-gray-500 font-medium">{store?.owner} · {store?.deliveryTime} delivery</p>
            </div>
          </div>

          <div className="relative mb-8 shadow-sm rounded-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
               <Search size={20} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search store inventory..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-kirana-green focus:ring-4 focus:ring-kirana-green/10 focus:outline-none transition-all text-sm font-medium"
            />
          </div>

          <p className="text-sm font-bold text-gray-800 mb-4">{displayedProducts.length} Items found</p>

          <AnimatePresence>
             {displayedProducts.length > 0 ? (
                <motion.div variants={staggers} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {displayedProducts.map((product) => (
                    <motion.div key={product.id} variants={variant} layoutId={product.id}>
                      <ProductCard
                        product={product}
                        onAdd={() => cart.addToCart({...product, storeId})}
                        cartQty={cart.cart.find((i) => i.id === product.id)?.qty || 0}
                        onRemove={() => cart.removeFromCart(product.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
             ) : (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-4">
                  <p className="text-4xl mb-3">🤔</p>
                  <p className="text-gray-500 font-medium text-sm">No products found for "{searchQuery}"</p>
                </motion.div>
             )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
