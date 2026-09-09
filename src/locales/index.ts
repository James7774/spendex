
import en from './en.json';
import es from './es.json';
import ar from './ar.json';
import hi from './hi.json';
import zhHans from './zh-Hans.json';
import fr from './fr.json';
import ptBR from './pt-BR.json';
import ru from './ru.json';
import de from './de.json';
import ja from './ja.json';
import uz from './uz.json';
import tr from './tr.json';

export const translations = {
  en,
  es,
  ar,
  hi,
  "zh-Hans": zhHans,
  fr,
  "pt-BR": ptBR,
  ru,
  de,
  ja,
  uz,
  tr
};

export type Language = keyof typeof translations;

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
  hi: "हिन्दी",
  "zh-Hans": "简体中文",
  fr: "Français",
  "pt-BR": "Português (BR)",
  ru: "Русский",
  de: "Deutsch",
  ja: "日本語",
  uz: "O'zbekcha",
  tr: "Türkçe"
};

export const rtlLanguages: Language[] = ['ar'];

export type CurrencyCode = 'USD' | 'EUR' | 'UZS' | 'RUB' | 'AED' | 'INR' | 'CNY' | 'BRL' | 'JPY' | 'GBP' | 'TRY';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const currencies: Currency[] = [
  { code: 'UZS', symbol: "so'm", name: "O'zbek so'mi" },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
];

export const defaultCurrencyMap: Record<Language, CurrencyCode> = {
  uz: 'UZS',
  ru: 'RUB',
  en: 'USD',
  es: 'EUR',
  ar: 'AED',
  hi: 'INR',
  "zh-Hans": 'CNY',
  fr: 'EUR',
  "pt-BR": 'BRL',
  de: 'EUR',
  ja: 'JPY',
  tr: 'TRY'
};
