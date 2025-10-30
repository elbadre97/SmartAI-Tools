import React from 'react';
import type { Language, User } from '../types';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  t: Record<string, string>;
}

const ThemeIcon = ({ theme }: { theme: 'light' | 'dark' }) => (
  <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
);

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, language, toggleLanguage, user, onLogin, onLogout, t }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Adjusted for sticky header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="text-3xl">🤖</div>
            <h1 className="text-2xl font-bold">{t.header_title}</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 rtl:space-x-reverse font-medium">
            <button onClick={scrollToTop} className="text-white/90 hover:text-white transition-colors">{t.nav_home}</button>
            <button onClick={() => scrollToSection('tools-section')} className="text-white/90 hover:text-white transition-colors">{t.nav_tools}</button>
            <button onClick={() => scrollToSection('features-section')} className="text-white/90 hover:text-white transition-colors">{t.nav_features}</button>
          </nav>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-white/20 transition-colors w-10 h-10 flex items-center justify-center"
              aria-label="Toggle Language"
            >
              <span className="font-semibold">{t.lang_toggle}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Toggle Theme"
            >
              <ThemeIcon theme={theme} />
            </button>

            <div className="w-px h-6 bg-white/20 mx-2"></div>

            {user ? (
              <UserMenu user={user} onLogout={onLogout} t={t} language={language} />
            ) : (
              <button
                onClick={onLogin}
                className="bg-white/20 hover:bg-white/30 font-semibold px-4 py-2 rounded-full transition-colors text-sm"
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};