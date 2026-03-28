import { Star, Clock, MapPin } from "lucide-react";

export default function StoreCard({ store, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="card-hover bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer overflow-hidden relative"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{store.name}</h3>
          <p className="text-sm text-gray-500">{store.owner}</p>
        </div>
        {store.open ? (
          <span className="bg-green-100 text-kirana-green text-xs font-bold px-2 py-1 rounded-md">OPEN</span>
        ) : (
          <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded-md">CLOSED</span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="font-semibold">{store.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{store.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{store.distance}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {store.tags?.map(tag => (
          <span key={tag} className="text-xs text-kirana-light bg-green-50 border border-green-100 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
