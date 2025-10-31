import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToolGrid } from './components/ToolGrid';
import { ToolInterface } from './components/ToolInterface';
import { Footer } from './components/Footer';
import { Stats } from './components/Stats';
import { CategoryTabs } from './components/CategoryTabs';
import { LoginModal } from './components/LoginModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { TOOLS, CATEGORIES } from './constants';
import type { Tool, Language, CategoryType, User, AppMode } from './types';
import { translations } from './translations';
import { auth, getUserProfile, createUserProfile, deductUserPoint } from './services/firebase';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CATEGORIES[0].id);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [mode, setMode] = useState<AppMode>('trial');
  
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

  // Effect to handle Firebase auth state changes.
  useEffect(() => {
    if (!isAuthEnabled || !auth) {
      setAuthInitialized(true);
      setUser(null);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          let userProfile = await getUserProfile(firebaseUser.uid);
          if (!userProfile) {
            userProfile = await createUserProfile(firebaseUser.uid, firebaseUser.displayName || undefined);
          }
          const displayName = firebaseUser.displayName || userProfile?.displayName;
          const appUser: User = {
            uid: firebaseUser.uid,
            name: { ar: displayName || 'مستخدم', en: displayName || 'User' },
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || 'https://avatar.iran.liara.run/public/boy',
            points: userProfile.points ?? 0, // FIX: Provide a fallback to prevent crashes if points are missing.
          };
          setUser(appUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error during authentication state change:", error);
        setUser(null); // Reset user state on error
      } finally {
        setAuthInitialized(true); // FIX: Ensure initialization is always marked as complete.
      }
    });
    
    return () => unsubscribe();
  }, [isAuthEnabled]);

  const handleDeductPoint = async (amount: number) => {
    if (user && user.points > 0) {
        try {
            const newPoints = await deductUserPoint(user.uid, user.points, amount);
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
  
  const handleSubscribe = () => {
    setMode('premium');
    setIsSubscriptionModalOpen(false);
  };

  const handleLogout = async () => {
    if (!isAuthEnabled || !auth) return;
    try {
      await signOut(auth);
      setMode('trial');
      // onAuthStateChanged will handle setting user to null
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
        onSubscribe={() => setIsSubscriptionModalOpen(true)}
        authInitialized={authInitialized}
        isAuthEnabled={isAuthEnabled}
        mode={mode}
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
            <ToolInterface 
                tool={selectedTool} 
                onClose={handleCloseTool} 
                language={language} 
                t={t}
                mode={mode}
                userApiKey={null}
                user={user}
                onDeductPoint={handleDeductPoint}
                onLogin={handleLogin}
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
          onClose={() => {
            setIsLoginModalOpen(false);
          }}
          t={t}
          language={language}
        />
      )}
      {isSubscriptionModalOpen && (
        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          onSubscribe={handleSubscribe}
          t={t}
          language={language}
        />
      )}
    </div>
  );
}