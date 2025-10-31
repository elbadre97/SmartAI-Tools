import React, { useState, useRef, useEffect } from 'react';
import type { Tool, Language, AppMode, User, VideoOutput } from '../types';
import { generateContent } from '../services/geminiService';
import { Spinner } from './icons/Spinner';
import { CloseIcon, CopyIcon, ClearIcon, PasteIcon, UploadIcon } from './icons/ActionIcons';
import { StructuredVideoOutput } from './StructuredVideoOutput';

interface ToolInterfaceProps {
  tool: Tool;
  onClose: () => void;
  language: Language;
  t: Record<string, string>;
  mode: AppMode;
  userApiKey: string | null;
  user: User | null;
  onDeductPoint: () => void;
  onLogin: () => void;
}

// Define separate limits for different file types to improve user experience and align with API capabilities.
const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15 MB for images
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB for videos

const mediaFileToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const ToolInterface: React.FC<ToolInterfaceProps> = ({ tool, onClose, language, t, mode, userApiKey, user, onDeductPoint, onLogin }) => {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [structuredOutput, setStructuredOutput] = useState<VideoOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('');

  const [isCopied, setIsCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  
  // File handling state
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const isFileInput = tool.inputType === 'image' || tool.inputType === 'file';

  const POINTS_PER_GENERATION = 5;

  // Determine max file size based on tool type for better UX and to avoid API errors
  const maxFileSize = (() => {
    switch(tool.id) {
      case 'image_bg_remover':
      case 'image_prompt_extractor':
        return MAX_IMAGE_SIZE;
      case 'video_text_extractor':
        return MAX_VIDEO_SIZE;
      default:
        return tool.inputType === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    }
  })();
  const maxFileSizeMB = (maxFileSize / 1024 / 1024).toFixed(0);

  const resetState = () => {
    setInputValue('');
    setOutputValue('');
    setStructuredOutput(null);
    setError(null);
    setFile(null);
    setFilePreview(null);
    setIsLoading(false);
    setLoadingText('');
  };

  useEffect(() => {
    resetState();
  }, [tool.id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.size > maxFileSize) {
            setError(t.file_too_large.replace('{size}', maxFileSizeMB));
            return;
        }
        setError(null);
        setFile(selectedFile);
        
        const previewUrl = URL.createObjectURL(selectedFile);
        if (selectedFile.type.startsWith('image/')) {
            setFilePreview(previewUrl);
        } else if (selectedFile.type.startsWith('video/')) {
            setFilePreview(previewUrl);
        } else {
            setFilePreview(null);
        }
    }
  };

  const handleGenerate = async () => {
    if (mode === 'trial' && !user) {
        onLogin();
        return;
    }

    if ((isFileInput && !file) || (!isFileInput && !inputValue.trim())) {
      return;
    }

    if (mode === 'trial' && user && user.points < POINTS_PER_GENERATION) {
        setError(t.not_enough_points_error.replace('{count}', user.points.toString()));
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setOutputValue('');
    setStructuredOutput(null);
    setLoadingText(tool.loadingText[language]);
    
    try {
      let result;
      if (isFileInput && file) {
        const base64Data = await mediaFileToBase64(file);
        result = await generateContent(tool.id, { data: base64Data, mimeType: file.type }, language, mode, userApiKey);
      } else {
        result = await generateContent(tool.id, inputValue, language, mode, userApiKey);
      }
      
      const isErrorResult = result.includes('خطأ') || result.includes('Error') || result.includes('not valid') || result.includes('غير صالح') || result.includes('required');

      if (tool.id === 'video_text_extractor' && !isErrorResult) {
          try {
              const parsedResult: VideoOutput = JSON.parse(result.trim());
              setStructuredOutput(parsedResult);
              setOutputValue(''); // Don't show raw JSON
              if (mode === 'trial') onDeductPoint();
          } catch (jsonError) {
              console.error("Failed to parse JSON output:", jsonError, "Raw result:", result);
              setError(t.json_parse_error);
              setOutputValue('');
              setStructuredOutput(null);
          }
      } else if (isErrorResult) {
          setOutputValue('');
          setError(result);
          setStructuredOutput(null);
      } else {
          setOutputValue(result);
          setStructuredOutput(null);
          if (mode === 'trial') {
              onDeductPoint();
          }
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingText('');
    }
  };

  const handlePaste = async () => {
    try {
        const text = await navigator.clipboard.readText();
        setInputValue(text);
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
  };
  
  const handleCopy = () => {
    if (structuredOutput) {
        const { summary, topics, transcript } = structuredOutput;
        const textToCopy = `
${t.output_summary.toUpperCase()}:\n${summary}\n
${t.output_topics.toUpperCase()}:\n- ${topics.join('\n- ')}\n
${t.output_transcript.toUpperCase()}:\n${transcript}
        `.trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
        return;
    }

    if (!outputValue) return;
    const textToCopy = outputRef.current?.innerText || '';
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const isOutputImage = (tool.id === 'image' || tool.id === 'image_bg_remover') && outputValue.startsWith('data:image');

  const renderFileInput = () => (
    <div className="flex flex-col h-full">
      <div className="relative border-2 border-dashed border-white/30 rounded-xl p-6 text-center flex-grow flex flex-col justify-center items-center">
        <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept={tool.id === 'video_text_extractor' ? 'video/*' : 'image/*'}
        />
        {!file ? (
          <>
            <UploadIcon />
            <p className="mt-2 text-sm text-white/80">{t.upload_file}</p>
            <p className="text-xs text-white/60">{t.or_drop_file}</p>
          </>
        ) : (
          <>
            {filePreview && file?.type.startsWith('image/') && (
              <div className="mb-2">
                <p className="font-semibold text-sm mb-1">{t.image_preview}</p>
                <img src={filePreview} alt="Preview" className="max-h-24 rounded-lg mx-auto" />
              </div>
            )}
            {filePreview && file?.type.startsWith('video/') && (
              <div className="mb-2">
                <p className="font-semibold text-sm mb-1">{t.video_preview}</p>
                <video src={filePreview} controls className="max-h-28 rounded-lg mx-auto" />
              </div>
            )}
            <div className="text-sm">
              <p className="font-semibold break-all">{file.name}</p>
              <p className="text-xs text-white/70">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>
          </>
        )}
      </div>
      <p className="text-center text-xs text-white/60 mt-2">{t.max_file_size.replace('{size}', maxFileSizeMB)}</p>
    </div>
  );

  const isButtonDisabled = isLoading || (isFileInput ? !file : !inputValue.trim()) || (mode === 'trial' && user?.points !== undefined && user.points < POINTS_PER_GENERATION);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{tool.icon}</div>
          <div>
            <h3 className="text-2xl font-bold">{tool.title[language]}</h3>
            <p className="opacity-80">{tool.description[language]}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label={t.close}>
          <CloseIcon />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="flex flex-col gap-4">
          <label className="font-semibold">{tool.inputLabel[language]}</label>

          {isFileInput ? (
            renderFileInput()
          ) : (
            <div className="relative">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={tool.placeholder[language]}
                    className="w-full h-48 md:h-full bg-white/10 dark:bg-gray-900/20 rounded-xl p-4 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none transition-colors"
                    rows={10}
                />
                <div className="absolute top-2 ltr:right-2 rtl:left-2 flex gap-1">
                    <button onClick={handlePaste} title={t.paste_button} className="p-1.5 rounded-md hover:bg-white/20 transition-colors text-white/70 hover:text-white"><PasteIcon /></button>
                    <button onClick={() => setInputValue('')} title={t.clear_button} className="p-1.5 rounded-md hover:bg-white/20 transition-colors text-white/70 hover:text-white"><ClearIcon /></button>
                </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isButtonDisabled}
            className="bg-indigo-500 hover:bg-indigo-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner /> : <span>{tool.id === 'video_text_extractor' ? t.extract_text_button : t.generate_button}</span>}
          </button>
           {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        {/* Output Column */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="font-semibold">{language === 'ar' ? 'النتيجة' : 'Output'}</label>
            <div className="flex gap-1">
                {(outputValue || structuredOutput) && !isOutputImage && (
                    <>
                        <button onClick={handleCopy} title={isCopied ? t.copied_button : t.copy_button} className="p-1.5 rounded-md hover:bg-white/20 transition-colors text-white/70 hover:text-white">
                            {isCopied ? '✅' : <CopyIcon />}
                        </button>
                        <button onClick={() => { setOutputValue(''); setStructuredOutput(null); }} title={t.clear_button} className="p-1.5 rounded-md hover:bg-white/20 transition-colors text-white/70 hover:text-white">
                            <ClearIcon />
                        </button>
                    </>
                )}
            </div>
          </div>
          <div className="w-full h-48 md:h-[calc(100%-60px)] bg-white/10 dark:bg-gray-900/20 rounded-xl p-4 relative overflow-y-auto">
             {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Spinner />
                <p className="mt-2 text-sm opacity-80">{loadingText || tool.loadingText[language]}</p>
              </div>
            )}
            {!isLoading && !outputValue && !structuredOutput && (
              <div className="text-white/50 h-full flex items-center justify-center">{t.output_placeholder}</div>
            )}

            {structuredOutput ? (
                <StructuredVideoOutput data={structuredOutput} t={t} outputRef={outputRef}/>
            ) : (
              <div ref={outputRef} className="w-full h-full">
                  {outputValue && (
                      isOutputImage ? (
                          <img src={outputValue} alt="Generated output" className="w-full h-full object-contain rounded-lg" />
                      ) : (
                          <pre className="whitespace-pre-wrap text-sm font-sans">{outputValue}</pre>
                      )
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};