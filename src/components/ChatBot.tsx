"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './ChatBot.module.css';
import { useFinance } from '@/context/FinanceContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findBestAnswer } from '@/lib/knowledgeBase';
import dynamic from 'next/dynamic';

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player), { ssr: false });

const genAI = new GoogleGenerativeAI("AIzaSyBqELbXdqHc5O4eBz5U_i5T3qT8V9wX1mA");

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBot() {
  const { language } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [initialHeight, setInitialHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<string | number>('100vh');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setInitialHeight(window.visualViewport ? window.visualViewport.height : window.innerHeight);

    const handleResize = () => {
      // Update height to match the visual viewport (handles keyboard)
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
        
        // Check for keyboard visibility
        const currentHeight = window.visualViewport.height;
        const totalHeight = window.innerHeight;
        // If significantly smaller, keyboard is likely open
        setIsKeyboardVisible(currentHeight < totalHeight * 0.85);
        
        // Scroll to bottom when keyboard opens/resizes
        setTimeout(scrollToBottom, 100);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      // Set initial value
      handleResize();
    }

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []); // Remove initialHeight dependency to prevent infinite loops if used badly

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isKeyboardVisible]); // Scroll when keyboard visibility changes too

  useEffect(() => {
    const greetings = {
      uz: "Assalomu alaykum! Men Nova.X AI - sizning aqlli moliyaviy yordamchingizman. Sizga qanday yordam bera olaman?",
      ru: "Здравствуйте! Я Nova.X AI — ваш умный финансовый помощник. Чем я могу вам помочь?",
      en: "Hello! I am Nova.X AI — your smart financial assistant. How can I help you today?"
    };

    const currentLang = (['uz', 'ru'].includes(language) ? language : 'en') as keyof typeof greetings;

    setMessages([
      {
        id: '1',
        text: greetings[currentLang],
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, [language]);

  const detectLanguage = (text: string): 'uz' | 'ru' | 'en' => {
    const uzChars = /[o'g'shchng']+/i;
    const ruChars = /[а-яА-ЯёЁ]+/i;
    
    // Quick check for specific keywords
    if (ruChars.test(text)) return 'ru';
    if (uzChars.test(text) || text.includes('mi') || text.includes('da')) return 'uz';
    
    // Default to 'en' or context language
    return (language as 'uz' | 'ru' | 'en') || 'en';
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Detect user language
    const detectedLang = detectLanguage(text);

    try {
      // 1. Knowledge Base Check
      const kbAnswer = findBestAnswer(text);
      const hasKbMatch = kbAnswer && !kbAnswer.includes("aniqroq qilib bering");

      // 2. Gemini AI
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const promptConfig = `
### SYSTEM ROLE: ANTIGRAVITY – THE CORE OF FINOVA

**IDENTIFICATION:**
You are **Antigravity**, the elite Personal Finance Intelligence (PFI) powering the **Finova** ecosystem. 

**STRICT RESPONSE RULE:**
You must ALWAYS respond in THREE languages simultaneously: English, Uzbek, and Russian. 
Even if the user asks in one language, your response MUST contain translations for all three.

**KNOWLEDGE BASE CONTEXT:**
The following potentially relevant answer was found in my internal records:
"${hasKbMatch ? kbAnswer : "No specific match found."}"
If a match is found, use it as your primary factual source, but refine and translate it.

**ABSOLUTE RULES:**
1. You must NEVER skip translation.
2. You must ALWAYS respond.
3. You must NEVER say “I can’t”.
4. You must NEVER lose the original meaning.
5. You must ALWAYS keep the FINOVA personal finance context.

**LANGUAGE BEHAVIOR (ENFORCED):**
- You MUST provide: 1) English version, 2) Uzbek translation, 3) Russian translation – ALWAYS.
- Exception: Only if the user EXPLICITLY says “Only Uzbek” or “Only Russian”, you may respond in that single language. Otherwise, ALWAYS provide all three.

**FORMAT RULE (STRICT):**
Always use this structure:

Q (Original):
[User's original question]

Q (Uzbek):
[Uzbek translation of the question]

Q (Russian):
[Russian translation of the question]

A (Original):
[English version of the answer]

A (Uzbek):
[Uzbek version of the answer]

A (Russian):
[Russian version of the answer]

**INTENT & TYPO RESILIENCE:**
1. Ignore spelling mistakes, typos, and grammatical errors (e.g., "pulni qanday jush" instead of "jamg'arish").
2. Be highly resilient to informal Uzbek/Russian slang and dialect variations.
3. Focus on the "Semantic Intent" – if the user mentions money, saving, cards, or debt, provide the relevant financial intelligence regardless of how it's spelled.
4. Never tell the user they made a mistake; simply provide a professional, multilingual answer based on the detected intent.

**OPERATIONAL MANDATE:**
1.  **Financial Lens Rule:** Every single response must be related to personal finance.
2.  **No Dead-End Policy:** You never refuse a request. Even if the input is unclear, make your best guess based on financial context.
3.  **Hyper-Accuracy:** Numbers and calculations must stay EXACT.

**FINAL MISSION:**
Transform FINOVA knowledge into clear, multilingual personal finance intelligence.
EVERY interaction must end with a clearly defined "Next Financial Step".

**CONTEXT:**
Detected Language: ${detectedLang.toUpperCase()}
User Input: "${text}"
`;

      const result = await model.generateContent(promptConfig);
      const data = result.response.text();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: data || kbAnswer,
        sender: 'bot',
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg = findBestAnswer(text);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: fallbackMsg,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          className={styles.chatButton} 
          onClick={() => setIsOpen(true)}
          style={{ 
            bottom: 'calc(var(--safe-bottom) + 5.5rem)', 
            right: '12px', 
            zIndex: 9999,
            transform: isKeyboardVisible ? `translateY(-${initialHeight - (typeof viewportHeight === 'number' ? viewportHeight : initialHeight) + 10}px)` : 'translateY(0)',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transition: 'none !important' as any, 
          }}
          aria-label="Open Chat Support"
        >
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '50%' }}>
              <Image 
                src="/nova-x-logo.png" 
                alt="Nova.X AI" 
                width={46} 
                height={46} 
                style={{ objectFit: 'cover', transform: 'scale(1.15)' }} 
              />
          </div>
        </button>
      )}

      {isOpen && (
        <div 
          className={styles.chatWindow} 
          style={{ 
            height: typeof viewportHeight === 'number' ? `${viewportHeight}px` : viewportHeight,
            bottom: 0 // Force bottom alignment
          }}
        >
          <div className={styles.header}>
            <div className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image 
                  src="/nova-x-logo.png" 
                  alt="Antigravity Logo" 
                  width={24} 
                  height={24} 
                  style={{ objectFit: 'contain' }} 
                />
                <span>Nova.X AI</span>
            </div>
            <button 
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}
              >
                {msg.text}
              </div>
            ))}
            {mounted && isTyping && (
                <div className={`${styles.message} ${styles.botMessage}`} style={{ padding: '4px 12px', minWidth: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Player
                    src="https://assets8.lottiefiles.com/packages/lf20_t9uon7vz.json"
                    autoplay
                    loop
                    style={{ width: '50px', height: '30px' }}
                  />
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              className={styles.input}
              placeholder={
                language === 'uz' ? "Savolingizni bering..." : 
                language === 'ru' ? "Задайте свой вопрос..." : 
                "Ask your question..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
