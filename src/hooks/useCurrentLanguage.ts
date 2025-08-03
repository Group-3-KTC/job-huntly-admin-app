import { useEffect, useState } from "react";
import { getCurrentLanguage, subscribeToLanguageChange } from "../i18n/i18n";

export const useCurrentLanguage = () => {
  const [lang, setLang] = useState(getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = subscribeToLanguageChange(() => {
      setLang(getCurrentLanguage());
    });
    return unsubscribe;
  }, []);

  return lang;
};
