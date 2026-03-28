import { Plus, Minus } from "lucide-react";

export default function ProductCard({ product, onAdd, onRemove, cartQty }) {
  return (
    <div className="bg-white rounded-2xl p-3 border border-gray-100 flex flex-col justify-between shadow-sm card-hover hover:border-kirana-green/30">
      <div className="mb-2">
        <div className="text-5xl mb-3 text-center bg-gray-50/80 py-6 rounded-xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           {product.image}
        </div>
        <h4 className="font-bold text-sm leading-tight mb-1 text-gray-800 line-clamp-2">{product.name}</h4>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{product.category.replace('_', ' ')}</p>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span className="font-display font-bold text-lg text-kirana-green">₹{product.price}</span>
        
        {cartQty === 0 ? (
          <button 
            onClick={onAdd}
            className="bg-kirana-green text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-kirana-light transition shadow-sm"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-kirana-accent/10 px-2 py-1.5 rounded-lg border border-kirana-accent/20">
            <button onClick={onRemove} className="text-kirana-accent p-1 cursor-pointer">
              <Minus size={14} strokeWidth={3} />
            </button>
            <span className="font-bold text-sm min-w-[1.5ch] text-center text-kirana-accent">{cartQty}</span>
            <button onClick={onAdd} className="text-kirana-accent p-1 cursor-pointer">
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
