
export interface UsertagsFeedResponseRootObject {
  status: string;
  items: UsertagsFeedResponseItemsItem[];
  num_results: number;
  more_available: boolean;
  auto_load_more_enabled: boolean;
  next_max_id?: string;
}

export interface UsertagsFeedResponseItemsItem {
  taken_at: number;
  pk: string;
  id: string;
  device_timestamp: number;
  media_type: number;
  code: string;
  user: any;
  usertags?: any;
}
