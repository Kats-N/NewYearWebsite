
import React from 'react';

interface ShareButtonsProps {
  imageUrl: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ imageUrl }) => {
  const text = encodeURIComponent("2026年の年賀画像を生成しました！ #謹賀新年 #AI画像生成 #お正月");
  const url = encodeURIComponent(window.location.href);

  const shareOnX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLine = () => {
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, '_blank');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `newyear-2026-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-6">
      <button
        onClick={handleDownload}
        className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        画像を保存する
      </button>

      <div className="flex gap-2">
        <button
          onClick={shareOnX}
          className="flex-1 bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold hover:opacity-90"
        >
          𝕏 で共有
        </button>
        <button
          onClick={shareOnLine}
          className="flex-1 bg-[#06C755] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold hover:opacity-90"
        >
          LINEで送る
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
