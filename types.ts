
export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  nickname: string;
  createdAt: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
