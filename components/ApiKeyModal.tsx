import React, { useState, useEffect } from "react";
import { CloseIcon } from './icons/ActionIcons';
import type { Language } from '../types';
import { Spinner } from './icons/Spinner';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string | null;
  t: Record<string, string>;
  language: Language;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentKey, t, language }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState(t.save_api_key);

  useEffect(() => {
    setApiKey(currentKey || '');
    setSaveButtonText(t.save_api_key);
  }, [isOpen, currentKey, t.save_api_key]);
  
  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaving(true);
    onSave(apiKey);
    setSaveButtonText(t.api_key_saved);
    setTimeout(() => {
        setIsSaving(false);
        onClose();
    }, 1500);
  };

  const handleClear = () => {
    setApiKey('');
    onSave('');
    onClose();
  };


  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 max-w-lg w-full mx-4 shadow-2xl animate-fade-in-up transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t.api_key_modal_title}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>

        <div className="animate-fade-in">
            <p className="text-gray-600 dark:text-gray-300 mb-4">{t.api_key_modal_subtitle}</p>
            
            <input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t.api_key_placeholder}
                className="w-full bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-colors border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-purple-400 hover:underline">
                    {t.api_key_get_yours}
                </a>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                    onClick={handleSave}
                    disabled={isSaving || !apiKey}
                    className="w-full flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out disabled:opacity-50"
                >
                    {isSaving ? <Spinner /> : null}
                    <span>{saveButtonText}</span>
                </button>
                 {currentKey && (
                    <button
                        onClick={handleClear}
                        className="w-full sm:w-auto bg-white/20 hover:bg-white/30 font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                       {t.clear_api_key}
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
