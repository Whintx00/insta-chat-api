export interface UploadRepositoryVideoResponseRootObject {
  status: string;
  upload_id: string;
  video?: {
    video_url: string;
    thumbnail_url?: string;
  };
}
