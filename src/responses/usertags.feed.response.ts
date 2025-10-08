export interface UsertagsFeedResponseRootObject {
  auto_load_more_enabled: boolean;
  items: UsertagsFeedResponseItemsItem[];
  num_results: number;
  status: string;
  more_available: boolean;
  next_max_id?: string;
}

export interface UsertagsFeedResponseItemsItem {
  taken_at: number;
  pk: string;
  id: string;
  device_timestamp: number;
  media_type: number;
  code: string;
  client_cache_key: string;
  filter_type: number;
  image_versions2?: {
    candidates: Array<{
      width: number;
      height: number;
      url: string;
    }>;
  };
  original_width?: number;
  original_height?: number;
  user: {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    is_verified: boolean;
  };
  usertags?: {
    in: Array<{
      user: {
        pk: number;
        username: string;
        full_name: string;
        is_private: boolean;
        profile_pic_url: string;
      };
      position: number[];
    }>;
  };
}
