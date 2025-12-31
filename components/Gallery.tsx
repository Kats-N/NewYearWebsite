
import React, { useState, useEffect, useMemo } from 'react';
import { GalleryItem } from '../types';

interface GalleryProps {
  items: GalleryItem[];
}

const Gallery: React.FC<GalleryProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // 渡されたアイテムの中からランダムに10件を抽出する
  // useMemoを使うことで、再レンダリングのたびに画像がチカチカ入れ替わるのを防ぎます
  const displayItems = useMemo(() => {
    if (items.length === 0) return [];
    return [...items]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
  }, [items]);

  const handleDownload = (imageUrl: string, prompt: string) => {
    // 外部URL(Firebase Storage)からのダウンロードをトリガー
    // 注: StorageのCORS設定が必要な場合があります。
    // fetchを使うことで確実に別名保存を促します。
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `newyear-art-${prompt.substring(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        // フォールバック: 直接リンクを開く
        window.open(imageUrl, '_blank');
      });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-red-100">
        <p className="text-slate-400 italic">まだ投稿がありません。<br/>最初の福を投稿してみませんか？</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-xl shadow-sm border border-red-50 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-zoom-in"
            onClick={() => setSelectedItem(item)}
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
                  クリックで拡大表示
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

      <p className="text-center text-[10px] text-slate-400 mt-4 italic">
        ※広場にはランダムで10件表示されています。「更新」で他の作品も見られます。
      </p>

      {/* 拡大表示モーダル */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>
            
            <img 
              src={selectedItem.imageUrl} 
              alt={selectedItem.prompt} 
              className="w-full aspect-square object-cover"
            />
            
            <div className="p-6 bg-white space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-red-700 font-bold text-lg leading-tight">
                    #{selectedItem.prompt}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    作品制作者: <span className="font-bold text-slate-800">{selectedItem.nickname}</span>
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(selectedItem.createdAt).toLocaleDateString('ja-JP')}
                </div>
              </div>

              <button
                onClick={() => handleDownload(selectedItem.imageUrl, selectedItem.prompt)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                この作品を保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
