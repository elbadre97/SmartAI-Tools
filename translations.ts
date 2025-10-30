import type { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    header_title: "SmartAI Tools",
    lang_toggle: "EN",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",

    // Main Title
    main_title: "🚀 منصة الذكاء الاصطناعي المتكاملة",
    main_subtitle: "اختر الأداة المناسبة وابدأ في إنشاء محتوى مذهل",
    
    // Tool Interface
    close: "إغلاق",
    char_count: "حرف",
    clear_all: "مسح الكل",
    generate: "توليد",
    copy_input: "نسخ الإدخال",
    paste: "لصق",
    result: "النتيجة:",
    copy_result: "نسخ",
    save: "حفظ",
    share: "مشاركة",
    input_required_error: "يرجى إدخال نص أولاً!",
    image_required_error: "يرجى رفع صورة أولاً!",
    invalid_file_type: "نوع الملف غير صالح. يرجى اختيار صورة.",
    share_not_supported: "المشاركة غير مدعومة في هذا المتصفح.",
    api_error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
    supported_formats: "الصيغ المدعومة",
    image_preview: "معاينة الصورة",
    generated_ai_alt: "صورة تم إنشاؤها بواسطة الذكاء الاصطناعي",

    // Stats
    stats_tools: "أدوات ذكية",
    stats_categories: "فئات متخصصة",
    stats_accuracy: "نتائج دقيقة",
    stats_availability: "متاح دائماً",

    // Footer
    footer_copyright: `© ${new Date().getFullYear()} SmartAI Tools. جميع الحقوق محفوظة.`,
    footer_subtitle: "منصة الذكاء الاصطناعي الشاملة لجميع احتياجاتك",
  },
  en: {
    // Header
    header_title: "SmartAI Tools",
    lang_toggle: "AR",
    login: "Login",
    logout: "Logout",

    // Main Title
    main_title: "🚀 The All-in-One AI Platform",
    main_subtitle: "Choose the right tool and start creating amazing content",
    
    // Tool Interface
    close: "Close",
    char_count: "characters",
    clear_all: "Clear All",
    generate: "Generate",
    copy_input: "Copy Input",
    paste: "Paste",
    result: "Result:",
    copy_result: "Copy",
    save: "Save",
    share: "Share",
    input_required_error: "Please enter some text first!",
    image_required_error: "Please upload an image first!",
    invalid_file_type: "Invalid file type. Please select an image.",
    share_not_supported: "Sharing is not supported in this browser.",
    api_error: "An error occurred while contacting the AI. Please try again.",
    supported_formats: "Supported formats",
    image_preview: "Image Preview",
    generated_ai_alt: "AI-generated image",

    // Stats
    stats_tools: "Smart Tools",
    stats_categories: "Specialized Categories",
    stats_accuracy: "Accurate Results",
    stats_availability: "Always Available",

    // Footer
    footer_copyright: `© ${new Date().getFullYear()} SmartAI Tools. All rights reserved.`,
    footer_subtitle: "The comprehensive AI platform for all your needs",
  }
};
