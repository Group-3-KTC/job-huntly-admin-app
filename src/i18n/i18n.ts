import { addLocale, t, useLocale } from "ttag";

export const getCurrentLanguage = (): LocaleType => {
  const savedLang = localStorage.getItem("lang");
  if (savedLang && ["en", "vi"].includes(savedLang)) {
    return savedLang as LocaleType;
  }
  // lấy ngôn ngữ của trình duyệt khi chưa lưu localstorage vi-VN
  const browserLang = navigator.language.split("-")[0] as LocaleType;
  return ["en", "vi"].includes(browserLang) ? browserLang : "en";
};

type LocaleType = "en" | "vi";

const listeners: (() => void)[] = [];

export const initI18n = async () => {
  let langCode = localStorage.getItem("lang") as LocaleType | null;

  if (!langCode || !["en", "vi"].includes(langCode)) {
    langCode = getCurrentLanguage();
  }

  await setLanguage(langCode);
};

const loadLanguage = async (lang: string = "en") => {
  try {
    console.log("load language", lang);
    const response = await fetch(`/locales/${lang}.po.json`);
    if (!response.ok) throw new Error(`Failed to load ${lang}`);
    const translationsObj = await response.json();
    addLocale(lang, translationsObj);
  } catch (error) {
    console.error("Error loading language:", error);
  }
};

export const setLanguage = async (lang: LocaleType) => {
  // if (lang === currentLang) return;

  await loadLanguage(lang);
  localStorage.setItem("lang", lang);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLocale(lang);
  listeners.forEach((cb) => cb());
};

export const subscribeToLanguageChange = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) listeners.splice(index, 1);
  };
};

export { t };
