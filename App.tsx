import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToolGrid } from './components/ToolGrid';
import { ToolInterface } from './components/ToolInterface';
import { Footer } from './components/Footer';
import { Stats } from './components/Stats';
import { CategoryTabs } from './components/CategoryTabs';
import { ApiKeyModal } from './components/ApiKeyModal';
import { TOOLS, CATEGORIES } from './constants';
import type { Tool, Language, CategoryType } from './types';
import { translations } from './translations';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CATEGORIES[0].id);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  
  useEffect(() => {
    const storedApiKey = localStorage.getItem('userGeminiApiKey');
    if (storedApiKey) {
      setUserApiKey(storedApiKey);
    } else {
      setIsApiKeyModalOpen(true);
    }
  }, []);

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
  
  const handleSaveApiKey = (key: string) => {
    const newKey = key.trim();
    if (newKey) {
        setUserApiKey(newKey);
        localStorage.setItem('userGeminiApiKey', newKey);
    } else {
        setUserApiKey(null);
        localStorage.removeItem('userGeminiApiKey');
    }
    setIsApiKeyModalOpen(false);
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
  
  const t = translations[language];
  const filteredTools = TOOLS.filter(tool => tool.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white font-sans transition-colors duration-500">
      <Header 
        theme={theme} 
        toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        language={language}
        toggleLanguage={() => setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'))}
        onApiKeySettings={() => setIsApiKeyModalOpen(true)}
        t={t}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-down bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">{t.main_title}</h2>
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
                userApiKey={userApiKey}
            />
          </div>
        )}

        <div id="features-section" className="mt-16">
          <Stats t={t} />
        </div>
      </main>
      <Footer t={t} />
       <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          onSave={handleSaveApiKey}
          currentKey={userApiKey}
          t={t}
          language={language}
        />
    </div>
  );
}