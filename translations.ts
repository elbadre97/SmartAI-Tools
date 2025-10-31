import type { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    header_title: 'الأدوات الذكية',
    nav_home: 'الرئيسية',
    nav_tools: 'الأدوات',
    nav_features: 'المزايا',
    lang_toggle: 'EN',

    // Main Content
    main_title: 'منصّتكم المتكاملة لأدوات الذكاء الاصطناعي',
    main_subtitle: 'أطلق العنان لقدراتك الإبداعية والإنتاجية باستخدام أحدث تقنيات الذكاء الاصطناعي.',

    // Stats
    stats_tools: 'أداة متاحة',
    stats_categories: 'فئة رئيسية',
    stats_accuracy: 'مستوى الدقة',
    stats_availability: 'إتاحة الخدمة',
    
    // Tool Interface
    generate_button: 'توليد',
    extract_text_button: 'استخراج وتحليل',
    output_placeholder: 'ستظهر النتائج هنا...',
    copy_button: 'نسخ',
    copied_button: 'تم النسخ!',
    clear_button: 'مسح',
    paste_button: 'لصق',
    download_button: 'تحميل',
    close: 'إغلاق',
    upload_file: 'اختر ملفًا',
    or_drop_file: 'أو قم بسحبه وإفلاته هنا',
    image_preview: 'معاينة الصورة:',
    file_preview: 'معاينة الملف:',
    video_preview: 'معاينة الفيديو:',
    unsupported_file: 'نوع الملف غير مدعوم',
    file_too_large: 'حجم الملف يتجاوز الحد المسموح به ({size} ميجابايت).',
    max_file_size: 'الحجم الأقصى للملف: {size} ميجابايت',
    output_summary: 'الموجز',
    output_topics: 'المواضيع المحورية',
    output_transcript: 'النص الكامل',
    json_parse_error: 'حدث خطأ أثناء معالجة النتائج. قد تكون استجابة النموذج غير صالحة.',

    // Footer
    footer_copyright: `© ${new Date().getFullYear()} الأدوات الذكية. جميع الحقوق محفوظة.`,
    footer_subtitle: 'صُنعت بحب وشغف باستخدام أحدث التقنيات 🤖',
    
    api_key_required_error: 'مفتاح API الخاص بك مطلوب. يرجى إضافته في الإعدادات.',

    // API Key Modal
    api_key_modal_title: 'إدارة مفتاح API',
    api_key_modal_subtitle: 'أدخل مفتاح Google Gemini API الخاص بك للاستفادة من وضع الاستخدام غير المحدود. يتم حفظ مفتاحك محليًا في متصفحك فقط.',
    api_key_placeholder: 'أدخل مفتاح Gemini API هنا...',
    api_key_get_yours: 'احصل على مفتاحك من Google AI Studio.',
    save_api_key: 'حفظ المفتاح',
    api_key_saved: 'تم الحفظ!',
    clear_api_key: 'إزالة المفتاح الحالي',

  },
  en: {
    // Header
    header_title: 'Smart Tools',
    nav_home: 'Home',
    nav_tools: 'Tools',
    nav_features: 'Features',
    lang_toggle: 'ع',

    // Main Content
    main_title: 'Your All-in-One AI Toolkit',
    main_subtitle: 'Boost your creativity and productivity with cutting-edge AI tools',
    
    // Stats
    stats_tools: 'Tools',
    stats_categories: 'Categories',
    stats_accuracy: 'Accuracy',
    stats_availability: 'Availability',

    // Tool Interface
    generate_button: 'Generate',
    extract_text_button: 'Extract & Analyze',
    output_placeholder: 'The result will appear here...',
    copy_button: 'Copy',
    copied_button: 'Copied!',
    clear_button: 'Clear',
    paste_button: 'Paste',
    download_button: 'Download',
    close: 'Close',
    upload_file: 'Choose a file',
    or_drop_file: 'or drag it here',
    image_preview: 'Image Preview:',
    file_preview: 'File Preview:',
    video_preview: 'Video Preview:',
    unsupported_file: 'Unsupported file type',
    file_too_large: 'File is too large. Max size is {size}MB.',
    max_file_size: 'Max file size: {size}MB',
    output_summary: 'Summary',
    output_topics: 'Key Topics',
    output_transcript: 'Full Transcript',
    json_parse_error: 'An error occurred while processing the result. The AI response might be invalid.',

    // Footer
    footer_copyright: `© ${new Date().getFullYear()} Smart Tools. All rights reserved.`,
    footer_subtitle: 'Made with ❤️ using the latest technologies 🤖',
    
    api_key_required_error: 'Your API Key is required. Please add it in the settings.',
    
    // API Key Modal
    api_key_modal_title: 'API Key Management',
    api_key_modal_subtitle: 'Enter your Google Gemini API key to use the unlimited mode. Your key is stored locally in your browser and never sent to our servers.',
    api_key_placeholder: 'Enter your Gemini API key here...',
    api_key_get_yours: 'Get your key from Google AI Studio.',
    save_api_key: 'Save Key',
    api_key_saved: 'Saved!',
    clear_api_key: 'Clear Current Key',
  },
};