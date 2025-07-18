import { addLocale, useLocale, t } from "ttag";

type LocaleType = "en" | "vi";

let onLanguageChange: (() => void) | null = null;

export const setLanguage = async (lang: LocaleType = "en") => {
  try {
    console.log("setlaunguage");
    const response = await fetch(`/locales/${lang}.po.json`);
    if (!response.ok) throw new Error(`Failed to load ${lang}`);

    const translations = await response.json();

    addLocale(lang, translations); // load file dịch
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLocale(lang); //áp dụng ngôn ngữ

    localStorage.setItem("lang", lang); // lưu lại
    if (onLanguageChange) onLanguageChange();
  } catch (error) {
    console.error("Error loading language:", error);
  }
};

export const subscribeToLanguageChange = (callback: () => void) => {
  onLanguageChange = callback;
};

export { t };

// Khởi tạo ngôn ngữ ban đầu
const defaultLang = (localStorage.getItem("lang") as LocaleType) || "en";
setLanguage(defaultLang);
