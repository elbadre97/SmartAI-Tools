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

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const ToolInterface: React.FC<ToolInterfaceProps> = ({ tool, onClose, language, t }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const [compressionQuality, setCompressionQuality] = useState(0.8);
  const [compressorFormat, setCompressorFormat] = useState('jpeg');
  const [sizeInfo, setSizeInfo] = useState<{ original: number; compressed: number } | null>(null);

  const isFileInputTool = tool.inputType === 'image' || tool.inputType === 'file';
  const imageOutputTools = ['image', 'image_bg_remover', 'file_converter', 'file_compressor'];
  const isImageOutput = imageOutputTools.includes(tool.id);

  useEffect(() => {
    setInputText('');
    setOutputText('');
    setIsLoading(false);
    setError(null);
    setCharCount(0);
    setUploadedFile(null);
    setFilePreview(null);
    setOutputFormat('png');
    setCompressionQuality(0.8);
    setCompressorFormat('jpeg');
    setSizeInfo(null);
  }, [tool]);

  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      if ((tool.id === 'image_bg_remover' || tool.id === 'file_compressor') && !file.type.startsWith('image/')) {
        setError(t.invalid_file_type);
        return;
      }
        
      setUploadedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
      setError(null);
      setOutputText('');
      setSizeInfo(null);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileChange(e.dataTransfer.files);
  };

  const handleGenerate = async () => {
    setOutputText('');
    setError(null);
    setIsLoading(true);
    setSizeInfo(null);

    try {
        let result: string;
        if (tool.id === 'file_compressor') {
            if (!uploadedFile) {
                setError(t.file_required_error);
                setIsLoading(false);
                return;
            }
             if (!uploadedFile.type.startsWith('image/')) {
                setError(t.image_compression_only_error);
                setIsLoading(false);
                return;
            }
            const image = new Image();
            const objectUrl = URL.createObjectURL(uploadedFile);

            result = await new Promise<string>((resolve, reject) => {
                image.onload = async () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }
                    ctx.drawImage(image, 0, 0);
                    
                    const mimeType = `image/${compressorFormat}`;
                    const dataUrl = canvas.toDataURL(mimeType, compressionQuality);
                    URL.revokeObjectURL(objectUrl);
                    
                    const blob = await (await fetch(dataUrl)).blob();
                    setSizeInfo({ original: uploadedFile.size, compressed: blob.size });

                    resolve(dataUrl);
                };
                image.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error("Failed to load image for compression."));
                }
                image.src = objectUrl;
            });
        }
        else if (tool.id === 'file_converter') {
            if (!uploadedFile) {
                setError(t.file_required_error);
                setIsLoading(false);
                return;
            }
            if (!uploadedFile.type.startsWith('image/')) {
                setError(t.image_conversion_only_error);
                setIsLoading(false);
                return;
            }

            const image = new Image();
            const objectUrl = URL.createObjectURL(uploadedFile);

            result = await new Promise<string>((resolve, reject) => {
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }
                    ctx.drawImage(image, 0, 0);
                    const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : `image/${outputFormat}`;
                    const dataUrl = canvas.toDataURL(mimeType, 0.92);
                    URL.revokeObjectURL(objectUrl);
                    resolve(dataUrl);
                };
                image.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error("Failed to load image for conversion."));
                }
                image.src = objectUrl;
            });
        } else if (tool.inputType === 'image') { // Specifically for bg remover & prompt extractor
            if (!uploadedFile) {
                setError(t.image_required_error);
                setIsLoading(false);
                return;
            }
            const base64String = await fileToBase64(uploadedFile);
            const inputData = { data: base64String.split(',')[1], mimeType: uploadedFile.type };
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
      setUploadedFile(null);
      setFilePreview(null);
  }
  const copyInput = () => navigator.clipboard.writeText(inputText);

  const pasteInput = async () => {
    if (!navigator.clipboard?.readText) {
      setError(t.clipboard_paste_error);
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      setError(null); // Clear error on successful paste
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setError(t.clipboard_paste_error);
    }
  };

  const copyResult = () => navigator.clipboard.writeText(outputText);

  const saveResult = () => {
    if(isImageOutput && outputText.startsWith('data:image')) {
        const a = document.createElement('a');
        a.href = outputText;
        
        let filename;
        switch (tool.id) {
            case 'image':
                filename = `ai-image-${Date.now()}.jpeg`;
                break;
            case 'image_bg_remover':
                filename = `bg-removed-${Date.now()}.png`;
                break;
            case 'file_converter':
                const extension = outputFormat === 'jpg' ? 'jpeg' : outputFormat;
                filename = `converted-${Date.now()}.${extension}`;
                break;
            case 'file_compressor':
                filename = `compressed-${Date.now()}.${compressorFormat}`;
                break;
            default:
                filename = `ai-image-${Date.now()}.png`;
        }
        a.download = filename;
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
        text: isImageOutput ? `Image processed with SmartAI Tools` : outputText,
      }).catch(err => console.error("Share failed:", err));
    } else {
      alert(t.share_not_supported);
    }
  };

  const isActionDisabled = isLoading || tool.id === 'video_downloader';

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
        {isFileInputTool ? (
             <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="relative">
                <input
                    id="tool-input"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept={tool.id === 'image_bg_remover' || tool.id === 'file_converter' || tool.id === 'file_compressor' ? "image/png, image/jpeg, image/webp" : "*/*"}
                    onChange={(e) => handleFileChange(e.target.files)}
                    disabled={isLoading}
                />
                <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center bg-white/50 dark:bg-gray-700/50 transition-colors min-h-[150px] flex flex-col justify-center items-center">
                   {filePreview ? (
                       <img src={filePreview} alt={t.image_preview} className="max-h-48 rounded-lg object-contain" />
                   ) : uploadedFile ? (
                       <p className="text-gray-800 dark:text-white font-medium">{uploadedFile.name}</p>
                   ) : (
                       <>
                        <UploadIcon />
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{tool.placeholder[language]}</p>
                        {tool.id === 'image_bg_remover' && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.supported_formats}: PNG, JPG, WEBP</p>}
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

        {tool.id === 'file_converter' && (
            <div className="mt-4">
                <label htmlFor="output-format" className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">{t.target_format_label}</label>
                <select 
                    id="output-format" 
                    value={outputFormat} 
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/50 text-gray-800 dark:text-white bg-white/50 dark:bg-gray-700/50 transition-colors"
                    disabled={isLoading}
                >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                    <option value="webp">WEBP</option>
                    <option value="gif">GIF</option>
                    <option value="pdf" disabled>{t.pdf_format} ({t.coming_soon_title})</option>
                </select>
            </div>
        )}
        
        {tool.id === 'file_compressor' && (
            <div className="mt-4">
                <label htmlFor="compression-quality" className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">{t.compression_quality}: {Math.round(compressionQuality * 100)}%</label>
                 <input
                    id="compression-quality"
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={compressionQuality}
                    onChange={(e) => setCompressionQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isLoading}
                />
                 <div className="mt-4">
                    <label htmlFor="compressor-format" className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">{t.compressor_target_format_label}</label>
                    <select 
                        id="compressor-format" 
                        value={compressorFormat} 
                        onChange={(e) => setCompressorFormat(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/50 text-gray-800 dark:text-white bg-white/50 dark:bg-gray-700/50 transition-colors"
                        disabled={isLoading}
                    >
                        <option value="jpeg">JPEG (For photos)</option>
                        <option value="webp">WEBP (Modern & efficient)</option>
                    </select>
                </div>
            </div>
        )}

        {!isFileInputTool && (
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{charCount} {t.char_count}</span>
            </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button 
          onClick={handleGenerate} 
          disabled={isActionDisabled}
          className="flex items-center justify-center gap-2 w-full sm:flex-grow bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? <Spinner /> : '⚡'}
          <span>{isLoading ? tool.loadingText[language] : (tool.id === 'file_converter' ? t.convert : (tool.id === 'file_compressor' ? t.compress : t.generate)) }</span>
        </button>
        {!isFileInputTool && (
            <div className="flex gap-3 justify-center">
                <button onClick={copyInput} className="p-3 rounded-lg bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors" title={t.copy_input}><CopyIcon /></button>
                <button onClick={pasteInput} className="p-3 rounded-lg bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors" title={t.paste}><PasteIcon /></button>
            </div>
        )}
      </div>
      
      {(tool.id === 'video_downloader' || tool.id === 'file_converter' || tool.id === 'file_compressor') && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-800/30 border border-yellow-300 dark:border-yellow-700/50 text-center text-yellow-800 dark:text-yellow-200">
            <p className="font-bold text-lg">💡 {t.feature_update_title}</p>
            <p className="mt-1 text-sm">
                {tool.id === 'video_downloader' ? t.video_downloader_explanation : 
                 (tool.id === 'file_converter' ? t.file_converter_explanation : t.file_compressor_explanation)}
            </p>
        </div>
      )}

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
            {sizeInfo && (
                 <div className="grid grid-cols-3 gap-2 text-center mb-4 text-sm">
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
                        <div className="font-bold">{t.original_size}</div>
                        <div>{formatBytes(sizeInfo.original)}</div>
                    </div>
                    <div className="p-2 bg-green-200 dark:bg-green-800 rounded-md text-green-800 dark:text-green-100">
                        <div className="font-bold">{t.compressed_size}</div>
                        <div>{formatBytes(sizeInfo.compressed)}</div>
                    </div>
                    <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-md text-blue-800 dark:text-blue-100">
                        <div className="font-bold">{t.size_reduction}</div>
                        <div>{Math.round(100 - (sizeInfo.compressed / sizeInfo.original * 100))}%</div>
                    </div>
                </div>
            )}
            <div className="bg-gray-100 dark:bg-gray-900/50 rounded-xl p-4 min-h-32 text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words overflow-x-auto flex justify-center items-center">
                {isImageOutput ? (
                    <img src={outputText} alt={tool.id === 'file_converter' ? t.converted_image_alt : (tool.id === 'file_compressor' ? t.compressed_image_alt : t.generated_ai_alt)} className="rounded-lg max-w-full h-auto mx-auto shadow-md" />
                ) : (
                    <code className="text-sm md:text-base">{outputText}</code>
                )}
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
                {!isImageOutput && <button onClick={copyResult} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"><CopyIcon /> {t.copy_result}</button>}
                <button onClick={saveResult} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"><SaveIcon /> {t.save}</button>
                <button onClick={shareResult} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"><ShareIcon /> {t.share}</button>
            </div>
        </div>
      )}
    </div>
  );
};