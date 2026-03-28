import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Store, Package, Clock, CheckCircle, RefreshCcw, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIAnalyticsCard from "../components/AIAnalyticsCard";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function VendorDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [storeForm, setStoreForm] = useState({ name: "", address: "" });
  const [productForm, setProductForm] = useState({ name: "", price: "", category: "grocery", image: "🛒", stock: 10 });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await axios.get("/api/vendor/store");
        if (res.data) setStore(res.data);
      } catch (e) {
        console.error("No store found");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  const fetchDashboardData = async () => {
    if (!store) return;
    try {
      const [ordRes, prodRes] = await Promise.all([
        axios.get(`/api/orders/${store.id}`),
        axios.get(`/api/stores/${store.id}/products`)
      ]);
      setOrders(ordRes.data);
      setProducts(prodRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (store) fetchDashboardData();
    const interval = store ? setInterval(fetchDashboardData, 30000) : null;
    return () => clearInterval(interval);
  }, [store]);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/stores", {
        name: storeForm.name,
        address: storeForm.address,
        owner: user.name,
        distance: "Nearby",
        rating: 5.0,
        deliveryTime: "Soon",
        tags: ["Grocery"]
      });
      setStore(res.data);
    } catch (e) {
      alert("Failed to create store");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/stores/${store.id}/products`, productForm);
      setIsAddingProduct(false);
      fetchDashboardData();
    } catch (e) {
      alert("Failed to add product");
    }
  };

  const updateStatus = async (orderId, status) => {
    await axios.patch(`/api/orders/${orderId}`, { status });
    fetchDashboardData();
  };

  if (loading) return <div className="min-h-screen bg-kirana-surface flex items-center justify-center font-bold text-kirana-green">Loading Dashboard...</div>;

  if (!store) {
    return (
      <div className="bg-kirana-surface min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20">
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="glass-panel p-8 rounded-3xl border border-white/60 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-kirana-green/10 rounded-full blur-2xl"></div>

            <h2 className="text-3xl font-display font-black mb-2 leading-tight">Create Your<br/><span className="text-kirana-accent">Digital Store</span></h2>
            <p className="text-gray-500 mb-8 text-sm font-medium">You need to set up a profile before customers can place orders.</p>

            <form onSubmit={handleCreateStore} className="space-y-4 relative z-10">
              <input required type="text" placeholder="Store Name (e.g. Sharma General)" 
                value={storeForm.name} onChange={e=>setStoreForm({...storeForm, name: e.target.value})}
                className="w-full bg-white border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-kirana-green/20 focus:border-kirana-green outline-none transition" />
              <input required type="text" placeholder="Full Address" 
                value={storeForm.address} onChange={e=>setStoreForm({...storeForm, address: e.target.value})}
                className="w-full bg-white border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-kirana-green/20 focus:border-kirana-green outline-none transition" />

              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} className="w-full bg-kirana-green text-white font-bold py-4 rounded-xl shadow-lg mt-4 shadow-green-900/20">
                Setup Store Profile
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  const pending = orders.filter(o => o.status === 'pending');

  return (
    <div className="bg-kirana-surface min-h-screen pb-20">
      <nav className="bg-white p-4 sticky top-0 z-50 shadow-sm border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-kirana-green/10 text-kirana-green p-2 rounded-xl"><Store size={24} /></div>
          <div>
            <h1 className="font-display font-black text-gray-900 leading-tight">{store.name}</h1>
            <p className="text-[10px] text-kirana-green font-bold flex items-center gap-1 uppercase tracking-widest"><span className="w-2 h-2 bg-kirana-green/80 rounded-full animate-pulse"></span> {user.name} (LIVE)</p>
          </div>
        </div>
        <button onClick={logout} className="text-xs text-red-500 font-bold border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition">Logout</button>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8">
        <AIAnalyticsCard storeId={store.id} />

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white rounded-3xl p-5 border border-yellow-200 shadow-sm overflow-hidden text-center relative pointer-events-none">
            <div className="absolute -left-5 -bottom-5"><Clock size={80} className="text-yellow-50 opacity-50"/></div>
            <div className="text-yellow-500 font-black text-5xl mb-1 relative z-10">{pending.length}</div>
            <div className="text-xs font-bold text-yellow-600 uppercase tracking-widest relative z-10">Pending</div>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-green-200 shadow-sm overflow-hidden text-center relative pointer-events-none">
            <div className="absolute -right-5 -bottom-5"><Package size={80} className="text-green-50 opacity-50"/></div>
            <div className="text-kirana-green font-black text-5xl mb-1 relative z-10">{products.length}</div>
            <div className="text-xs font-bold text-kirana-green uppercase tracking-widest relative z-10">Products</div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-2">
            <h2 className="text-2xl font-display font-black tracking-tight">Inventory</h2>
            <button onClick={() => setIsAddingProduct(!isAddingProduct)} className={`text-sm font-bold flex items-center gap-1 rounded-lg px-3 py-1.5 transition ${isAddingProduct ? 'bg-gray-100 text-gray-600' : 'bg-kirana-green text-white shadow-sm'}`}>
              <Plus size={16}/> {isAddingProduct ? 'Cancel' : 'Add Product'}
            </button>
          </div>
          
          <AnimatePresence>
            {isAddingProduct && (
              <motion.form initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} onSubmit={handleCreateProduct} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm mb-6 space-y-3 overflow-hidden">
                <input type="text" required placeholder="Product Name (e.g. Lay's Classic)" value={productForm.name} onChange={e=>setProductForm({...productForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-medium focus:ring-2 focus:ring-kirana-green/20 outline-none transition text-sm"/>
                <div className="flex gap-3">
                  <input type="number" required placeholder="Price (₹)" value={productForm.price} onChange={e=>setProductForm({...productForm, price: e.target.value})} className="w-1/2 bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-medium focus:ring-2 focus:ring-kirana-green/20 outline-none transition text-sm"/>
                  <input type="text" required placeholder="Emoji Image (e.g. 🥛)" value={productForm.image} onChange={e=>setProductForm({...productForm, image: e.target.value})} className="w-1/2 bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-medium focus:ring-2 focus:ring-kirana-green/20 outline-none transition text-sm"/>
                </div>
                <motion.button whileTap={{scale:0.98}} className="w-full bg-kirana-green text-white font-bold p-3.5 rounded-xl mt-2 shadow-sm">Publish to Store</motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {products.map(p => (
              <div key={p.id} className="min-w-[120px] bg-white p-3 rounded-2xl border border-gray-100 flex-shrink-0 snap-start shadow-sm hover:border-kirana-green/30 transition">
                <div className="text-4xl text-center bg-gray-50/80 rounded-xl py-3 mb-2">{p.image}</div>
                <p className="font-bold text-xs truncate mb-1 text-gray-800">{p.name}</p>
                <p className="text-kirana-green font-display font-black text-sm">₹{p.price}</p>
              </div>
            ))}
            {products.length === 0 && <p className="text-gray-400 text-sm italic py-4">Your store is empty. Add a product to get started!</p>}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-display font-black tracking-tight mb-4 border-b border-gray-200 pb-2">Live Orders</h2>
          
          {orders.length === 0 ? (
            <div className="bg-white border text-center py-10 rounded-3xl border-gray-100 shadow-sm">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium text-sm">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <motion.div layout key={order.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-2 h-full ${order.status === 'pending' ? 'bg-yellow-400' : order.status === 'accepted' ? 'bg-blue-400' : 'bg-kirana-light'}`}></div>
                  
                  <div className="flex justify-between items-start mb-4 ml-2">
                    <div>
                      <p className="font-bold text-lg text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500 font-mono tracking-tight bg-gray-50 px-2 py-0.5 rounded-md inline-block border border-gray-100 mt-1">{order.customerPhone}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wider border
                      ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                        order.status === 'accepted' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-green-50 text-kirana-green border-green-200'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="bg-gray-50/80 rounded-2xl p-4 mb-4 ml-2 text-sm text-gray-700 border border-gray-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-200 border-dashed pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                        <span className="font-medium"><span className="text-gray-400 mr-2 text-xs">x{item.qty}</span>{item.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center ml-2 pt-2 border-t border-gray-50">
                    <p className="font-display font-black text-2xl text-kirana-green">₹{order.total}</p>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => updateStatus(order.id, 'accepted')} className="bg-kirana-green text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md">Accept Order</motion.button>
                      )}
                      {order.status === 'accepted' && (
                        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => updateStatus(order.id, 'delivered')} className="bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md">Mark Delivered</motion.button>
                      )}
                      {order.status === 'delivered' && (
                        <span className="text-kirana-light font-bold text-sm flex items-center gap-1"><CheckCircle size={16}/> Completed</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
