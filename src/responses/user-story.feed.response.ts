
export interface UserStoryFeedResponseRootObject {
  reel: any;
  status: string;
}

export interface UserStoryFeedResponseItemsItem {
  taken_at: number;
  pk: string;
  id: string;
  device_timestamp: number;
  media_type: number;
  code: string;
  user: any;
}
