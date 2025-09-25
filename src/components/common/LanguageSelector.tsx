import { useState, useEffect } from "react";
import {
  getCurrentLanguage,
  setLanguage,
  subscribeToLanguageChange,
} from "../../i18n/i18n.ts";
import "flag-icons/css/flag-icons.min.css";


type LangCode = "en" | "vi";

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LangCode>(getCurrentLanguage() as LangCode);

  const languages = [
  { code: "en" as const, name: "English",     flag: "fi-us" },
  { code: "vi" as const, name: "Tiếng Việt",  flag: "fi-vn" },
  { code: "ko" as const, name: "한국어",        flag: "fi-kr" }, // <- thêm tiếng Hàn + cờ Hàn
];


  useEffect(() => {
    const handler = () => setCurrentLanguage(getCurrentLanguage() as LangCode);

    const unsubscribe = subscribeToLanguageChange(handler);
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const currentLang = languages.find((l) => l.code === currentLanguage)!;

  const handleLanguageChange = async (langCode: LangCode) => {
    if (langCode === currentLanguage) {
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      await setLanguage(langCode);
    } catch (e) {
      console.error("Failed to change language:", e);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Current language: ${currentLang.name}`}
        className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <span className={`fi ${currentLang?.flag} w-5 h-5 rounded-sm`}></span>

        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-[160px] p-1"
        >
          {languages.map((lang) => {
            const active = lang.code === currentLanguage;
            return (
              <button
                key={lang.code}
                role="menuitem"
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors
                  ${active ? "bg-blue-50 text-blue-600" : ""}`}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isLoading}
              >
                <span className={`fi ${lang.flag} w-5 h-5 rounded-sm`}></span>
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
