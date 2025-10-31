import React, { useState } from 'react';
import type { Language } from '../types';
import { PayPalIcon, VisaIcon, WooCommerceIcon } from './icons/PaymentIcons';
import { Spinner } from './icons/Spinner';

interface PaymentFormProps {
    t: Record<string, string>;
    language: Language;
    onBack: () => void;
    onSuccess: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ t, onBack, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'woocommerce'>('card');
    const [isLoading, setIsLoading] = useState(false);
    
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [errors, setErrors] = useState({ cardNumber: '', expiry: '', cvc: '' });

    const validateForm = () => {
        const newErrors = { cardNumber: '', expiry: '', cvc: '' };
        let isValid = true;
        
        if (paymentMethod === 'card') {
            if (cardNumber.replace(/\s/g, '').length !== 16) {
                newErrors.cardNumber = t.invalid_card_number;
                isValid = false;
            }
            if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
                newErrors.expiry = t.invalid_expiry_date;
                isValid = false;
            }
            if (cvc.length < 3 || cvc.length > 4) {
                newErrors.cvc = t.invalid_cvc;
                isValid = false;
            }
        }
        
        setErrors(newErrors);
        return isValid;
    };

    const handleConfirmPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onSuccess();
        }, 2500);
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
        setCardNumber(value.replace(/(.{4})/g, '$1 ').trim());
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        setExpiry(value);
    };
    
    const formInputClasses = "w-full bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-colors border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white";

    const confirmButtonText = {
        card: t.confirm_payment_button,
        paypal: t.proceed_to_paypal,
        woocommerce: t.proceed_to_woocommerce,
    }[paymentMethod];

    return (
        <form onSubmit={handleConfirmPayment} className="animate-fade-in">
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">{t.choose_payment_method}</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
                <PaymentMethodButton
                    label={t.pay_with_card}
                    icon={<VisaIcon />}
                    isActive={paymentMethod === 'card'}
                    onClick={() => setPaymentMethod('card')}
                />
                <PaymentMethodButton
                    label={t.pay_with_paypal}
                    icon={<PayPalIcon />}
                    isActive={paymentMethod === 'paypal'}
                    onClick={() => setPaymentMethod('paypal')}
                />
                 <PaymentMethodButton
                    label={t.pay_with_woocommerce}
                    icon={<WooCommerceIcon />}
                    isActive={paymentMethod === 'woocommerce'}
                    onClick={() => setPaymentMethod('woocommerce')}
                />
            </div>

            {paymentMethod === 'card' ? (
                <div className="space-y-4 mb-6 animate-fade-in-up">
                    <InputField label={t.card_number} error={errors.cardNumber}>
                        <input type="tel" value={cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" className={formInputClasses} autoComplete="cc-number" inputMode="numeric" />
                    </InputField>
                    <div className="flex gap-4">
                        <div className="w-2/3">
                            <InputField label={t.expiry_date} error={errors.expiry}>
                               <input type="tel" value={expiry} onChange={handleExpiryChange} placeholder={t.mm_yy} className={formInputClasses} autoComplete="cc-exp" inputMode="numeric" />
                            </InputField>
                        </div>
                         <div className="w-1/3">
                            <InputField label={t.cvc} error={errors.cvc}>
                               <input type="tel" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" className={formInputClasses} autoComplete="cc-csc" inputMode="numeric" />
                            </InputField>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center p-4 my-6 bg-black/5 dark:bg-white/10 rounded-lg animate-fade-in-up">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t.payment_redirect_message.replace('{service}', paymentMethod === 'paypal' ? 'PayPal' : 'WooCommerce')}
                    </p>
                </div>
            )}
            
            <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button type="button" onClick={onBack} className="w-full sm:w-auto bg-white/20 hover:bg-white/30 font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
                    {t.back_button}
                </button>
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-70">
                    {isLoading ? (
                        <>
                            <Spinner />
                            <span className="ltr:ml-2 rtl:mr-2">{t.processing_payment}</span>
                        </>
                    ) : (
                        <span>{confirmButtonText}</span>
                    )}
                </button>
            </div>
        </form>
    );
};

const PaymentMethodButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void }> = ({ label, icon, isActive, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all h-full ${
            isActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
        }`}
    >
        {icon}
        <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-white">{label}</span>
    </button>
);

const InputField: React.FC<{ label: string; children: React.ReactNode; error?: string }> = ({ label, children, error }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);