
export interface UserFeedResponse {
  items: UserFeedResponseItemsItem[];
  num_results: number;
  more_available: boolean;
  auto_load_more_enabled: boolean;
  status: string;
  next_max_id?: string;
}

export interface UserFeedResponseItemsItem {
  taken_at: number;
  pk: string;
  id: string;
  device_timestamp: number;
  media_type: number;
  code: string;
  client_cache_key: string;
  filter_type: number;
  user: any;
  caption?: any;
  image_versions2?: any;
  original_width?: number;
  original_height?: number;
  like_count?: number;
  has_liked?: boolean;
  comment_count?: number;
}
