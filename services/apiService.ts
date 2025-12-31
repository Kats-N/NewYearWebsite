
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { GalleryItem } from '../types';

// 環境変数から設定を読み込みます
const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID
  };

// Firebase の初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const apiService = {
  async postWork(item: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
    try {
      const fileName = `gallery/${Date.now()}.png`;
      const storageRef = ref(storage, fileName);
      
      await uploadString(storageRef, item.imageUrl, 'data_url');
      const publicUrl = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(db, "gallery"), {
        imageUrl: publicUrl,
        prompt: item.prompt,
        nickname: item.nickname,
        createdAt: Date.now(),
      });

      return {
        id: docRef.id,
        imageUrl: publicUrl,
        prompt: item.prompt,
        nickname: item.nickname,
        createdAt: Date.now(),
      };
    } catch (error: any) {
      console.error("Firebase Post Error:", error);
      throw new Error(`投稿に失敗しました: ${error.message}`);
    }
  },

  async getGallery(): Promise<GalleryItem[]> {
    try {
      // ランダム表示の母数を増やすため取得件数を60件に拡大
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"), limit(60));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<GalleryItem, 'id'>)
      }));
    } catch (error) {
      console.error('Gallery Fetch Error:', error);
      return [];
    }
  }
};
