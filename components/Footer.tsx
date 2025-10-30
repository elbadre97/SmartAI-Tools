
import React from 'react';

interface FooterProps {
    t: Record<string, string>;
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p>{t.footer_copyright}</p>
        <p className="opacity-80 mt-2">{t.footer_subtitle}</p>
      </div>
    </footer>
  );
};
