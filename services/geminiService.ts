import { GoogleGenAI, Modality } from "@google/genai";
import type { ToolType, Language, AppMode } from '../types';

const MAX_RETRIES = 3; // Number of retry attempts
const RETRY_DELAY = 1000; // Delay between retries in milliseconds

// A helper to create a new AI instance.
const createAiInstance = (apiKey: string): GoogleGenAI => {
    return new GoogleGenAI({ apiKey });
};

// Prompts remain the same
const prompts: Record<Language, Partial<Record<ToolType, (input: string) => string>>> = {
  ar: {
    text: (input: string) => `أنشئ نصًا إبداعيًا ومفصلاً باللغة العربية بناءً على الفكرة التالية: "${input}"`,
    summary: (input: string) => `لخص النص التالي باللغة العربية في نقاط رئيسية وواضحة: \n\n${input}`,
    translate: (input: string) => `ترجم النص التالي من العربية إلى الإنجليزية ترجمة احترافية ودقيقة: \n\n"${input}"`,
    email: (input: string) => `اكتب بريدًا إلكترونيًا احترافيًا باللغة العربية بناءً على الوصف التالي. اجعل النبرة مناسبة للسياق: \n\n"${input}"`,
    code: (input: string) => `اكتب كود برمجي بناءً على الوصف التالي. أضف تعليقات توضيحية للكود. \n\nالوصف: "${input}"`,
    long_video_script: (input: string) => `اكتب سكريبت احترافي ومفصل لفيديو طويل على يوتيوب حول الموضوع التالي. يجب أن يتضمن السكريبت مقدمة جذابة، محتوى مقسم إلى فقرات، وخاتمة قوية. الموضوع: "${input}"`,
    short_video_script: (input: string) => `اكتب سكريبت جذاب ومختصر لفيديو قصير (مثل تيك توك أو ريلز) حول الفكرة التالية. يجب أن يكون سريع الإيقاع ومناسب للمشاهدة على الهاتف. الفكرة: "${input}"`,
    image_prompt_extractor: (input: string) => `صف هذه الصورة بالتفصيل. يجب أن يكون الوصف دقيقًا وغنيًا بالكلمات المفتاحية بحيث يمكن استخدامه كـ "برومبت" (أمر) لإنشاء صورة مشابهة لها بواسطة مولد صور آخر يعمل بالذكاء الاصطناعي.`,
    video_text_extractor: (input: string) => `استخرج النص الكامل المنطوق في هذا الفيديو. قم بتوفير النص فقط بدون أي تعليقات إضافية.`,
  },
  en: {
    text: (input: string) => `Generate a creative and detailed text in English based on the following idea: "${input}"`,
    summary: (input: string) => `Summarize the following text in English into clear key points: \n\n${input}`,
    translate: (input: string) => `Translate the following Arabic text to professional and accurate English: \n\n"${input}"`,
    email: (input: string) => `Write a professional email in English based on the following description. Make the tone appropriate for the context: \n\n"${input}"`,
    code: (input: string) => `Write a code snippet based on the following description. Add comments to explain the code. \n\nDescription: "${input}"`,
    long_video_script: (input: string) => `Write a professional and detailed script for a long-form YouTube video about the following topic. The script should include an engaging intro, content divided into sections, and a strong conclusion. Topic: "${input}"`,
    short_video_script: (input: string) => `Write a catchy and concise script for a short video (like TikTok or Reels) about the following idea. It should be fast-paced and suitable for mobile viewing. Idea: "${input}"`,
    image_prompt_extractor: (input: string) => `Describe this image in detail. The description should be precise and rich with keywords, suitable for use as a 'prompt' to generate a similar image with another AI image generator.`,
    video_text_extractor: (input: string) => `Extract the full spoken text from this video. Provide only the transcription without any additional commentary.`,
  }
};

const getPromptForTool = (toolType: ToolType, input: string, lang: Language): string => {
  const promptFn = prompts[lang][toolType];
  return promptFn ? promptFn(input) : input;
};

// This function will execute the actual API call for a given tool and input.
const executeApiCall = async (aiInstance: GoogleGenAI, toolType: ToolType, input: string | { data: string; mimeType: string }, lang: Language) => {
    if (toolType === 'image') {
       // Imagen performs better with English prompts.
      const imagePrompt = `A vivid, high-quality image of: ${input}`;
      const response = await aiInstance.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      } else {
        throw new Error(lang === 'ar' ? 'لم يتمكن الذكاء الاصطناعي من إنشاء الصورة.' : 'The AI could not generate the image.');
      }
    } else if (toolType === 'image_bg_remover') {
        if (typeof input !== 'object' || !input.data || !input.mimeType) {
            throw new Error('Invalid input for image background remover.');
        }
        const imagePart = {
            inlineData: {
                data: input.data,
                mimeType: input.mimeType,
            },
        };
        const textPart = {
            text: 'Remove the background from this image. The output should be a PNG with a transparent background.',
        };
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error(lang === 'ar' ? 'لم يتمكن الذكاء الاصطناعي من إزالة الخلفية.' : 'The AI could not remove the background.');

    } else if (toolType === 'image_prompt_extractor') {
        if (typeof input !== 'object' || !input.data || !input.mimeType) {
            throw new Error('Invalid input for image prompt extractor.');
        }
        const imagePart = {
            inlineData: {
                data: input.data,
                mimeType: input.mimeType,
            },
        };
        const textPart = { text: getPromptForTool(toolType, '', lang) };
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } else if (toolType === 'video_text_extractor') {
        if (typeof input !== 'object' || !input.data || !input.mimeType) {
            throw new Error('Invalid input for video text extractor.');
        }
        const videoPart = {
            inlineData: {
                data: input.data,
                mimeType: input.mimeType,
            },
        };
        const textPart = { text: getPromptForTool(toolType, '', lang) };
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [videoPart, textPart] },
        });
        return response.text;
    } else {
      const prompt = getPromptForTool(toolType, input as string, lang);
      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    }
};

const isKeyRelatedError = (error: any): boolean => {
    const message = error?.message?.toLowerCase() || '';
    return message.includes('api key not valid') || 
           message.includes('rate limit') || 
           message.includes('quota') ||
           message.includes('permission denied');
};

export const generateContent = async (
    toolType: ToolType,
    input: string | { data: string; mimeType: string },
    lang: Language,
    mode: AppMode,
    userApiKey?: string | null
): Promise<string> => {
  try {
    if (mode === 'user_api') {
      if (!userApiKey) {
        throw new Error("USER_API_KEY_NOT_FOUND");
      }
      const aiInstance = createAiInstance(userApiKey);
      return await executeApiCall(aiInstance, toolType, input, lang);
    }
    
    // For 'trial' and 'premium' modes, use the key pool with rotation and retry logic.
    const apiKeys = (process.env.API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);

    if (apiKeys.length === 0) {
      throw new Error("API_KEY_NOT_FOUND");
    }

    let lastError: any = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`--- Starting API call attempt #${attempt} ---`);
      for (let i = 0; i < apiKeys.length; i++) {
        const key = apiKeys[i];
        const keyIdentifier = `Key ${i + 1} (...${key.slice(-4)})`;
        console.log(`Trying with ${keyIdentifier}`);

        try {
          const aiInstance = createAiInstance(key);
          const result = await executeApiCall(aiInstance, toolType, input, lang);
          console.log(`✅ Success with ${keyIdentifier}`);
          return result;
        } catch (error) {
          lastError = error;
          console.error(`❌ Failed with ${keyIdentifier}:`, error.message);
          
          if (isKeyRelatedError(error)) {
             console.log(`Key-related error detected. Rotating to the next key.`);
             continue; // Try next key
          } else {
            // For non-key related errors (e.g., bad input), fail fast.
            console.error("Non-key related error. Failing fast.");
            throw error;
          }
        }
      }

      if (attempt < MAX_RETRIES) {
        console.warn(`All keys failed on attempt #${attempt}. Retrying after ${RETRY_DELAY}ms...`);
        await new Promise(res => setTimeout(res, RETRY_DELAY));
      }
    }

    console.error("All API keys and retries failed.");
    throw lastError || new Error("All API keys failed after multiple retries.");

  } catch (error) {
    console.error("Final Error in generateContent:", error);
    if (error instanceof Error) {
        if (error.message === "API_KEY_NOT_FOUND") {
            return lang === 'ar'
            ? "خطأ في الإعداد: مفتاح API غير موجود. يرجى التأكد من تكوين بيئة التشغيل بشكل صحيح."
            : "Configuration Error: API Key not found. Please ensure your environment is set up correctly.";
        }
        if (error.message === "USER_API_KEY_NOT_FOUND") {
            return lang === 'ar'
                ? "مفتاح API الخاص بك مطلوب. يرجى إضافته في إعدادات وضع التشغيل."
                : "Your API Key is required. Please add it in the mode settings.";
        }
        if (isKeyRelatedError(error)) {
             return lang === 'ar'
                ? "حدث خطأ متعلق بمفتاح API (قد يكون غير صالح أو تجاوز الحد المسموح به). يرجى التحقق من المفتاح."
                : "An API key-related error occurred (it might be invalid or has exceeded its rate limit). Please check the key.";
        }
    }

    return lang === 'ar'
      ? "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى."
      : "An error occurred while contacting the AI. Please try again.";
  }
};
