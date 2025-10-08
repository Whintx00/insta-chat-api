export interface UserStoryFeedResponseRootObject {
  reel: {
    id: string;
    items: UserStoryFeedResponseItemsItem[];
    can_reply: boolean;
    can_reshare: boolean;
  };
  status: string;
}

export interface UserStoryFeedResponseItemsItem {
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
  caption?: {
    text: string;
  };
  story_is_saved_to_archive?: boolean;
  story_cta?: Array<any>;
}
