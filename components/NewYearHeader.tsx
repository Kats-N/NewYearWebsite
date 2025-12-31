
import React from 'react';

const NewYearHeader: React.FC = () => {
  return (
    <header className="text-center py-10 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
         {/* Simple Sakura Decoration (rendered via CSS in index.html, but we can add more here if needed) */}
      </div>
      
      <div className="relative z-10 space-y-4">
        <h2 className="text-red-700 font-bold tracking-[0.5em] text-lg md:text-xl">二〇二六年</h2>
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-widest japanese-border inline-block px-8 py-4 bg-white/80">
          謹賀新年
        </h1>
        
        <div className="max-w-xl mx-auto mt-6">
          <p className="text-slate-600 leading-relaxed text-sm md:text-base px-2">
            明けましておめでとうございます。<br />
            輝かしい新春を迎え、皆様のご健康とご多幸を<br />
            心よりお祈り申し上げます。<br />
            本年もどうぞよろしくお願いいたします。<br /><br />
            ながい かつとし
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <div className="w-16 h-[2px] bg-red-700"></div>
        <div className="mx-4 text-red-700">◆</div>
        <div className="w-16 h-[2px] bg-red-700"></div>
      </div>
    </header>
  );
};

export default NewYearHeader;
