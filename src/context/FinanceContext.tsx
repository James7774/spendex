"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from "@/lib/firebase";

// --- 1. Tarjimalar (Dictionary) ---
import {
  translations,
  Language,
  languageNames,
  rtlLanguages
} from "@/locales";

export type { Language };
export { languageNames, rtlLanguages };

// --- 2. Types ---
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note?: string;
};

export type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
};

export type DateFilterType = '1D' | '1W' | '1M' | 'custom' | 'all';

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type FinanceFilters = {
  dateType: DateFilterType;
  dateRange: DateRange;
  categories: string[];
  minAmount?: number;
  maxAmount?: number;
};

type FinanceContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  darkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  t: typeof translations.en;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  notes: Note[];
  addNote: (note: Omit<Note, 'id'>) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  clearAllData: () => void;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  filters: FinanceFilters;
  setFilters: (filters: Partial<FinanceFilters>) => void;
  filteredTransactions: Transaction[];
  filteredNotes: Note[];
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  // Initial state from localStorage to avoid flicker
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finflow_lang') as Language;
      if (saved && Object.keys(translations).includes(saved)) return saved;
    }
    return 'uz'; // Fallback
  });

  // Filters State
  const [filters, setFiltersState] = useState<FinanceFilters>({
    dateType: '1M',
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
    },
    categories: [],
    minAmount: undefined,
    maxAmount: undefined
  });

  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update document direction and language when it changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRTL = rtlLanguages.includes(language);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  // Sync with localStorage and Detect initial if needed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('finflow_lang') as Language;
      
      if (!savedLang || !Object.keys(translations).includes(savedLang)) {
        // Auto-detect only if NOT saved
        const browserLang = navigator.language || 'en';
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        const langMap: Record<string, Language> = {
          uz: 'uz', ru: 'ru', en: 'en', es: 'es', ar: 'ar', 
          hi: 'hi', zh: 'zh-Hans', fr: 'fr', pt: 'pt-BR', de: 'de', ja: 'ja'
        };
        
        const detectedLang = langMap[langCode] || 'en';
        setLanguageState(detectedLang);
        localStorage.setItem('finflow_lang', detectedLang);
      }

      const savedTheme = localStorage.getItem('finflow_theme');
      if (savedTheme === 'dark') setDarkMode(true);

      const savedUser = localStorage.getItem('finflow_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('finflow_user');
        }
      }
      
      setIsInitialized(true);
    }
  }, []);

  // 2. Data Segregation: Load data based on current active User
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized && user) {
      const userId = user.id;
      
      try {
        const savedTx = localStorage.getItem(`finflow_${userId}_transactions`);
        if (savedTx) setTransactions(JSON.parse(savedTx));
        else setTransactions([]);
      } catch (e) {
        console.error("Error parsing transactions:", e);
        setTransactions([]);
      }

      try {
        const savedGoals = localStorage.getItem(`finflow_${userId}_goals`);
        if (savedGoals) setGoals(JSON.parse(savedGoals));
        else setGoals([]);
      } catch (e) {
        console.error("Error parsing goals:", e);
      }

      try {
        const savedNotes = localStorage.getItem(`finflow_${userId}_notes`);
        if (savedNotes) setNotes(JSON.parse(savedNotes));
        else setNotes([]);
      } catch (e) {
        console.error("Error parsing notes:", e);
        setNotes([]);
      }
    } else if (isInitialized && !user) {
      // Clear states on logout to prevent data leak
      setTransactions([]);
      setGoals([]);
      setNotes([]);
    }
  }, [user, isInitialized]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('finflow_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('finflow_theme', 'light');
      }
      return newMode;
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('finflow_lang', lang);
  }, []);

  const login = useCallback((userData: User) => {
      setUser(userData);
      localStorage.setItem('finflow_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
      try {
        const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
        await FirebaseAuthentication.signOut();
        await auth.signOut();
      } catch (e) {
        console.error("Sign out error", e);
      }
      
      setUser(null);
      setTransactions([]);
      setGoals([]);
      setNotes([]);
      
      localStorage.removeItem('finflow_user');
      localStorage.removeItem('finflow_session_token');
      localStorage.removeItem('hasSeenOnboarding');
  }, []);

  const updateUserProfile = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem('finflow_user', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save user profile to localStorage:", e);
      }
      return updated;
    });
  }, []);

  const setFilters = useCallback((updates: Partial<FinanceFilters>) => {
    setFiltersState(prev => {
      const newFilters = { ...prev, ...updates };

      if (updates.dateType && updates.dateType !== 'custom' && updates.dateType !== 'all') {
        const now = new Date();
        now.setHours(0,0,0,0);
        let start = new Date();
        let end = new Date();
        
        switch (updates.dateType) {
          case '1D':
            start = new Date(now);
            end = new Date(now);
            end.setHours(23, 59, 59, 999);
            break;
          case '1W': {
            const d = new Date(now);
            d.setDate(d.getDate() - 6);
            start = d;
            end = new Date();
            end.setHours(23, 59, 59, 999);
            break;
          }
          case '1M':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        }
        newFilters.dateRange = { start, end };
      } else if (updates.dateType === 'all') {
        newFilters.dateRange = { start: null, end: null };
      }

      return newFilters;
    });
  }, []);

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(t => {
      // 1. Date Filter
      if (filters.dateType !== 'all' && filters.dateRange.start && filters.dateRange.end) {
        const d = new Date(t.date);
        if (d < filters.dateRange.start || d > filters.dateRange.end) return false;
      }

      // 2. Category Filter
      if (filters.categories.length > 0 && !filters.categories.includes(t.category)) {
        return false;
      }

      // 3. Amount Filter
      if (filters.minAmount !== undefined && t.amount < filters.minAmount) return false;
      if (filters.maxAmount !== undefined && t.amount > filters.maxAmount) return false;

      return true;
    });
  }, [transactions, filters]);

  const filteredNotes = React.useMemo(() => {
    if (filters.dateType === 'all' || !filters.dateRange.start || !filters.dateRange.end) {
      return notes;
    }
    const { start, end } = filters.dateRange;
    return notes.filter(n => {
      const d = new Date(n.date);
      return d >= start && d <= end;
    });
  }, [notes, filters]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const newTx = { ...tx, id: Date.now().toString() };
    setTransactions(prev => {
      const updated = [newTx, ...prev];
      localStorage.setItem(`finflow_${user?.id}_transactions`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const deleteTransaction = useCallback((id: string) => {
    if (!user) return;
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem(`finflow_${user?.id}_transactions`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    if (!user) return;
    const newGoal = { ...goal, id: Date.now().toString() };
    setGoals(prev => {
      const updated = [newGoal, ...prev];
      localStorage.setItem(`finflow_${user?.id}_goals`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const deleteGoal = useCallback((id: string) => {
    if (!user) return;
    setGoals(prev => {
      const updated = prev.filter(g => g.id !== id);
      localStorage.setItem(`finflow_${user?.id}_goals`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    if (!user) return;
    setGoals(prev => {
      const updated = prev.map(g => g.id === id ? { ...g, ...updates } : g);
      localStorage.setItem(`finflow_${user?.id}_goals`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const addNote = useCallback((note: Omit<Note, 'id'>) => {
    if (!user) return;
    const newNote = { ...note, id: Date.now().toString() };
    setNotes(prev => {
      const updated = [newNote, ...prev];
      localStorage.setItem(`finflow_${user?.id}_notes`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const updateNote = useCallback((id: string, note: Partial<Note>) => {
    if (!user) return;
    setNotes(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, ...note } : n);
      localStorage.setItem(`finflow_${user?.id}_notes`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const deleteNote = useCallback((id: string) => {
    if (!user) return;
    setNotes(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem(`finflow_${user?.id}_notes`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const clearAllData = useCallback(() => {
    if (!user) return;
    setTransactions([]);
    setGoals([]);
    setNotes([]);
    localStorage.removeItem(`finflow_${user.id}_transactions`);
    localStorage.removeItem(`finflow_${user.id}_goals`);
    localStorage.removeItem(`finflow_${user.id}_notes`);
  }, [user]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const setTheme = useCallback((theme: 'light' | 'dark') => setDarkMode(theme === 'dark'), []);

  // Compute RTL based on current language
  const isRTL = rtlLanguages.includes(language);

  const value = React.useMemo(() => ({
    language,
    setLanguage,
    isRTL,
    darkMode,
    toggleTheme,
    setTheme,
    t: (translations[language] || translations.en) as typeof translations.en,
    transactions,
    addTransaction,
    deleteTransaction,
    goals,
    addGoal,
    deleteGoal,
    updateGoal,
    notes,
    addNote,
    deleteNote,
    updateNote,
    totalBalance,
    totalIncome,
    totalExpense,
    clearAllData,
    user,
    login,
    logout,
    updateUserProfile,
    filters,
    setFilters,
    filteredTransactions,
    filteredNotes
  } as FinanceContextType), [
    language, isRTL, darkMode, transactions, goals, notes, 
    totalBalance, totalIncome, totalExpense, user,
    addGoal, addNote, addTransaction, clearAllData, 
    deleteGoal, deleteNote, deleteTransaction, 
    updateGoal, updateNote, updateUserProfile,
    setLanguage, toggleTheme, setTheme, logout, login,
    filters, setFilters, filteredTransactions, filteredNotes
  ]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
