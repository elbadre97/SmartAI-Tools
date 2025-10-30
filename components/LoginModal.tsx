import React, { useState } from 'react';
import { CloseIcon } from './icons/ActionIcons';
import { MOCK_USERS } from '../constants';
import type { User, Language } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
  t: Record<string, string>;
  language: Language;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const UserPlusIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, t, language }) => {
  const [view, setView] = useState<'initial' | 'account-chooser'>('initial');

  const handleAccountSelect = (user: User) => {
    onLogin(user);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-4 shadow-2xl animate-fade-in-up transform transition-all min-h-[350px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {view === 'initial' ? t.login_modal_title : t.login_choose_account}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>

        {view === 'initial' && (
            <div className="text-center animate-fade-in">
                <p className="text-gray-600 dark:text-gray-300 mb-8">{t.login_modal_subtitle}</p>
                <button
                    onClick={() => setView('account-chooser')}
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out border border-gray-300 dark:border-gray-600"
                >
                    <GoogleIcon />
                    <span>{t.login_with_google}</span>
                </button>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                    {t.login_modal_disclaimer}
                </p>
            </div>
        )}

        {view === 'account-chooser' && (
             <div className="space-y-3 animate-fade-in">
                {MOCK_USERS.map(user => (
                    <button 
                        key={user.email} 
                        onClick={() => handleAccountSelect(user)}
                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                        <img src={user.photoURL} alt={user.name[language]} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{user.name[language]}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </button>
                ))}
                <button className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left text-gray-600 dark:text-gray-300">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <UserPlusIcon />
                    </div>
                    <div>
                        <p className="font-semibold">{t.login_use_another_account}</p>
                    </div>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};