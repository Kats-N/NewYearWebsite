
import React from 'react';
import { GalleryItem } from '../types';

interface GalleryProps {
  items: GalleryItem[];
}

const Gallery: React.FC<GalleryProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-red-100">
        <p className="text-slate-400 italic">まだ投稿がありません。<br/>最初の福を投稿してみませんか？</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="bg-white rounded-xl shadow-sm border border-red-50 overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="aspect-square relative group">
            <img 
              src={item.imageUrl} 
              alt={item.prompt} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
              <p className="text-white text-[10px] md:text-xs text-center line-clamp-3">
                {item.prompt}
              </p>
            </div>
          </div>
          <div className="p-2 md:p-3 bg-gradient-to-b from-white to-red-50/30">
            <p className="text-[10px] text-red-600 font-bold truncate">#{item.prompt}</p>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
              <span className="text-[10px] text-slate-400">by</span> 
              <span className="font-medium truncate">{item.nickname}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
