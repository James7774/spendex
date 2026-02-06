
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
  uz
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
  uz: "O'zbekcha"
};

export const rtlLanguages: Language[] = ['ar'];
