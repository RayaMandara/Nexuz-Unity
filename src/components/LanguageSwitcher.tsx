"use client";

import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

const languages = [
  { code: 'id', label: 'IND' },
  { code: 'en', label: 'ENG' },
  { code: 'ban', label: 'BAL' },
] as const;

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="fixed top-2 left-2 z-[999]"
    >
      <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-md rounded-full px-1 py-1 border border-white/[0.08] shadow-lg shadow-black/20">
        <Languages className="w-3 h-3 text-gray-400 ml-1" />
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide transition-all duration-200 ${
              language === lang.code
                ? "bg-white/15 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default LanguageSwitcher;