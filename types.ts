// FIX: Removed the circular self-import that was causing compilation errors.
// The types `ToolType`, `Language`, `CategoryType`, and `InputType` are now defined and exported from this file.
export type Language = 'ar' | 'en';

export type CategoryType = 'content' | 'visuals' | 'productivity' | 'development';

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
  | 'code';

export type InputType = 'text' | 'image' | 'file';

export type LocalizedString = Record<Language, string>;

export interface User {
  name: LocalizedString;
  email: string;
  photoURL: string;
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