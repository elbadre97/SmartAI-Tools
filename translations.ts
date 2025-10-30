
import type { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    header_title: 'أدوات ذكية',
    nav_home: 'الرئيسية',
    nav_tools: 'الأدوات',
    nav_features: 'المميزات',
    lang_toggle: 'EN',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    auth_disabled_tooltip: 'المصادقة معطلة في هذا الإصدار التجريبي',

    // Main Content
    main_title: 'مجموعة أدوات الذكاء الاصطناعي الشاملة',
    main_subtitle: 'عزز إبداعك وإنتاجيتك مع أحدث أدوات الذكاء الاصطناعي',

    // Stats
    stats_tools: 'أداة',
    stats_categories: 'فئة',
    stats_accuracy: 'دقة',
    stats_availability: 'متاح',
    
    // Tool Interface
    generate_button: 'إنشاء',
    output_placeholder: 'ستظهر النتيجة هنا...',
    copy_button: 'نسخ',
    copied_button: 'تم النسخ!',
    clear_button: 'مسح',
    paste_button: 'لصق',
    close: 'إغلاق',
    upload_file: 'اختر ملفًا',
    or_drop_file: 'أو اسحبه هنا',
    image_preview: 'معاينة الصورة:',
    file_preview: 'معاينة الملف:',
    unsupported_file: 'نوع الملف غير مدعوم',
    file_too_large: 'حجم الملف كبير جدًا. الحد الأقصى 5 ميجابايت.',

    // Footer
    footer_copyright: `© ${new Date().getFullYear()} أدوات ذكية. جميع الحقوق محفوظة.`,
    footer_subtitle: 'مصنوع بحب باستخدام أحدث التقنيات 🤖',

    // Login Modal
    login_modal_title: 'أهلاً بك',
    login_modal_subtitle: 'سجل الدخول للمتابعة وحفظ أعمالك.',
    login_with_google: 'تسجيل الدخول باستخدام جوجل',
    login_error: 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    auth_not_configured: 'خدمة المصادقة غير مهيأة حاليًا.',

  },
  en: {
    // Header
    header_title: 'Smart Tools',
    nav_home: 'Home',
    nav_tools: 'Tools',
    nav_features: 'Features',
    lang_toggle: 'ع',
    login: 'Login',
    logout: 'Logout',
    auth_disabled_tooltip: 'Authentication is disabled in this demo build',

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
    output_placeholder: 'The result will appear here...',
    copy_button: 'Copy',
    copied_button: 'Copied!',
    clear_button: 'Clear',
    paste_button: 'Paste',
    close: 'Close',
    upload_file: 'Choose a file',
    or_drop_file: 'or drag it here',
    image_preview: 'Image Preview:',
    file_preview: 'File Preview:',
    unsupported_file: 'Unsupported file type',
    file_too_large: 'File is too large. Max size is 5MB.',

    // Footer
    footer_copyright: `© ${new Date().getFullYear()} Smart Tools. All rights reserved.`,
    footer_subtitle: 'Made with ❤️ using the latest technologies 🤖',

    // Login Modal
    login_modal_title: 'Welcome',
    login_modal_subtitle: 'Sign in to continue and save your work.',
    login_with_google: 'Sign in with Google',
    login_error: 'An error occurred during sign-in. Please try again.',
    auth_not_configured: 'Authentication service is not configured.',
  },
};
