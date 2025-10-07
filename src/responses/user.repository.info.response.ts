
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
  has_anonymous_profile_picture?: boolean;
  is_business?: boolean;
  biography?: string;
  external_url?: string;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
}
