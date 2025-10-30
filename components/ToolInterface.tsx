import React, { useState, useEffect, useCallback } from 'react';
import type { Tool, Language } from '../types';
import { generateContent } from '../services/geminiService';
import { Spinner } from './icons/Spinner';
import { CopyIcon, PasteIcon, ClearIcon, SaveIcon, ShareIcon, CloseIcon, UploadIcon } from './icons/ActionIcons';

interface ToolInterfaceProps {
  tool: Tool;
  onClose: () => void;
  language: Language;
  t: Record<string, string>;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const ToolInterface: React.FC<ToolInterfaceProps> = ({ tool, onClose, language, t }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isImageTool = tool.inputType === 'image';

  useEffect(() => {
    setInputText('');
    setOutputText('');
    setIsLoading(false);
    setError(null);
    setCharCount(0);
    setImageFile(null);
    setImagePreview(null);
  }, [tool]);

  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

  const handleImageChange = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setError(null);
    } else if (file) {
        setError(t.invalid_file_type);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleImageChange(e.dataTransfer.files);
  };

  const handleGenerate = async () => {
    setOutputText('');
    setError(null);
    setIsLoading(true);

    try {
        let result: string;
        if (isImageTool) {
            if (!imageFile) {
                setError(t.image_required_error);
                setIsLoading(false);
                return;
            }
            const base64String = await fileToBase64(imageFile);
            const inputData = { data: base64String.split(',')[1], mimeType: imageFile.type };
            result = await generateContent(tool.id, inputData, language);
        } else {
            if (!inputText.trim()) {
                setError(t.input_required_error);
                setIsLoading(false);
                return;
            }
            result = await generateContent(tool.id, inputText, language);
        }
        setOutputText(result);
    } catch (e: any) {
        setError(e.message || t.api_error);
    } finally {
        setIsLoading(false);
    }
  };

  const clearInput = () => {
      setInputText('');
      setImageFile(null);
      setImagePreview(null);
  }
  const copyInput = () => navigator.clipboard.writeText(inputText);

  const pasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err)
      {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const copyResult = () => navigator.clipboard.writeText(outputText);

  const saveResult = () => {
    if((tool.id === 'image' || tool.id === 'image_bg_remover') && outputText.startsWith('data:image')) {
        const a = document.createElement('a');
        a.href = outputText;
        a.download = `ai-image-${Date.now()}.png`;
        a.click();
        return;
    }
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-result-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: `Result from ${tool.title[language]}`,
        text: (isImageTool || tool.id === 'image') ? `Image generated with SmartAI Tools` : outputText,
      }).catch(err => console.error("Share failed:", err));
    } else {
      alert(t.share_not_supported);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto shadow-2xl animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{tool.title[language]}</h3>
        <button onClick={onClose} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label={t.close}>
            <CloseIcon />
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="tool-input" className="block text-gray-700 dark:text-gray-200 mb-3 font-medium">{tool.inputLabel[language]}</label>
        {isImageTool ? (
             <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="relative">
                <input
                    id="tool-input"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => handleImageChange(e.target.files)}
                    disabled={isLoading}
                />
                <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center bg-white/50 dark:bg-gray-700/50 transition-colors min-h-[150px] flex flex-col justify-center items-center">
                   {imagePreview ? (
                       <img src={imagePreview} alt={t.image_preview} className="max-h-48 rounded-lg object-contain" />
                   ) : (
                       <>
                        <UploadIcon />
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{tool.placeholder[language]}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.supported_formats}: PNG, JPG, WEBP</p>
                       </>
                   )}
                </div>
            </div>
        ) : (
            <div className="relative">
                 <textarea
                    id="tool-input"
                    rows={6}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full p-4 ltr:pr-12 rtl:pl-12 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/50 text-gray-800 dark:text-white bg-white/50 dark:bg-gray-700/50 transition-colors"
                    placeholder={tool.placeholder[language]}
                    disabled={isLoading}
                />
                <button onClick={clearInput} className="absolute top-3 ltr:right-3 rtl:left-3 text-gray-500 hover:text-red-500 transition-colors" title={t.clear_all}>
                    <ClearIcon />
                </button>
            </div>
        )}

        {!isImageTool && (
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{charCount} {t.char_count}</span>
            </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button 
          onClick={handleGenerate} 
          disabled={isLoading} 
          className="flex items-center justify-center gap-2 w-full sm:flex-grow bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? <Spinner /> : '⚡'}
          <span>{isLoading ? tool.loadingText[language] : t.generate}</span>
        </button>
        {!isImageTool && (
            <div className="flex gap-3 justify-center">
                <button onClick={copyInput} className="p-3 rounded-lg bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors" title={t.copy_input}><CopyIcon /></button>
                <button onClick={pasteInput} className="p-3 rounded-lg bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors" title={t.paste}><PasteIcon /></button>
            </div>
        )}
      </div>
      
      {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 rounded-lg p-3 text-center mb-6">{error}</div>}

      {(isLoading && !outputText) && (
        <div className="text-center py-8">
            <div className="mx-auto mb-4 w-max"><Spinner /></div>
            <p className="text-gray-600 dark:text-gray-300">{tool.loadingText[language]}</p>
        </div>
      )}

      {outputText && !isLoading && (
        <div className="animate-fade-in-up">
            <label className="block text-gray-700 dark:text-gray-200 mb-3 font-medium">{t.result}</label>
            <div className="bg-gray-100 dark:bg-gray-900/50 rounded-xl p-4 min-h-32 text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words overflow-x-auto flex justify-center items-center">
                {(tool.id === 'image' || isImageTool) ? (
                    <img src={outputText} alt={t.generated_ai_alt} className="rounded-lg max-w-full h-auto mx-auto shadow-md" />
                ) : (
                    <code className="text-sm md:text-base">{outputText}</code>
                )}
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
                {!(isImageTool || tool.id === 'image') && <button onClick={copyResult} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"><CopyIcon /> {t.copy_result}</button>}
                <button onClick={saveResult} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"><SaveIcon /> {t.save}</button>
                <button onClick={shareResult} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"><ShareIcon /> {t.share}</button>
            </div>
        </div>
      )}
    </div>
  );
};