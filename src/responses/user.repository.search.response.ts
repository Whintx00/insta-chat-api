
export interface UserRepositorySearchResponseRootObject {
  num_results: number;
  users: UserRepositorySearchResponseUsersItem[];
  has_more: boolean;
  status: string;
}

export interface UserRepositorySearchResponseUsersItem {
  pk: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  profile_pic_id?: string;
  is_verified: boolean;
  has_anonymous_profile_picture?: boolean;
}
