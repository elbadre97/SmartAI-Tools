import type { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    header_title: "SmartAI Tools",
    lang_toggle: "EN",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    nav_home: "الرئيسية",
    nav_tools: "الأدوات",
    nav_features: "المميزات",

    // Main Title
    main_title: "🚀 منصة الذكاء الاصطناعي المتكاملة",
    main_subtitle: "اختر الأداة المناسبة وابدأ في إنشاء محتوى مذهل",
    
    // Login Modal
    login_modal_title: "تسجيل الدخول",
    login_modal_subtitle: "اختر طريقة تسجيل الدخول للمتابعة.",
    login_with_google: "تسجيل الدخول باستخدام جوجل",
    login_error: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
    auth_disabled_tooltip: "خدمة تسجيل الدخول غير مهيأة حالياً.",
    auth_not_configured: "خدمة المصادقة غير مهيأة. يرجى الاتصال بمسؤول الموقع.",
    
    // Tool Interface
    close: "إغلاق",
    char_count: "حرف",
    clear_all: "مسح الكل",
    generate: "توليد",
    convert: "تحويل",
    compress: "ضغط",
    copy_input: "نسخ الإدخال",
    paste: "لصق",
    clipboard_paste_error: "تعذر اللصق من الحافظة. قد يحظر متصفحك هذه الميزة لأسباب أمنية. يرجى لصق النص يدويًا.",
    result: "النتيجة:",
    copy_result: "نسخ",
    save: "حفظ",
    share: "مشاركة",
    input_required_error: "يرجى إدخال نص أولاً!",
    image_required_error: "يرجى رفع صورة أولاً!",
    file_required_error: "يرجى رفع ملف أولاً!",
    image_conversion_only_error: "عذراً، تحويل الصور هو المتاح حالياً فقط. سيتم دعم الملفات الأخرى قريباً.",
    image_compression_only_error: "عذراً، ضغط الصور هو المتاح حالياً فقط. سيتم دعم الملفات الأخرى قريباً.",
    invalid_file_type: "نوع الملف غير صالح. يرجى اختيار صورة.",
    share_not_supported: "المشاركة غير مدعومة في هذا المتصفح.",
    api_error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
    supported_formats: "الصيغ المدعومة",
    image_preview: "معاينة الصورة",
    generated_ai_alt: "صورة تم إنشاؤها بواسطة الذكاء الاصطناعي",
    converted_image_alt: "الصورة بعد التحويل",
    compressed_image_alt: "الصورة بعد الضغط",
    coming_soon_title: "قريباً!",
    feature_update_title: "تحديث جديد!",
    video_downloader_explanation: "هذه الميزة قيد التطوير حالياً. نظراً للقيود التقنية، يتطلب تحميل الفيديو خادماً خاصاً نعمل على تجهيزه. شكراً لتفهمكم!",
    file_converter_explanation: "تم تفعيل تحويل صيغ الصور! يمكنك الآن التحويل بين PNG, JPG, WEBP, GIF. دعم الملفات الأخرى مثل PDF قادم قريباً.",
    file_compressor_explanation: "تم تفعيل ضغط الصور! يمكنك الآن تقليل حجم ملفات الصور بشكل كبير عن طريق تحويلها إلى صيغة JPG أو WEBP المضغوطة. دعم ضغط الملفات الأخرى مثل PDF و ZIP قادم قريباً.",
    target_format_label: "اختر الصيغة المطلوبة:",
    compressor_target_format_label: "اختر صيغة الإخراج:",
    pdf_format: "PDF",
    compression_quality: "جودة الضغط",
    original_size: "الحجم الأصلي",
    compressed_size: "الحجم المضغوط",
    size_reduction: "نسبة التوفير",


    // Stats
    stats_tools: "أدوات ذكية",
    stats_categories: "فئات متنوعة",
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
    nav_home: "Home",
    nav_tools: "Tools",
    nav_features: "Features",

    // Main Title
    main_title: "🚀 The All-in-One AI Platform",
    main_subtitle: "Choose the right tool and start creating amazing content",

    // Login Modal
    login_modal_title: "Login",
    login_modal_subtitle: "Choose a login method to continue.",
    login_with_google: "Sign in with Google",
    login_error: "An error occurred during sign-in. Please try again.",
    auth_disabled_tooltip: "Login service is not configured.",
    auth_not_configured: "Authentication service is not configured. Please contact the site administrator.",
    
    // Tool Interface
    close: "Close",
    char_count: "characters",
    clear_all: "Clear All",
    generate: "Generate",
    convert: "Convert",
    compress: "Compress",
    copy_input: "Copy Input",
    paste: "Paste",
    clipboard_paste_error: "Could not paste from clipboard. This feature may be blocked by your browser for security reasons. Please paste the text manually.",
    result: "Result:",
    copy_result: "Copy",
    save: "Save",
    share: "Share",
    input_required_error: "Please enter some text first!",
    image_required_error: "Please upload an image first!",
    file_required_error: "Please upload a file first!",
    image_conversion_only_error: "Sorry, only image conversion is available right now. Other file types will be supported soon.",
    image_compression_only_error: "Sorry, only image compression is available right now. Other file types will be supported soon.",
    invalid_file_type: "Invalid file type. Please select an image.",
    share_not_supported: "Sharing is not supported in this browser.",
    api_error: "An error occurred while contacting the AI. Please try again.",
    supported_formats: "Supported formats",
    image_preview: "Image Preview",
    generated_ai_alt: "AI-generated image",
    converted_image_alt: "Converted image",
    compressed_image_alt: "Compressed image",
    coming_soon_title: "Coming Soon!",
    feature_update_title: "Feature Update!",
    video_downloader_explanation: "This feature is currently under development. Due to technical limitations, video downloading requires a special server that we are working on setting up. Thank you for your understanding!",
    file_converter_explanation: "Image format conversion is now live! You can convert between PNG, JPG, WEBP, and GIF. Support for other files like PDF is coming soon.",
    file_compressor_explanation: "Image compression is now live! You can now significantly reduce image sizes by converting them to compressed JPG or WEBP formats. Support for other files like PDF and ZIP is coming soon.",
    target_format_label: "Choose target format:",
    compressor_target_format_label: "Choose output format:",
    pdf_format: "PDF",
    compression_quality: "Compression Quality",
    original_size: "Original Size",
    compressed_size: "Compressed Size",
    size_reduction: "Size Reduction",


    // Stats
    stats_tools: "Smart Tools",
    stats_categories: "Diverse Categories",
    stats_accuracy: "Accurate Results",
    stats_availability: "Always Available",

    // Footer
    footer_copyright: `© ${new Date().getFullYear()} SmartAI Tools. All rights reserved.`,
    footer_subtitle: "The comprehensive AI platform for all your needs",
  }
};