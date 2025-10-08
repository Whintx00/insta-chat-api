export interface UserFeedResponseRootObject {
  items: UserFeedResponseItemsItem[];
  num_results: number;
  more_available: boolean;
  next_max_id: string;
  auto_load_more_enabled: boolean;
  status: string;
}

export interface UserFeedResponseItemsItem {
  taken_at: number;
  pk: string;
  id: string;
  device_timestamp: number | string;
  media_type: number;
  code: string;
  client_cache_key: string;
  filter_type: number;
  image_versions2?: UserFeedResponseImage_versions2;
  original_width?: number;
  original_height?: number;
  user: UserFeedResponseUser;
  can_viewer_reshare: boolean;
  caption_is_edited: boolean;
  comment_likes_enabled: boolean;
  comment_threading_enabled: boolean;
  has_more_comments: boolean;
  max_num_visible_preview_comments: number;
  preview_comments: UserFeedResponsePreviewCommentsItem[];
  can_view_more_preview_comments: boolean;
  comment_count: number;
  like_count: number;
  has_liked: boolean;
  photo_of_you: boolean;
  caption?: UserFeedResponseCaption;
  can_viewer_save: boolean;
  organic_tracking_token: string;
  is_dash_eligible?: number;
  video_dash_manifest?: string;
  video_codec?: string;
  number_of_qualities?: number;
  video_versions?: UserFeedResponseVideoVersionsItem[];
  has_audio?: boolean;
  video_duration?: number;
  view_count?: number;
  carousel_media_count?: number;
  carousel_media?: UserFeedResponseCarouselMediaItem[];
  location?: UserFeedResponseLocation;
  lat?: number;
  lng?: number;
  usertags?: UserFeedResponseUsertags;
}

export interface UserFeedResponseImage_versions2 {
  candidates: UserFeedResponseCandidatesItem[];
}

export interface UserFeedResponseCandidatesItem {
  width: number;
  height: number;
  url: string;
}

export interface UserFeedResponseUser {
  pk: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  profile_pic_id?: string;
  friendship_status?: UserFeedResponseFriendship_status;
  is_verified: boolean;
  has_anonymous_profile_picture?: boolean;
}

export interface UserFeedResponseFriendship_status {
  following: boolean;
  outgoing_request: boolean;
  is_bestie: boolean;
  is_restricted: boolean;
}

export interface UserFeedResponsePreviewCommentsItem {
  pk: string;
  user_id: number;
  text: string;
  type: number;
  created_at: number;
  created_at_utc: number;
  content_type: string;
  status: string;
  bit_flags: number;
  user: UserFeedResponseUser;
  did_report_as_spam: boolean;
  share_enabled: boolean;
  media_id: string;
  has_translation?: boolean;
}

export interface UserFeedResponseCaption {
  pk: string;
  user_id: number;
  text: string;
  type: number;
  created_at: number;
  created_at_utc: number;
  content_type: string;
  status: string;
  bit_flags: number;
  user: UserFeedResponseUser;
  did_report_as_spam: boolean;
  share_enabled: boolean;
  media_id: string;
  has_translation?: boolean;
}

export interface UserFeedResponseVideoVersionsItem {
  type: number;
  width: number;
  height: number;
  url: string;
  id: string;
}

export interface UserFeedResponseCarouselMediaItem {
  id: string;
  media_type: number;
  image_versions2: UserFeedResponseImage_versions2;
  original_width: number;
  original_height: number;
  pk: string;
  carousel_parent_id: string;
  usertags?: UserFeedResponseUsertags;
  video_versions?: UserFeedResponseVideoVersionsItem[];
  video_duration?: number;
}

export interface UserFeedResponseLocation {
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

export interface UserFeedResponseUsertags {
  in: UserFeedResponseInItem[];
}

export interface UserFeedResponseInItem {
  user: UserFeedResponseUser;
  position: number[];
  start_time_in_video_in_sec: null;
  duration_in_video_in_sec: null;
}
