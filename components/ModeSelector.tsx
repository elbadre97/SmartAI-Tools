import React, { useState, useEffect, useRef } from 'react';
import type { AppMode, Language } from '../types';

interface ModeSelectorProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  language: Language;
  t: Record<string, string>;
  userApiKey: string | null;
  onApiKeySettings: () => void;
}

const ModeIcon = ({ mode }: { mode: AppMode }) => {
    switch (mode) {
        case 'trial': return <span className="text-xl">💎</span>;
        case 'user_api': return <span className="text-xl">🔑</span>;
        case 'premium': return <span className="text-xl">⭐</span>;
        default: return null;
    }
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange, t, userApiKey, onApiKeySettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modes: { id: AppMode; title: string; desc: string; }[] = [
    { id: 'trial', title: t.mode_trial, desc: t.mode_trial_desc },
    { id: 'user_api', title: t.mode_user_api, desc: t.mode_user_api_desc },
  ];

  const currentModeDetails = modes.find(m => m.id === mode) || modes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedMode: AppMode) => {
    if (selectedMode === 'user_api') {
      onApiKeySettings();
    } else {
      onModeChange(selectedMode);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-white/20 transition-colors h-10 flex items-center justify-center gap-2"
        aria-label="Toggle Mode"
        title={t.mode}
      >
        <ModeIcon mode={mode} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 ltr:right-0 rtl:left-0 w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in-down">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className={`w-full text-left rtl:text-right p-3 rounded-lg transition-colors flex items-start gap-3 ${
                mode === m.id ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
                <div className="bg-black/5 dark:bg-white/10 p-2 rounded-md"><ModeIcon mode={m.id} /></div>
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        {m.title}
                        {m.id === 'user_api' && userApiKey && <span className="text-green-400" title="API Key is set">✓</span>}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-white/80">{m.desc}</p>
                </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};