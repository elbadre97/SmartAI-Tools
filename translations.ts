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
    extract_text_button: 'استخراج النص',
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
    video_preview: 'معاينة الفيديو:',
    unsupported_file: 'نوع الملف غير مدعوم',
    file_too_large: 'حجم الملف كبير جدًا. الحد الأقصى {size} ميجابايت.',
    max_file_size: 'الحد الأقصى للحجم: {size} ميجابايت',

    // Footer
    footer_copyright: `© ${new Date().getFullYear()} أدوات ذكية. جميع الحقوق محفوظة.`,
    footer_subtitle: 'مصنوع بحب باستخدام أحدث التقنيات 🤖',

    // Login Modal
    login_modal_title: 'أهلاً بك',
    login_modal_subtitle: 'سجل الدخول للمتابعة وحفظ أعمالك.',
    login_with_google: 'تسجيل الدخول باستخدام جوجل',
    login_error: 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    auth_not_configured: 'خدمة المصادقة غير مهيأة حاليًا.',
    auth_api_not_enabled_error: 'خطأ في الإعداد: خدمة المصادقة (Identity Toolkit API) غير مفعلة لهذا المشروع. يرجى تفعيلها من Google Cloud Console.',
    
    // Modes
    mode: 'وضع التشغيل',
    mode_trial: 'الوضع التجريبي',
    mode_trial_desc: '30 محاولة مجانية يوميًا للحسابات المسجلة.',
    mode_user_api: 'مفتاحك الخاص',
    mode_user_api_desc: 'استخدام غير محدود مع مفتاح Gemini API الخاص بك.',
    mode_premium: 'الاشتراك المدفوع',
    mode_premium_desc: 'قوة كاملة وميزات حصرية.',

    // API Key Modal
    api_key_modal_title: 'إضافة مفتاح Gemini API',
    api_key_modal_subtitle: 'أضف مفتاحك الخاص لاستخدام غير محدود. مفتاحك يُحفظ في متصفحك فقط.',
    api_key_placeholder: 'الصق مفتاح API هنا...',
    save_api_key: 'حفظ المفتاح',
    clear_api_key: 'إزالة المفتاح',
    api_key_saved: 'تم حفظ المفتاح!',
    api_key_needed_for_user_mode: 'لاستخدام هذا الوضع، يرجى إضافة مفتاح Gemini API الخاص بك.',
    api_key_get_yours: 'احصل على مفتاحك من Google AI Studio',
    
    // Subscription & Payment Modal
    subscription_modal_title: 'الترقية إلى الاشتراك المدفوع',
    subscription_modal_subtitle: 'أطلق العنان للإمكانيات الكاملة لأدوات الذكاء الاصطناعي.',
    premium_feature_1: 'استخدام غير محدود لجميع الأدوات',
    premium_feature_2: 'سرعة استجابة أعلى',
    premium_feature_3: 'وصول مبكر للأدوات الجديدة',
    premium_feature_4: 'دعم فني ذو أولوية',
    price_per_month: 'شهريًا',
    subscribe_now_button: 'اشترك الآن مقابل 10$ / شهر',
    subscription_success_alert: 'شكرًا لاشتراكك! (هذه مجرد محاكاة)',
    payment_modal_title: 'إتمام الدفع',
    choose_payment_method: 'اختر طريقة الدفع',
    pay_with_paypal: 'الدفع بواسطة PayPal',
    pay_with_card: 'الدفع بالبطاقة',
    card_number: 'رقم البطاقة',
    expiry_date: 'تاريخ الانتهاء',
    cvc: 'CVC',
    mm_yy: 'MM/YY',
    confirm_payment_button: 'تأكيد الدفع (10$)',
    processing_payment: 'جاري معالجة الدفع...',
    back_button: 'رجوع',
    invalid_card_number: 'رقم البطاقة غير صالح',
    invalid_expiry_date: 'تاريخ الانتهاء غير صالح',
    invalid_cvc: 'CVC غير صالح',

    // Points
    points_remaining: 'النقاط: {count}',
    no_points_error: 'لقد استنفدت نقاطك لهذا اليوم. يمكنك العودة غدًا أو التبديل إلى وضع "مفتاحك الخاص".',
    not_enough_points_error: 'تحتاج إلى 5 نقاط على الأقل للإنشاء. رصيدك الحالي {count} نقطة.',

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
    extract_text_button: 'Extract Text',
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
    video_preview: 'Video Preview:',
    unsupported_file: 'Unsupported file type',
    file_too_large: 'File is too large. Max size is {size}MB.',
    max_file_size: 'Max file size: {size}MB',

    // Footer
    footer_copyright: `© ${new Date().getFullYear()} Smart Tools. All rights reserved.`,
    footer_subtitle: 'Made with ❤️ using the latest technologies 🤖',

    // Login Modal
    login_modal_title: 'Welcome',
    login_modal_subtitle: 'Sign in to continue and save your work.',
    login_with_google: 'Sign in with Google',
    login_error: 'An error occurred during sign-in. Please try again.',
    auth_not_configured: 'Authentication service is not configured.',
    auth_api_not_enabled_error: 'Configuration Error: The Identity Toolkit API is not enabled for this project. Please enable it in the Google Cloud Console.',

    // Modes
    mode: 'Mode',
    mode_trial: 'Trial Mode',
    mode_trial_desc: '30 free daily credits for registered accounts.',
    mode_user_api: 'Your API Key',
    mode_user_api_desc: 'Unlimited usage with your own Gemini API key.',
    mode_premium: 'Premium',
    mode_premium_desc: 'Full power and exclusive features.',

    // API Key Modal
    api_key_modal_title: 'Add Your Gemini API Key',
    api_key_modal_subtitle: 'Add your own key for unlimited usage. Your key is saved only in your browser.',
    api_key_placeholder: 'Paste your API key here...',
    save_api_key: 'Save Key',
    clear_api_key: 'Remove Key',
    api_key_saved: 'Key Saved!',
    api_key_needed_for_user_mode: 'To use this mode, please add your Gemini API key.',
    api_key_get_yours: 'Get your key from Google AI Studio',
    
    // Subscription & Payment Modal
    subscription_modal_title: 'Upgrade to Premium',
    subscription_modal_subtitle: 'Unlock the full potential of AI tools.',
    premium_feature_1: 'Unlimited usage of all tools',
    premium_feature_2: 'Faster response times',
    premium_feature_3: 'Early access to new tools',
    premium_feature_4: 'Priority customer support',
    price_per_month: 'per month',
    subscribe_now_button: 'Subscribe Now for $10 / month',
    subscription_success_alert: 'Thank you for subscribing! (This is a simulation)',
    payment_modal_title: 'Complete Payment',
    choose_payment_method: 'Choose Payment Method',
    pay_with_paypal: 'Pay with PayPal',
    pay_with_card: 'Pay with Card',
    card_number: 'Card Number',
    expiry_date: 'Expiry Date',
    cvc: 'CVC',
    mm_yy: 'MM/YY',
    confirm_payment_button: 'Confirm Payment ($10)',
    processing_payment: 'Processing Payment...',
    back_button: 'Back',
    invalid_card_number: 'Invalid card number',
    invalid_expiry_date: 'Invalid expiry date',
    invalid_cvc: 'Invalid CVC',

    // Points
    points_remaining: 'Credits: {count}',
    no_points_error: 'You have run out of credits for today. You can come back tomorrow or switch to "Your API Key" mode.',
    not_enough_points_error: 'You need at least 5 points to generate. You currently have {count} points.',
  },
};