export interface UserStoryFeedResponseRootObject {
  reel: UserStoryFeedResponseReel | null;
  status: string;
}

export interface UserStoryFeedResponseReel {
  id: number;
  latest_reel_media: number;
  expiring_at: number;
  seen: number;
  can_reply: boolean;
  can_gif_quick_reply: boolean;
  can_reshare: boolean;
  reel_type: string;
  user: UserStoryFeedResponseUser;
  items: UserStoryFeedResponseItemsItem[];
  prefetch_count: number;
  media_count: number;
  media_ids: number[];
}

export interface UserStoryFeedResponseUser {
  pk: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  profile_pic_id?: string;
  is_verified: boolean;
  has_anonymous_profile_picture?: boolean;
  friendship_status?: UserStoryFeedResponseFriendship_status;
}

export interface UserStoryFeedResponseFriendship_status {
  following: boolean;
  outgoing_request: boolean;
  is_bestie: boolean;
  is_restricted: boolean;
}

export interface UserStoryFeedResponseItemsItem {
  taken_at: number;
  pk: string;
  id: string;
  device_timestamp: number | string;
  media_type: number;
  code: string;
  client_cache_key: string;
  filter_type: number;
  image_versions2?: UserStoryFeedResponseImage_versions2;
  original_width?: number;
  original_height?: number;
  organic_tracking_token?: string;
  user: UserStoryFeedResponseUser;
  can_viewer_reshare: boolean;
  caption_is_edited: boolean;
  caption_position?: number;
  is_reel_media: boolean;
  photo_of_you: boolean;
  can_viewer_save: boolean;
  video_versions?: UserStoryFeedResponseVideoVersionsItem[];
  has_audio?: boolean;
  video_duration?: number;
  caption?: UserStoryFeedResponseCaption | null;
  story_locations?: UserStoryFeedResponseStoryLocationsItem[];
  story_hashtags?: UserStoryFeedResponseStoryHashtagsItem[];
  story_polls?: UserStoryFeedResponseStoryPollsItem[];
  story_questions?: UserStoryFeedResponseStoryQuestionsItem[];
  story_sliders?: UserStoryFeedResponseStorySlidersItem[];
  story_countdowns?: UserStoryFeedResponseStoryCountdownsItem[];
  story_quizs?: UserStoryFeedResponseStoryQuizsItem[];
  supports_reel_reactions?: boolean;
  can_send_custom_emojis?: boolean;
}

export interface UserStoryFeedResponseImage_versions2 {
  candidates: UserStoryFeedResponseCandidatesItem[];
}

export interface UserStoryFeedResponseCandidatesItem {
  width: number;
  height: number;
  url: string;
}

export interface UserStoryFeedResponseVideoVersionsItem {
  type: number;
  width: number;
  height: number;
  url: string;
  id: string;
}

export interface UserStoryFeedResponseCaption {
  pk: string;
  user_id: number;
  text: string;
  type: number;
  created_at: number;
  created_at_utc: number;
  content_type: string;
  status: string;
  bit_flags: number;
  user: UserStoryFeedResponseUser;
  did_report_as_spam: boolean;
  share_enabled: boolean;
  media_id: string;
}

export interface UserStoryFeedResponseStoryLocationsItem {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotation: number;
  is_pinned: number;
  is_hidden: number;
  location: UserStoryFeedResponseLocation;
}

export interface UserStoryFeedResponseLocation {
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

export interface UserStoryFeedResponseStoryHashtagsItem {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotation: number;
  is_pinned: number;
  is_hidden: number;
  hashtag: UserStoryFeedResponseHashtag;
}

export interface UserStoryFeedResponseHashtag {
  name: string;
  id: number;
}

export interface UserStoryFeedResponseStoryPollsItem {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotation: number;
  is_pinned: number;
  is_hidden: number;
  poll_sticker: UserStoryFeedResponsePollSticker;
}

export interface UserStoryFeedResponsePollSticker {
  id: string;
  poll_id: number;
  question: string;
  tallies: UserStoryFeedResponseTalliesItem[];
  viewer_can_vote: boolean;
  is_shared_result: boolean;
  finished: boolean;
}

export interface UserStoryFeedResponseTalliesItem {
  text: string;
  font_size: number;
  count: number;
}

export interface UserStoryFeedResponseStoryQuestionsItem {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotation: number;
  is_pinned: number;
  is_hidden: number;
  question_sticker: UserStoryFeedResponseQuestionSticker;
}

export interface UserStoryFeedResponseQuestionSticker {
  question_type: string;
  question_id: number;
  question: string;
  text_color: string;
  background_color: string;
  viewer_can_interact: boolean;
  profile_pic_url: string;
}

export interface UserStoryFeedResponseStorySlidersItem {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotation: number;
  is_pinned: number;
  is_hidden: number;
  slider_sticker: UserStoryFeedResponseSliderSticker;
}

export interface UserStoryFeedResponseSliderSticker {
  slider_id: number;
  question: string;
  emoji: string;
  text_color: string;
  background_color: string;
  viewer_can_vote: boolean;
}

export interface UserStoryFeedResponseStoryCountdownsItem {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotation: number;
  is_pinned: number;
  is_hidden: number;
  countdown_sticker: UserStoryFeedResponseCountdownSticker;
}

export interface UserStoryFeedResponseCountdownSticker {
  countdown_id: number;
  end_ts: number;
  text: string;
  text_color: string;
  start_background_color: string;
  end_background_color: string;
  digit_color: string;
  digit_card_color: string;
  is_owner: boolean;
  following_enabled: boolean;
}

export interface UserStoryFeedResponseStoryQuizsItem {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotation: number;
  is_pinned: number;
  is_hidden: number;
  quiz_sticker: UserStoryFeedResponseQuizSticker;
}

export interface UserStoryFeedResponseQuizSticker {
  id: string;
  quiz_id: number;
  question: string;
  tallies: UserStoryFeedResponseTalliesItem[];
  correct_answer: number;
  viewer_can_answer: boolean;
  finished: boolean;
  text_color: string;
  start_background_color: string;
  end_background_color: string;
}
