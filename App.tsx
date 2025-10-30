import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToolGrid } from './components/ToolGrid';
import { ToolInterface } from './components/ToolInterface';
import { Footer } from './components/Footer';
import { Stats } from './components/Stats';
import { CategoryTabs } from './components/CategoryTabs';
import { TOOLS, CATEGORIES } from './constants';
import type { Tool, Language, CategoryType, User } from './types';
import { translations } from './translations';
import { auth } from './services/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CATEGORIES[0].id);
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setAuthInitialized(true);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

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
  
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user state
    } catch (error) {
      console.error("Authentication failed:", error);
      alert(language === 'ar' ? 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.' : 'Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting user state to null
    } catch (error) {
      console.error("Sign out failed:", error);
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
        t={t}
        authInitialized={authInitialized}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-down">{t.main_title}</h2>
          <p className="text-lg sm:text-xl opacity-90 animate-fade-in-up">{t.main_subtitle}</p>
        </div>

        <CategoryTabs 
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          language={language}
        />

        <ToolGrid tools={filteredTools} onSelectTool={handleSelectTool} language={language} />

        {selectedTool && (
          <div id="tool-interface" className="mt-12">
            <ToolInterface tool={selectedTool} onClose={handleCloseTool} language={language} t={t} />
          </div>
        )}

        <Stats t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}
