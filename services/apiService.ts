
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { GalleryItem } from '../types';

/**
 * 【重要】ここに Firebase コンソールで取得した設定を貼り付けてください
 * 1. Firebase コンソールの「プロジェクトの設定」をクリック
 * 2. 下の方にある「マイアプリ」の「SDK の設定と構成」から「構成」を選択
 * 3. 表示された firebaseConfig の内容をここにコピー＆ペーストします
 */
const firebaseConfig = {
    apiKey: "AIzaSyDELJYuIKb_iJWjm7GvZwmD14sIptEIHHY",
    authDomain: "newyearwesite2026.firebaseapp.com",
    projectId: "newyearwesite2026",
    storageBucket: "newyearwesite2026.firebasestorage.app",
    messagingSenderId: "756365415316",
    appId: "1:756365415316:web:c3795337bbc85e9bedb581"
  };

// Firebase の初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const apiService = {
  async postWork(item: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
    try {
      // 1. Storage に画像を保存 (data_url形式をサポート)
      const fileName = `gallery/${Date.now()}.png`;
      const storageRef = ref(storage, fileName);
      
      await uploadString(storageRef, item.imageUrl, 'data_url');
      const publicUrl = await getDownloadURL(storageRef);

      // 2. Firestore に情報を保存
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
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"), limit(30));
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
