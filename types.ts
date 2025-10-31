// FIX: Removed the circular self-import that was causing compilation errors.
// The types `ToolType`, `Language`, `CategoryType`, and `InputType` are now defined and exported from this file.
export type Language = 'ar' | 'en';

export type CategoryType = 'content' | 'visuals' | 'productivity' | 'development';

export type AppMode = 'trial' | 'user_api' | 'premium';

export type ToolType =
  | 'text'
  | 'long_video_script'
  | 'short_video_script'
  | 'image'
  | 'image_bg_remover'
  | 'video_bg_remover'
  | 'image_prompt_extractor'
  | 'summary'
  | 'translate'
  | 'email'
  | 'video_downloader'
  | 'file_converter'
  | 'file_compressor'
  | 'video_text_extractor'
  | 'code';

export type InputType = 'text' | 'image' | 'file';

export type LocalizedString = Record<Language, string>;

export interface User {
  uid: string;
  name: LocalizedString;
  email: string;
  photoURL: string;
  points: number;
}

export interface UserProfileData {
    points: number;
    lastPointsReset: any; // Using 'any' to accommodate Firestore Timestamp
}

export interface Category {
  id: CategoryType;
  title: LocalizedString;
  icon: string;
}

export interface Tool {
  id: ToolType;
  category: CategoryType;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  inputLabel: LocalizedString;
  placeholder: LocalizedString;
  loadingText: LocalizedString;
  inputType: InputType;
  disabled?: boolean;
}