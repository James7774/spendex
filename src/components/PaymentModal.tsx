"use client";
import React, { useState } from 'react';
import styles from './PaymentModal.module.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, planName, planPrice }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [holderName, setHolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Format: 0000 0000 0000 0000
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };
  
  const getCardType = (number: string) => {
    const clean = number.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
    if (/^(62|81)/.test(clean)) return 'unionpay';
    if (/^(9860|9861|9862)/.test(clean)) return 'humo';
    if (/^(8600|5614)/.test(clean)) return 'uzcard';
    return 'unknown';
  };

  const currentCardType = getCardType(cardNumber);

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call and auto-deduction logic
    setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
            // Redirect or just close
            window.location.href = '/dashboard';
        }, 1500);
    }, 2000);
  };

  const renderCardIcon = () => {
    switch (currentCardType) {
        case 'visa':
            return (
                 <svg className={styles.inputCardLogo} viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="32" rx="4" fill="#1A1F71"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.2064 21.527H12.0964L10.0482 9.47775C9.902 8.92348 9.59129 8.43355 9.13426 8.20258C7.99374 7.55831 6.73713 7.09686 5.3664 6.86379V6.4V6.4H11.9877C12.9015 6.4 13.5868 7.09686 13.7011 7.96963L15.3006 16.6631L19.4091 6.46706H23.4052L17.2407 21.527H16.2064ZM25.6898 21.527H21.8081L25.0047 6.46706H28.8878L25.6898 21.527ZM33.9082 10.6389C34.0225 9.8276 34.7078 9.36365 35.5074 9.36365C36.7639 9.24716 38.1328 9.48008 39.2751 10.0585L39.9605 6.81524C38.8182 6.35133 37.5615 6.11833 36.4214 6.11833C32.6521 6.11833 29.9103 8.20456 29.9103 11.1009C29.9103 13.3039 31.8524 14.4604 33.2234 15.1572C34.7065 15.852 35.2777 16.3159 35.1634 17.0107C35.1634 18.0529 34.0211 18.5168 32.8809 18.5168C31.5101 18.5168 30.1394 18.1694 28.8845 17.5891L28.1991 20.8344C29.5699 21.4127 31.0531 21.6457 32.424 21.6457C36.6495 21.7599 39.2751 19.6756 39.2751 16.5471C39.2751 12.6073 33.9082 12.3764 33.9082 10.6389V10.6389ZM47.5005 21.527L44.4182 6.46706H41.1077C40.4223 6.46706 39.7369 6.93096 39.5085 7.62572L33.8018 21.527H37.798L38.5973 19.3268H43.5049L43.9616 21.527H47.5005ZM41.77 10.8718L42.9105 16.9022H39.7561L41.77 10.8718Z" fill="white"/>
                 </svg>
            );
        case 'mastercard':
            return (
                <svg className={styles.inputCardLogo} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="32" rx="4" fill="#222"/>
                    <circle cx="18" cy="16" r="10" fill="#EB001B"/>
                    <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
                </svg>
            );
        case 'humo':
            return (
                <svg className={styles.inputCardLogo} viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <defs>
                        <linearGradient id="humoGold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F5D77F"/>
                            <stop offset="100%" stopColor="#D4AF37"/>
                        </linearGradient>
                    </defs>
                    <rect width="50" height="32" rx="4" fill="#1F2B41"/>
                    <path d="M38 6C38 6 42 12 42 16C42 20 38 26 38 26" stroke="url(#humoGold)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <path d="M41 8C41 8 45 13 45 16C45 19 41 24 41 24" stroke="url(#humoGold)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <path d="M35 8C35 8 38 12 38 16C38 20 35 24 35 24" stroke="url(#humoGold)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <text x="20" y="21" textAnchor="middle" fill="url(#humoGold)" fontSize="10" fontWeight="bold" style={{fontFamily: 'Verdana'}}>HUMO</text>
                </svg>
            );
        case 'uzcard':
            return (
                <svg className={styles.inputCardLogo} viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="32" rx="4" fill="#005B9A"/>
                    <text x="25" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="900" style={{fontFamily: 'Arial'}}>UZCARD</text>
                    <path d="M12 22H38" stroke="#F8C300" strokeWidth="2.5"/>
                    <path d="M35 10L39 10" stroke="#FF0000" strokeWidth="2"/>
                </svg>
            );
         case 'unionpay':
            return (
                 <svg className={styles.inputCardLogo} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="32" rx="4" fill="#005B7F"/>
                    <rect x="8" y="8" width="10" height="16" fill="#E60012"/>
                    <rect x="19" y="8" width="10" height="16" fill="#00A0E9"/>
                    <rect x="30" y="8" width="10" height="16" fill="#009E96"/>
                    <text x="24" y="28" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">UnionPay</text>
                </svg>
            );
        default:
            return (
                <div className={styles.cardDefaultIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </div>
            );
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        {!isSuccess ? (
            <>
                <div className={styles.header}>
                    <h2>Payment Details</h2>
                    <p className={styles.planInfo}>Plan: <span>{planName}</span> - <span>{planPrice}</span></p>
                </div>

                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tab} ${paymentMethod === 'card' ? styles.activeTab : ''}`}
                        onClick={() => setPaymentMethod('card')}
                    >
                        Credit Card
                    </button>
                    <button 
                        className={`${styles.tab} ${paymentMethod === 'paypal' ? styles.activeTab : ''}`}
                        onClick={() => setPaymentMethod('paypal')}
                    >
                        PayPal
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    {paymentMethod === 'card' ? (
                        <>
                        <div className={styles.inputGroup}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label>Card Number</label>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000" 
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    required
                                />
                                <div className={styles.cardIcon}>
                                    {renderCardIcon()}
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Expiry Date</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY" 
                                    value={expiry}
                                    onChange={handleExpiryChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>CVC</label>
                                <input 
                                    type="text" 
                                    placeholder="123" 
                                    maxLength={3}
                                    value={cvc}
                                    onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Cardholder Name</label>
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                value={holderName}
                                onChange={e => setHolderName(e.target.value)}
                                required
                            />
                        </div>
                        </>
                    ) : (
                        <div className={styles.paypalContainer}>
                             <div className={styles.paypalLogoLarge}>
                                <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="60" height="40">
                                    <path d="M11.5 17.6h2.2l.3-1.8.1-.6h1.7c2.1 0 3.8-.8 4.2-3.1.2-1.1-.1-2-0.8-2.7-.6-.6-1.5-.9-2.7-.9h-3.8L11.5 17.6zm3.3-6.9h1c0.7 0 1.2 0.3 1.3 1.1 0 0.8-0.6 1.4-1.5 1.4h-1.3L14.8 10.7z" fill="#003087"/>
                                    <path d="M19.4 12.2c0.2-1.1-0.1-1.9-0.8-2.5-0.6-0.6-1.5-0.9-2.7-0.9h-0.4l-0.5 3.3h0.6c1.1 0 1.9-0.2 2.1-1.2" fill="#003087" fillOpacity="0.6"/>
                                    <text x="24" y="16" fill="#003087" fontSize="9" fontWeight="bold" style={{fontFamily: 'Verdana'}}>PayPal</text>
                                </svg>
                             </div>
                             <p className={styles.paypalText}>Pay securely with your PayPal account.</p>
                        </div>
                    )}

                    <button type="submit" className={styles.payBtn} disabled={isLoading}>
                        {isLoading ? <span className={styles.loader}></span> : paymentMethod === 'card' ? `Pay ${planPrice}` : 'Proceed to PayPal'}
                    </button>
                    
                    <p className={styles.secureText}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Secure automated payment
                    </p>
                </form>
            </>
        ) : (
            <div className={styles.successState}>
                <div className={styles.checkIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3>Payment Successful!</h3>
                <p>Redirecting to dashboard...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
