import React from 'react';
import type { User, Language } from '../types';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  t: Record<string, string>;
  language: Language;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, t, language }) => {
  return (
    <div className="flex items-center gap-3">
      <img
        src={user.photoURL}
        alt={user.name[language]}
        className="w-9 h-9 rounded-full border-2 border-white/50"
      />
      <span className="font-semibold hidden sm:inline">{user.name[language]}</span>
      <button
        onClick={onLogout}
        className="text-white/80 hover:text-white font-semibold text-sm transition-colors"
        aria-label={t.logout}
      >
        {t.logout}
      </button>
    </div>
  );
};