import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { ToolType, Language } from '../types';

// A helper to create a new AI instance.
const createAiInstance = (apiKey: string): GoogleGenAI => {
    return new GoogleGenAI({ apiKey });
};

const videoExtractorSchema = {
    type: Type.OBJECT,
    properties: {
        transcript: {
            type: Type.STRING,
            description: "The full, verbatim transcript of all spoken words in the video.",
        },
        summary: {
            type: Type.STRING,
            description: "A concise summary of the video's content, capturing the main points.",
        },
        topics: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "A list of the key topics or themes discussed in the video.",
        },
    },
    required: ["transcript", "summary", "topics"],
};

const prompts: Record<Language, Partial<Record<ToolType, (input: string) => string>>> = {
  ar: {
    text: (input: string) => `بصفتك خبيرًا في الكتابة الإبداعية، قم بصياغة نص باللغة العربية الفصحى، يتسم بالعمق والتفصيل، مستلهمًا من الفكرة المحورية التالية: "${input}"`,
    summary: (input: string) => `قم بتحليل النص التالي واستخلاص جوهره، ثم قدم ملخصًا دقيقًا وموجزًا باللغة العربية الفصحى، مع التركيز على النقاط الأساسية: \n\n${input}`,
    translate: (input: string) => `يرجى تقديم ترجمة احترافية ودقيقة من اللغة العربية إلى الإنجليزية للنص التالي، مع الحفاظ على الفروق الدقيقة في المعنى والسياق: \n\n"${input}"`,
    email: (input: string) => `صياغة بريد إلكتروني رسمي باللغة العربية الفصحى، بناءً على الوصف التالي. يجب أن تكون النبرة مهنية ومناسبة للسياق المحدد: \n\n"${input}"`,
    code: (input: string) => `بصفتك مهندس برمجيات خبير، قم بكتابة شيفرة برمجية (كود) استنادًا إلى المتطلبات التالية. أضف تعليقات توضيحية شاملة لشرح منطق الكود وبنيته. \n\nالمتطلبات: "${input}"`,
    long_video_script: (input: string) => `اكتب سيناريو (سكريبت) احترافي ومفصل لفيديو طويل مخصص لمنصة يوتيوب، يدور حول الموضوع التالي. يجب أن يتضمن السيناريو مقدمة مشوقة، ومحتوى غني مقسم إلى فقرات متسلسلة منطقيًا، وخاتمة مؤثرة تلخص الأفكار الرئيسية. الموضوع: "${input}"`,
    short_video_script: (input: string) => `ابتكر سيناريو (سكريبت) جذاب ومختصر لفيديو قصير (مثل تيك توك أو ريلز) حول الفكرة التالية. يجب أن يكون سريع الإيقاع، ومبتكرًا، ومناسبًا للمشاهدة على الأجهزة المحمولة. الفكرة: "${input}"`,
    image_prompt_extractor: (input: string) => `قدم وصفًا تحليليًا دقيقًا ومفصلاً لهذه الصورة باللغة الإنجليزية. يجب أن يكون الوصف غنيًا بالكلمات المفتاحية البصرية والأسلوبية، بحيث يمكن استخدامه كـ "أمر" (prompt) فعال لتوليد صورة مشابهة بواسطة نماذج الذكاء الاصطناعي الأخرى.`,
    video_text_extractor: (input: string) => `قم بإجراء تحليل شامل لهذا المقطع المرئي. استخرج النص الصوتي الكامل (transcript)، وقدم ملخصًا تنفيذيًا (summary)، وحدد قائمة بالمواضيع المحورية (topics). يجب أن تكون المخرجات النهائية على هيئة كائن JSON منظم يحتوي على المفاتيح التالية: 'transcript', 'summary', 'topics'.`,
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
    video_text_extractor: (input: string) => `Analyze this video and provide a full transcript, a concise summary, and a list of key topics. Return the result as a JSON object with 'transcript', 'summary', and 'topics' keys.`,
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
            config: {
                responseMimeType: "application/json",
                responseSchema: videoExtractorSchema,
            }
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
    userApiKey: string | null
): Promise<string> => {
  try {
    if (!userApiKey) {
      throw new Error("USER_API_KEY_NOT_FOUND");
    }
    const aiInstance = createAiInstance(userApiKey);
    return await executeApiCall(aiInstance, toolType, input, lang);
  } catch (error) {
    console.error("Final Error in generateContent:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error) {
        if (error.message === "USER_API_KEY_NOT_FOUND") {
            return lang === 'ar'
                ? "مفتاح API الخاص بك مطلوب. يرجى إضافته في الإعدادات."
                : "Your API Key is required. Please add it in the settings.";
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