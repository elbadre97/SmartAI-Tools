import React from 'react';
import type { Category, CategoryType, Language } from '../types';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: CategoryType;
  onSelectCategory: (categoryId: CategoryType) => void;
  language: Language;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, selectedCategory, onSelectCategory, language }) => {
  return (
    <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8 md:mb-12 animate-fade-in-up">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold rounded-full transition-all duration-300 flex items-center gap-2 ${
            selectedCategory === category.id
              ? 'bg-white/90 text-indigo-600 shadow-lg'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.title[language]}</span>
        </button>
      ))}
    </div>
  );
};
