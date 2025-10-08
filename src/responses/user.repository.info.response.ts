export interface UserRepositoryInfoResponseRootObject {
  user: UserRepositoryInfoResponseUser;
  status: string;
}

export interface UserRepositoryInfoResponseUser {
  pk: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  profile_pic_id?: string;
  is_verified: boolean;
  has_anonymous_profile_picture: boolean;
  media_count: number;
  follower_count: number;
  following_count: number;
  biography?: string;
  external_url?: string;
  usertags_count?: number;
  has_biography_translation?: boolean;
  biography_with_entities?: UserRepositoryInfoResponseBiography_with_entities;
  hd_profile_pic_versions?: UserRepositoryInfoResponseHdProfilePicVersionsItem[];
  hd_profile_pic_url_info?: UserRepositoryInfoResponseHd_profile_pic_url_info;
  mutual_followers_count?: number;
  profile_context?: string;
  profile_context_links_with_user_ids?: any[];
  latest_reel_media?: number;
  is_favorite?: boolean;
}

export interface UserRepositoryInfoResponseBiography_with_entities {
  raw_text: string;
  entities: any[];
}

export interface UserRepositoryInfoResponseHdProfilePicVersionsItem {
  width: number;
  height: number;
  url: string;
}

export interface UserRepositoryInfoResponseHd_profile_pic_url_info {
  url: string;
  width: number;
  height: number;
}
