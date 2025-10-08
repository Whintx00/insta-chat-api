export interface UploadRepositoryVideoResponseRootObject {
  upload_id: string;
  video_upload_urls: UploadRepositoryVideoResponseVideoUploadUrl[];
  xsharing_nonces: UploadRepositoryVideoResponseXsharingNonces;
  status: string;
}

export interface UploadRepositoryVideoResponseVideoUploadUrl {
  url: string;
  job: string;
  expires: number;
}

export interface UploadRepositoryVideoResponseXsharingNonces {}
