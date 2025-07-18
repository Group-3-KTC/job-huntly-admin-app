import { useEffect, useState } from "react";
import { setLanguage, subscribeToLanguageChange } from "../../i18n/i18n.ts";

export const LanguageSelector = () => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "en" | "vi";
    setLang(newLang);
    setLanguage(newLang); // Gọi để cập nhật dịch
  };

  // Khi setLanguage() chạy xong và onLanguageChange được gọi, cập nhật lại lang để re-render
  useEffect(() => {
    subscribeToLanguageChange(() => {
      const newLang = localStorage.getItem("lang") || "en";
      setLang(newLang);
    });
  }, []);

  return (
    <select onChange={handleChange} value={lang}>
      <option value="en">English</option>
      <option value="vi">Tiếng Việt</option>
    </select>
  );
};
