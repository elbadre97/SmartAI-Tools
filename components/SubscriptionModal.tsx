import React, { useState } from 'react';
import { CloseIcon } from './icons/ActionIcons';
import { CheckCircleIcon } from './icons/FeatureIcons';
import type { Language } from '../types';
import { PaymentForm } from './PaymentForm';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  t: Record<string, string>;
  language: Language;
}

const FeatureListItem: React.FC<{ text: string }> = ({ text }) => (
    <li className="flex items-center gap-3">
        <CheckCircleIcon />
        <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </li>
);

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe, t, language }) => {
  const [view, setView] = useState<'details' | 'payment'>('details');

  if (!isOpen) return null;

  const handleClose = () => {
    setView('details');
    onClose();
  }

  const handleSubscribeSuccess = () => {
    onSubscribe();
    setView('details');
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl animate-fade-in-up transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {view === 'details' ? t.subscription_modal_title : t.payment_modal_title}
          </h2>
          <button onClick={handleClose} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>

        {view === 'details' ? (
          <div className="text-center animate-fade-in-up">
              <p className="text-gray-600 dark:text-gray-300 mb-6">{t.subscription_modal_subtitle}</p>

              <div className="bg-black/5 dark:bg-white/10 p-6 rounded-xl mb-6 text-left rtl:text-right">
                  <ul className="space-y-3">
                      <FeatureListItem text={t.premium_feature_1} />
                      <FeatureListItem text={t.premium_feature_2} />
                      <FeatureListItem text={t.premium_feature_3} />
                      <FeatureListItem text={t.premium_feature_4} />
                  </ul>
              </div>
              
              <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">$10</span>
                  <span className="text-gray-600 dark:text-gray-400"> / {t.price_per_month}</span>
              </div>

              <button
                  onClick={() => setView('payment')}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
              >
                  {t.subscribe_now_button}
              </button>
          </div>
        ) : (
          <PaymentForm 
            t={t}
            language={language}
            onBack={() => setView('details')}
            onSuccess={handleSubscribeSuccess}
          />
        )}
      </div>
    </div>
  );
};