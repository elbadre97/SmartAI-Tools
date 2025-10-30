import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToolGrid } from './components/ToolGrid';
import { ToolInterface } from './components/ToolInterface';
import { Footer } from './components/Footer';
import { Stats } from './components/Stats';
import { CategoryTabs } from './components/CategoryTabs';
import { LoginModal } from './components/LoginModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { TOOLS, CATEGORIES } from './constants';
import type { Tool, Language, CategoryType, User, AppMode } from './types';
import { translations } from './translations';
import { auth, getUserProfile, createUserProfile, deductUserPoint } from './services/firebase';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';

const USER_API_KEY_STORAGE_KEY = 'smartai-user-api-key';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CATEGORIES[0].id);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  const [mode, setMode] = useState<AppMode>('free');
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<AppMode | null>(null);

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
    try {
        const storedKey = localStorage.getItem(USER_API_KEY_STORAGE_KEY);
        if (storedKey) {
            setUserApiKey(storedKey);
        }
    } catch (error) {
        console.error("Could not read user API key from local storage:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          let userProfile = await getUserProfile(firebaseUser.uid);
          if (!userProfile) {
            userProfile = await createUserProfile(firebaseUser.uid);
          }
          
          const appUser: User = {
            uid: firebaseUser.uid,
            name: { ar: firebaseUser.displayName || 'مستخدم', en: firebaseUser.displayName || 'User' },
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || 'https://avatar.iran.liara.run/public/boy',
            points: userProfile.points,
          };
          setUser(appUser);
          
          if (pendingMode === 'premium') {
              setMode('premium');
              setPendingMode(null);
          } else if (pendingMode === 'trial' || !pendingMode) {
              setMode('trial');
              setPendingMode(null);
          }
        } else {
          setUser(null);
          setMode('free'); // Revert to free for guests
        }
        setAuthInitialized(true);
      });
      return () => unsubscribe();
    } else {
      setAuthInitialized(true);
      setUser(null);
      setMode('free');
    }
  }, [isAuthEnabled, pendingMode]);

  const handleSetUserApiKey = (key: string) => {
    const newKey = key.trim();
    if (newKey) {
        setUserApiKey(newKey);
        localStorage.setItem(USER_API_KEY_STORAGE_KEY, newKey);
        if (pendingMode === 'user_api') {
            setMode('user_api');
            setPendingMode(null);
        }
    } else {
        setUserApiKey(null);
        localStorage.removeItem(USER_API_KEY_STORAGE_KEY);
        if (mode === 'user_api') setMode('free');
    }
  };

  const handleModeChange = (newMode: AppMode) => {
    if ((newMode === 'trial' || newMode === 'premium') && !user) {
        setPendingMode(newMode);
        setIsLoginModalOpen(true);
        return;
    }
    if (newMode === 'user_api' && !userApiKey) {
        setPendingMode('user_api');
        setIsApiKeyModalOpen(true);
        return;
    }
    setMode(newMode);
    setPendingMode(null);
  };

  const handleDeductPoint = async () => {
    if (user && mode === 'trial' && user.points > 0) {
        try {
            const newPoints = await deductUserPoint(user.uid, user.points);
            setUser(prevUser => prevUser ? { ...prevUser, points: newPoints } : null);
        } catch (error) {
            console.error("Failed to deduct point:", error);
        }
    }
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

  const handleCloseTool = () => setSelectedTool(null);
  
  const handleLogin = () => {
    if (isAuthEnabled) setIsLoginModalOpen(true);
  };

  const handleLogout = async () => {
    if (!isAuthEnabled || !auth) return;
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting user to null and mode to 'free'
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
        toggleLanguage={() => setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'))}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        authInitialized={authInitialized}
        isAuthEnabled={isAuthEnabled}
        t={t}
        mode={mode}
        onModeChange={handleModeChange}
        userApiKey={userApiKey}
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
            <ToolInterface 
                tool={selectedTool} 
                onClose={handleCloseTool} 
                language={language} 
                t={t}
                mode={mode}
                userApiKey={userApiKey}
                user={user}
                onDeductPoint={handleDeductPoint}
            />
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
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => {
            setIsApiKeyModalOpen(false);
            setPendingMode(null);
        }}
        onSave={handleSetUserApiKey}
        currentKey={userApiKey}
        t={t}
        language={language}
      />
    </div>
  );
}