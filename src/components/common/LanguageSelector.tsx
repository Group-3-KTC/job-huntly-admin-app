import { useState, useEffect } from "react";
import {
  getCurrentLanguage,
  setLanguage,
  subscribeToLanguageChange,
} from "../../i18n/i18n.ts";

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  const languages = [
    { code: "en" as const, name: "English", flag: "🇺🇸" },
    { code: "vi" as const, name: "Tiếng Việt", flag: "🇻🇳" },
  ];

  // Subscribe to language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(getCurrentLanguage());
    };

    subscribeToLanguageChange(handleLanguageChange);

    // Cleanup function
    return () => {
      subscribeToLanguageChange(() => {});
    };
  }, []);

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  const handleLanguageChange = async (langCode: "en" | "vi") => {
    if (langCode === currentLanguage) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      await setLanguage(langCode);
      // The language state will be updated through the subscription
    } catch (error) {
      console.error("Failed to change language:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <span>{currentLang?.flag}</span>
        <span>{currentLang?.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                lang.code === currentLanguage ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isLoading}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
