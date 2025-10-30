import type { Tool, Category, User } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'content',
    icon: '📝',
    title: { ar: 'إنشاء المحتوى', en: 'Content Creation' }
  },
  {
    id: 'visuals',
    icon: '🎨',
    title: { ar: 'المرئيات', en: 'Visuals' }
  },
  {
    id: 'productivity',
    icon: '🚀',
    title: { ar: 'الإنتاجية', en: 'Productivity' }
  },
  {
    id: 'development',
    icon: '💻',
    title: { ar: 'التطوير', en: 'Development' }
  }
];

export const MOCK_USERS: User[] = [
  {
    name: { ar: 'نورة خالد', en: 'Noura Khalid' },
    email: 'noura.k@example.com',
    photoURL: 'https://avatar.iran.liara.run/public/girl?username=noura'
  },
  {
    name: { ar: 'محمد عبدالله', en: 'Mohammed Abdullah' },
    email: 'mohammed.a@example.com',
    photoURL: 'https://avatar.iran.liara.run/public/boy?username=mohammed'
  },
  {
    name: { ar: 'فاطمة علي', en: 'Fatima Ali' },
    email: 'fatima.a@example.com',
    photoURL: 'https://avatar.iran.liara.run/public/girl?username=fatima'
  }
];

export const TOOLS: Tool[] = [
  {
    id: 'text',
    category: 'content',
    icon: '📝',
    title: { ar: 'مولّد النصوص الذكي', en: 'Smart Text Generator' },
    description: { ar: 'إنشاء نصوص إبداعية بمختلف الأنماط واللغات', en: 'Create creative texts in various styles and languages' },
    inputLabel: { ar: 'أدخل فكرة أو موضوع للنص:', en: 'Enter an idea or topic for the text:' },
    placeholder: { ar: 'مثال: اكتب مقالاً عن أهمية الذكاء الاصطناعي في التعليم...', en: 'Example: Write an article about the importance of AI in education...' },
    loadingText: { ar: 'جاري إنشاء نص إبداعي...', en: 'Generating creative text...' },
    inputType: 'text',
  },
  {
    id: 'long_video_script',
    category: 'content',
    icon: '🎬',
    title: { ar: 'مولد سكريبتات فيديو طويل', en: 'Long Video Script Generator' },
    description: { ar: 'إنشاء سكريبتات احترافية لفيديوهات يوتيوب', en: 'Create professional scripts for YouTube videos' },
    inputLabel: { ar: 'صف فكرة الفيديو الطويل:', en: 'Describe the idea for the long video:' },
    placeholder: { ar: 'مثال: سكريبت لفيديو يشرح تاريخ الذكاء الاصطناعي...', en: 'Example: A script for a video explaining the history of AI...' },
    loadingText: { ar: 'جاري كتابة سكريبت الفيديو الطويل...', en: 'Writing long video script...' },
    inputType: 'text',
  },
  {
    id: 'short_video_script',
    category: 'content',
    icon: '📹',
    title: { ar: 'مولد سكريبتات فيديو قصير', en: 'Short Video Script Generator' },
    description: { ar: 'كتابة سكريبتات جذابة لفيديوهات قصيرة (ريلز، تيك توك)', en: 'Write engaging scripts for short videos (Reels, TikTok)' },
    inputLabel: { ar: 'صف فكرة الفيديو القصير:', en: 'Describe the idea for the short video:' },
    placeholder: { ar: 'مثال: سكريبت لفيديو قصير عن 3 حيل لاستخدام ChatGPT...', en: 'Example: A script for a short video about 3 ChatGPT hacks...' },
    loadingText: { ar: 'جاري كتابة سكريبت الفيديو القصير...', en: 'Writing short video script...' },
    inputType: 'text',
  },
  {
    id: 'image',
    category: 'visuals',
    icon: '🎨',
    title: { ar: 'مولّد الصور بالذكاء الاصطناعي', en: 'AI Image Generator' },
    description: { ar: 'تحويل الأوصاف النصية إلى صور مذهلة', en: 'Turn text descriptions into stunning images' },
    inputLabel: { ar: 'صف الصورة التي تريد إنشاءها:', en: 'Describe the image you want to create:' },
    placeholder: { ar: 'مثال: منظر طبيعي لغروب الشمس فوق الجبال مع بحيرة...', en: 'Example: A landscape of a sunset over mountains with a lake...' },
    loadingText: { ar: 'جاري إنشاء الصورة...', en: 'Generating image...' },
    inputType: 'text',
  },
   {
    id: 'image_bg_remover',
    category: 'visuals',
    icon: '🖼️',
    title: { ar: 'مزيل خلفية الصور', en: 'Image Background Remover' },
    description: { ar: 'إزالة خلفية الصور بدقة عالية', en: 'Remove image backgrounds with high precision' },
    inputLabel: { ar: 'ارفع صورة لإزالة خلفيتها:', en: 'Upload an image to remove its background:' },
    placeholder: { ar: 'اسحب وأفلت صورة هنا أو انقر للتصفح', en: 'Drag and drop an image here, or click to browse' },
    loadingText: { ar: 'جاري إزالة الخلفية...', en: 'Removing background...' },
    inputType: 'image',
  },
  {
    id: 'video_bg_remover',
    category: 'visuals',
    icon: '🎞️',
    title: { ar: 'مزيل خلفية الفيديو', en: 'Video Background Remover' },
    description: { ar: 'قادم قريباً! إزالة خلفية الفيديوهات بسهولة', en: 'Coming soon! Easily remove video backgrounds' },
    inputLabel: { ar: '', en: '' },
    placeholder: { ar: '', en: '' },
    loadingText: { ar: '', en: '' },
    inputType: 'image',
    disabled: true,
  },
  {
    id: 'summary',
    category: 'productivity',
    icon: '🧠',
    title: { ar: 'ملخص النصوص الذكي', en: 'Smart Text Summarizer' },
    description: { ar: 'تلخيص النصوص الطويلة إلى نقاط رئيسية', en: 'Summarize long texts into key points' },
    inputLabel: { ar: 'الصق النص الذي تريد تلخيصه:', en: 'Paste the text you want to summarize:' },
    placeholder: { ar: 'الصق النص الطويل هنا...', en: 'Paste the long text here...' },
    loadingText: { ar: 'جاري تحليل وتلخيص النص...', en: 'Analyzing and summarizing text...' },
    inputType: 'text',
  },
  {
    id: 'translate',
    category: 'productivity',
    icon: '🌐',
    title: { ar: 'المترجم المتقدم', en: 'Advanced Translator (AR to EN)' },
    description: { ar: 'ترجمة النصوص من العربية للإنجليزية بدقة عالية', en: 'Translate text from Arabic to English with high accuracy' },
    inputLabel: { ar: 'أدخل النص للترجمة إلى الإنجليزية:', en: 'Enter text to translate to English:' },
    placeholder: { ar: 'اكتب النص الذي تريد ترجمته...', en: 'Write the text you want to translate...' },
    loadingText: { ar: 'جاري الترجمة...', en: 'Translating...' },
    inputType: 'text',
  },
  {
    id: 'email',
    category: 'productivity',
    icon: '✉️',
    title: { ar: 'كاتب الإيميلات المحترف', en: 'Professional Email Writer' },
    description: { ar: 'إنشاء إيميلات احترافية بأنماط مختلفة', en: 'Compose professional emails in various styles' },
    inputLabel: { ar: 'صف محتوى الإيميل:', en: 'Describe the email content:' },
    placeholder: { ar: 'مثال: اكتب إيميل رسمي لطلب اجتماع مع المدير...', en: 'Example: Write a formal email to request a meeting with the manager...' },
    loadingText: { ar: 'جاري كتابة الإيميل...', en: 'Writing email...' },
    inputType: 'text',
  },
  {
    id: 'video_downloader',
    category: 'productivity',
    icon: '📥',
    title: { ar: 'تحميل الفيديوهات', en: 'Video Downloader' },
    description: { ar: 'تحميل الفيديوهات من مواقع التواصل الاجتماعي عبر الرابط', en: 'Download videos from social media sites via link' },
    inputLabel: { ar: 'الصق رابط الفيديو هنا:', en: 'Paste the video link here:' },
    placeholder: { ar: 'https://...', en: 'https://...' },
    loadingText: { ar: 'جاري التحضير...', en: 'Preparing...' },
    inputType: 'text',
  },
    {
    id: 'file_converter',
    category: 'productivity',
    icon: '🔄',
    title: { ar: 'محول صيغ الملفات', en: 'File Format Converter' },
    description: { ar: 'تحويل صيغ الصور والملفات بسهولة', en: 'Easily convert image and file formats' },
    inputLabel: { ar: 'ارفع ملفاً لتحويل صيغته:', en: 'Upload a file to convert its format:' },
    placeholder: { ar: 'اسحب وأفلت ملفاً هنا أو انقر للتصفح', en: 'Drag and drop a file here, or click to browse' },
    loadingText: { ar: 'جاري التحويل...', en: 'Converting...' },
    inputType: 'file',
  },
  {
    id: 'file_compressor',
    category: 'productivity',
    icon: '🗜️',
    title: { ar: 'ضاغط الملفات والصور', en: 'File & Image Compressor' },
    description: { ar: 'تقليل حجم الصور والملفات مع الحفاظ على الجودة', en: 'Reduce image and file sizes while maintaining quality' },
    inputLabel: { ar: 'ارفع ملفاً لضغطه:', en: 'Upload a file to compress it:' },
    placeholder: { ar: 'اسحب وأفلت ملفاً هنا أو انقر للتصفح', en: 'Drag and drop a file here, or click to browse' },
    loadingText: { ar: 'جاري الضغط...', en: 'Compressing...' },
    inputType: 'file',
  },
  {
    id: 'code',
    category: 'development',
    icon: '💻',
    title: { ar: 'مولّد الأكواد البرمجية', en: 'Code Generator' },
    description: { ar: 'توليد أكواد برمجية جاهزة للاستخدام', en: 'Generate ready-to-use code snippets' },
    inputLabel: { ar: 'صف الكود الذي تريد إنشاءه:', en: 'Describe the code you want to generate:' },
    placeholder: { ar: 'مثال: اكتب دالة JavaScript لتحويل JSON إلى XML...', en: 'Example: Write a JavaScript function to convert JSON to XML...' },
    loadingText: { ar: 'جاري توليد الكود...', en: 'Generating code...' },
    inputType: 'text',
  }
];