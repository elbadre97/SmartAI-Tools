import React from 'react';
import type { Tool, Language } from '../types';

interface ToolCardProps {
  tool: Tool;
  onSelect: () => void;
  language: Language;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect, language }) => {
  const isDisabled = tool.disabled;

  return (
    <div
      className={`relative bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl p-6 transition-all duration-300 ${
        isDisabled
          ? 'opacity-60 cursor-not-allowed'
          : 'cursor-pointer hover:bg-white/20 hover:-translate-y-1.5 hover:shadow-2xl'
      }`}
      onClick={!isDisabled ? onSelect : undefined}
      aria-disabled={isDisabled}
    >
      {isDisabled && (
        <div className="absolute top-3 ltr:right-3 rtl:left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
          {language === 'ar' ? 'قريباً' : 'SOON'}
        </div>
      )}
      <div className="text-4xl mb-4">{tool.icon}</div>
      <h3 className="text-xl font-bold mb-2">{tool.title[language]}</h3>
      <p className="opacity-80 text-sm">{tool.description[language]}</p>
    </div>
  );
};