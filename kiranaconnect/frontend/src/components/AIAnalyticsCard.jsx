import { useState } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";

export default function AIAnalyticsCard({ storeId }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/stores/${storeId}/analytics`);
      setInsights(res.data.insights || []);
    } catch (err) {
      setError("Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-kirana-green to-kirana-light text-white rounded-3xl p-6 shadow-xl relative overflow-hidden mb-8">
      <div className="absolute top-[-20%] right-[-10%] w-56 h-56 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400/20 rounded-xl border border-yellow-400/30 text-yellow-300">
              <Sparkles size={24} />
            </div>
            <h3 className="font-display font-bold text-xl">Gemini Shop Insights</h3>
         </div>
         <button 
           onClick={fetchAnalytics}
           disabled={loading}
           className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition disabled:opacity-50 border border-white/20 shadow-sm"
         >
           {loading ? 'Analyzing...' : insights.length ? 'Refresh' : 'Analyze Orders'}
         </button>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="space-y-4">
             <div className="h-5 bg-white/20 rounded-lg w-3/4 animate-pulse"></div>
             <div className="h-5 bg-white/20 rounded-lg w-full animate-pulse"></div>
             <div className="h-5 bg-white/20 rounded-lg w-5/6 animate-pulse"></div>
          </div>
        ) : insights.length > 0 ? (
          <ul className="space-y-3">
             {insights.map((insight, idx) => (
                <li key={idx} className="flex gap-4 items-start bg-black/10 p-4 rounded-2xl border border-white/10 text-sm font-medium shadow-inner">
                   <span className="bg-kirana-accent text-white w-7 h-7 flex items-center justify-center rounded-full shrink-0 shadow-md font-bold mt-0.5">{idx + 1}</span>
                   <span className="leading-relaxed opacity-95">{insight}</span>
                </li>
             ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-black/10 rounded-2xl border border-white/10 mt-2">
             <p className="opacity-80 text-sm font-medium max-w-xs mx-auto">Get actionable, predictive business insights based on your recent order data.</p>
          </div>
        )}
        {error && <p className="text-red-300 mt-4 text-sm font-bold bg-red-900/30 p-3 rounded-lg border border-red-500/50">{error}</p>}
      </div>
    </div>
  );
}
