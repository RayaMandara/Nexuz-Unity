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
    const cleanGoogleTranslate = () => {
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner) banner.remove();

      const elementsToRemove = [
        '.goog-te-menu-frame',
        '.goog-te-menu2-frame',
        '.VIpgJd-ZVi9od-ORHb-OEVmcd',
        '.VIpgJd-ZVi9od-aZ2wEe-wOHMyf'
      ];
      
      elementsToRemove.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.remove();
      });

      const style = document.createElement('style');
      style.textContent = `
        .VIpgJd-ZVi9od-ORHb-OEVmcd {
          display: none !important;
          background: transparent !important;
        }
        .goog-te-banner-frame {
          display: none !important;
          height: 0 !important;
        }
        body {
          top: 0 !important;
          position: relative !important;
        }
      `;
      document.head.appendChild(style);

      document.body.style.margin = '0';
      document.body.style.position = 'relative';
      document.body.style.top = '0';
    };

    const interval = setInterval(() => {
      if (window.google?.translate) {
        setTimeout(cleanGoogleTranslate, 1000);
        clearInterval(interval);
      }
    }, 500);

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
                includedLanguages: 'id,en,ban',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `,
        }}
      />

      {/* Tombol Translate - Pojok Kiri Atas, Sangat Kecil */}
      <motion.div
        initial={{ opacity: 0, x: -10, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="fixed top-2 left-2 z-[999]"
      >
        <div className="flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-sm">
          <Languages className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
          <div id="google_translate_element" className="translate-micro" />
        </div>
      </motion.div>
    </>
  );
};

export default GoogleTranslate;