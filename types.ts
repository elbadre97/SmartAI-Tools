export type ToolType = 'text' | 'image' | 'summary' | 'translate' | 'email' | 'code' | 'long_video_script' | 'short_video_script' | 'image_bg_remover' | 'video_bg_remover' | 'video_downloader' | 'file_converter' | 'file_compressor';
export type Language = 'ar' | 'en';
export type CategoryType = 'content' | 'visuals' | 'productivity' | 'development';
export type InputType = 'text' | 'image' | 'file';

export type LocalizedString = Record<Language, string>;

export interface User {
  name: LocalizedString;
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