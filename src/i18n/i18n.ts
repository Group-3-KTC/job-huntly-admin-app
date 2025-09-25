import { addLocale, t, useLocale } from "ttag";

type LocaleType = "en" | "vi" | "ko";

export const getCurrentLanguage = (): LocaleType => {
  const savedLang = localStorage.getItem("lang") as LocaleType | null;
  if (savedLang && ["en", "vi", "ko"].includes(savedLang)) return savedLang;

  // lấy ngôn ngữ của trình duyệt khi chưa lưu localStorage
  const browser = (navigator.language || "en").split("-")[0] as LocaleType;
  return (["en", "vi", "ko"] as const).includes(browser) ? browser : "en";
};

const listeners: (() => void)[] = [];

export const initI18n = async () => {
  let langCode = localStorage.getItem("lang") as LocaleType | null;
  if (!langCode || !["en", "vi", "ko"].includes(langCode)) {
    langCode = getCurrentLanguage();
  }
  await setLanguage(langCode);
};

const loadLanguage = async (lang: LocaleType = "en") => {
  try {
    const res = await fetch(`/locales/${lang}.po.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${lang}`);
    const dict = await res.json();
    addLocale(lang, dict);
  } catch (err) {
    console.error("Error loading language:", err);
  }
};

export const setLanguage = async (lang: LocaleType) => {
  await loadLanguage(lang);
  localStorage.setItem("lang", lang);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLocale(lang);
  listeners.forEach((cb) => cb());
};

export const subscribeToLanguageChange = (cb: () => void) => {
  listeners.push(cb);
  return () => {
    const i = listeners.indexOf(cb);
    if (i !== -1) listeners.splice(i, 1);
  };
};

export { t };
