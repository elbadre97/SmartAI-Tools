import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToolGrid } from './components/ToolGrid';
import { ToolInterface } from './components/ToolInterface';
import { Footer } from './components/Footer';
import { Stats } from './components/Stats';
import { CategoryTabs } from './components/CategoryTabs';
import { LoginModal } from './components/LoginModal';
import { TOOLS, CATEGORIES } from './constants';
import type { Tool, Language, CategoryType, User } from './types';
import { translations } from './translations';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CATEGORIES[0].id);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Determine if authentication is configured and enabled
  const isAuthEnabled = !!auth;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const themeColor = theme === 'dark' ? '#1F2937' : '#6B7280';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    // Only set up the auth state listener if Firebase Auth was initialized successfully
    if (isAuthEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const appUser: User = {
            name: {
              ar: firebaseUser.displayName || 'مستخدم',
              en: firebaseUser.displayName || 'User',
            },
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || 'https://avatar.iran.liara.run/public/boy',
          };
          setUser(appUser);
        } else {
          setUser(null);
        }
        setAuthInitialized(true);
      });

      return () => unsubscribe();
    } else {
      // If auth is not enabled, mark it as initialized and proceed without a user
      setAuthInitialized(true);
      setUser(null);
    }
  }, [isAuthEnabled]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleSelectTool = (toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (tool) {
      setSelectedTool(tool);
      setTimeout(() => {
        document.getElementById('tool-interface')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleCloseTool = () => {
    setSelectedTool(null);
  };
  
  const handleLogin = () => {
    // The button that calls this is disabled when auth is not enabled,
    // so the 'else' block with the alert was unreachable.
    if (isAuthEnabled) {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = async () => {
    // Only attempt to sign out if auth is enabled
    if (!isAuthEnabled || !auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const t = translations[language];

  const filteredTools = TOOLS.filter(tool => tool.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white font-sans transition-colors duration-500">
      <Header 
        theme={theme} 
        toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        language={language}
        toggleLanguage={toggleLanguage}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        authInitialized={authInitialized}
        isAuthEnabled={isAuthEnabled}
        t={t}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-down">{t.main_title}</h2>
          <p className="text-lg sm:text-xl opacity-90 animate-fade-in-up">{t.main_subtitle}</p>
        </div>

        <div id="tools-section">
          <CategoryTabs 
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            language={language}
          />
          <ToolGrid tools={filteredTools} onSelectTool={handleSelectTool} language={language} />
        </div>

        {selectedTool && (
          <div id="tool-interface" className="mt-12">
            <ToolInterface tool={selectedTool} onClose={handleCloseTool} language={language} t={t} />
          </div>
        )}

        <div id="features-section" className="mt-16">
          <Stats t={t} />
        </div>
      </main>
      <Footer t={t} />
      {isLoginModalOpen && (
        <LoginModal 
          onClose={() => setIsLoginModalOpen(false)}
          t={t}
          language={language}
        />
      )}
    </div>
  );
}