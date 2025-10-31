import React, { useState, useEffect, useRef } from 'react';
import type { User, Language, AppMode } from '../types';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  t: Record<string, string>;
  language: Language;
  mode: AppMode;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, t, language, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img
          src={user.photoURL}
          alt={user.name[language]}
          className="w-9 h-9 rounded-full border-2 border-white/50"
        />
        <span className="font-semibold hidden sm:inline">{user.name[language]}</span>
        <svg className={`w-4 h-4 transition-transform hidden sm:inline ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 ltr:right-0 rtl:left-0 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in-down">
          <div className="border-b border-white/20 pb-3 mb-3">
            <p className="font-bold text-gray-800 dark:text-white truncate">{user.name[language]}</p>
            <p className="text-sm text-gray-600 dark:text-white/70 truncate">{user.email}</p>
          </div>

          {mode === 'trial' && (
            <div className="mb-3">
               <div className="bg-black/5 dark:bg-white/10 text-sm font-semibold px-3 py-2 rounded-lg flex items-center justify-between">
                  <span>{t.points_remaining.replace('{count}', '').trim()}</span>
                  <div className="flex items-center gap-1">
                     <span>💎</span>
                     <span className="font-bold text-base">{user.points}</span>
                  </div>
               </div>
            </div>
          )}

          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full text-center px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-colors font-semibold"
          >
            {t.logout}
          </button>
        </div>
      )}
    </div>
  );
};
