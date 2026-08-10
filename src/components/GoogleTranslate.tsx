"use client";

import { useEffect } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    const checkTranslate = () => {
      if (window.google?.translate) {
        // Already loaded
      }
    };

    const interval = setInterval(checkTranslate, 500);
    setTimeout(() => clearInterval(interval), 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Script
        id="google-translate"
        strategy="afterInteractive"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'id',
                includedLanguages: 'en,id,ja,ko,zh-CN,zh-TW,fr,de,es,ar',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `,
        }}  
      />

      {/* Tombol Translate - Sangat Kecil & Minimalis */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="fixed top-3 left-3 z-[999]"
      >
        <div className="flex items-center gap-1 bg-white backdrop-blur-md rounded-lg px-2 py-1 border border-white/10 hover:border-white/25 transition-all duration-300 shadow-md">
          <Languages className="w-3 h-3 text-gray-400 flex-shrink-0 bg-blackf" />
          <div id="google_translate_element" className="translate-mini bg-black" />
        </div>
      </motion.div>
    </>
  );
};

export default GoogleTranslate;