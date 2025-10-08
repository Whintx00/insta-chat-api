export interface UsertagsFeedResponseRootObject {
  items: UsertagsFeedResponseItemsItem[];
  num_results: number;
  more_available: boolean;
  auto_load_more_enabled: boolean;
  next_max_id: string;
  status: string;
}

export interface UsertagsFeedResponseItemsItem {
  taken_at: number;
  pk: string;
  id: string;
  device_timestamp: number | string;
  media_type: number;
  code: string;
  client_cache_key: string;
  filter_type: number;
  user: UsertagsFeedResponseUser;
  can_viewer_reshare: boolean;
  caption: UsertagsFeedResponseCaption | null;
  caption_is_edited: boolean;
  like_count: number;
  has_liked: boolean;
  photo_of_you: boolean;
  can_viewer_save: boolean;
  organic_tracking_token: string;
  image_versions2?: UsertagsFeedResponseImage_versions2;
  original_width?: number;
  original_height?: number;
  usertags?: UsertagsFeedResponseUsertags;
  location?: UsertagsFeedResponseLocation;
  comment_count?: number;
  carousel_media_count?: number;
  carousel_media?: UsertagsFeedResponseCarouselMediaItem[];
  video_versions?: UsertagsFeedResponseVideoVersionsItem[];
  has_audio?: boolean;
  video_duration?: number;
}

export interface UsertagsFeedResponseUser {
  pk: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  profile_pic_id?: string;
  is_verified: boolean;
  has_anonymous_profile_picture?: boolean;
  friendship_status?: UsertagsFeedResponseFriendship_status;
}

export interface UsertagsFeedResponseFriendship_status {
  following: boolean;
  outgoing_request: boolean;
  is_bestie: boolean;
  is_restricted?: boolean;
}

export interface UsertagsFeedResponseCaption {
  pk: string;
  user_id: number;
  text: string;
  type: number;
  created_at: number;
  created_at_utc: number;
  content_type: string;
  status: string;
  bit_flags: number;
  user: UsertagsFeedResponseUser;
  did_report_as_spam: boolean;
  share_enabled: boolean;
  media_id: string;
}

export interface UsertagsFeedResponseImage_versions2 {
  candidates: UsertagsFeedResponseCandidatesItem[];
}

export interface UsertagsFeedResponseCandidatesItem {
  width: number;
  height: number;
  url: string;
}

export interface UsertagsFeedResponseUsertags {
  in: UsertagsFeedResponseInItem[];
}

export interface UsertagsFeedResponseInItem {
  user: UsertagsFeedResponseUser;
  position: number[];
  start_time_in_video_in_sec: null;
  duration_in_video_in_sec: null;
}

export interface UsertagsFeedResponseLocation {
  pk: number;
  name: string;
  address: string;
  city: string;
  short_name: string;
  lng: number;
  lat: number;
  external_source: string;
  facebook_places_id: number;
}

export interface UsertagsFeedResponseCarouselMediaItem {
  id: string;
  media_type: number;
  image_versions2: UsertagsFeedResponseImage_versions2;
  original_width: number;
  original_height: number;
  pk: string;
  carousel_parent_id: string;
  usertags?: UsertagsFeedResponseUsertags;
}

export interface UsertagsFeedResponseVideoVersionsItem {
  type: number;
  width: number;
  height: number;
  url: string;
  id: string;
}
