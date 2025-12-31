import React, { useState, useEffect, useCallback } from 'react';
import NewYearHeader from './components/NewYearHeader';
import ShareButtons from './components/ShareButtons';
import Gallery from './components/Gallery';
import { generateNewYearImage } from './services/geminiService';
import { apiService } from './services/apiService';
import { AppStatus, GalleryItem } from './types';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [nickname, setNickname] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);

  const loadGallery = useCallback(async () => {
    try {
      const items = await apiService.getGallery();
      setGalleryItems(items);
    } catch (err) {
      console.error('Failed to load gallery', err);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setStatus(AppStatus.GENERATING);
    setError(null);
    setHasPosted(false);
    try {
      const url = await generateNewYearImage(userInput);
      setGeneratedUrl(url);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '画像の生成中にエラーが発生しました。時間を置いて再度お試しください。');
      setStatus(AppStatus.ERROR);
    }
  };

  const handlePost = async () => {
    if (!generatedUrl || !nickname.trim() || !userInput.trim()) return;

    setIsPosting(true);
    try {
      await apiService.postWork({
        imageUrl: generatedUrl,
        prompt: userInput,
        nickname: nickname,
      });
      setHasPosted(true);
      await loadGallery();
    } catch (err) {
      console.error(err);
      alert('投稿に失敗しました。');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf2] bg-newyear-pattern flex flex-col pb-20 text-slate-900">
      <NewYearHeader />

      <main className="max-w-2xl mx-auto w-full px-4 flex-grow space-y-12">
        <section className="bg-white p-6 rounded-2xl shadow-xl border border-red-100 ring-1 ring-black/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userInput" className="block text-slate-900 font-bold mb-2 text-base">
                「お正月 × ○○」を入力してください
              </label>
              <div className="relative">
                <input
                  id="userInput"
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="例: 富士山と龍、招き猫、家族団らん..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-red-100 bg-white text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all shadow-inner"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  disabled={status === AppStatus.GENERATING}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                  🎍
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                お正月をモチーフにした画像が生成されます。力作は是非シェアしてください！
              </p>
            </div>

            <button
              type="submit"
              disabled={status === AppStatus.GENERATING || !userInput.trim()}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all shadow-md flex items-center justify-center gap-3 ${
                status === AppStatus.GENERATING
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-red-700 hover:bg-red-800 text-white active:scale-[0.98]'
              }`}
            >
              {status === AppStatus.GENERATING ? (
                <><span className="animate-spin text-xl">⏳</span> 生成中...</>
              ) : (
                <>縁起物を描く</>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          {status === AppStatus.SUCCESS && generatedUrl && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative group p-1 bg-gradient-to-tr from-yellow-500 via-red-600 to-yellow-500 rounded-xl">
                <img
                  src={generatedUrl}
                  alt="Generated New Year Art"
                  className="relative rounded-lg shadow-2xl w-full aspect-square object-cover border-2 border-white"
                />
              </div>

              {!hasPosted ? (
                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                  <h3 className="text-red-800 font-bold text-sm mb-3 flex items-center gap-2">
                    <span>✨</span> 作品をみんなの広場に投稿する
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ニックネーム"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="flex-grow px-3 py-2 text-sm rounded border border-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white text-gray-900"
                    />
                    <button
                      onClick={handlePost}
                      disabled={!nickname.trim() || isPosting}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold disabled:opacity-50 transition-colors"
                    >
                      {isPosting ? '投稿中...' : '投稿する'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-green-700 text-sm font-bold text-center animate-bounce">
                  🎉 投稿しました！広場を確認してみてね
                </div>
              )}
              
              <ShareButtons imageUrl={generatedUrl} />
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <span className="text-red-600 text-3xl">🪭</span>
              新春・作品広場
            </h2>
            <button 
              onClick={loadGallery}
              className="text-xs text-red-600 hover:underline font-bold"
            >
              更新する ↻
            </button>
          </div>
          
          <Gallery items={galleryItems} />
        </section>

        <div className="text-center text-slate-500 text-xs md:text-sm">
          <p>© KatsuNagAI Project</p>
          <p className="mt-2">AIが生成する画像は若干時間がかかります。餅でも食べながらお待ち下さい。>Ap>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#fcfaf2] to-transparent pointer-events-none flex items-end justify-between px-4 pb-2 z-[-1]">
          <span className="text-2xl opacity-20">🎍</span>
          <span className="text-2xl opacity-20">🌅</span>
          <span className="text-2xl opacity-20">🎍</span>
      </footer>
    </div>
  );
};

export default App;
