import React from 'react';
import { ToolCard } from './ToolCard';
import type { Tool, Language } from '../types';

interface ToolGridProps {
  tools: Tool[];
  onSelectTool: (toolId: string) => void;
  language: Language;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools, onSelectTool, language }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12 animate-fade-in-up">
      {tools.map(tool => (
        <ToolCard 
          key={tool.id} 
          tool={tool} 
          onSelect={() => onSelectTool(tool.id)}
          language={language} 
        />
      ))}
    </div>
  );
};
