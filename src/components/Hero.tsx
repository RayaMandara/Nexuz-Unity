"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/background.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-7xl md:text-8xl font-bold tracking-tighter mb-6 text-white drop-shadow-2xl notranslate"
          >
            {t("hero_title")}
          </motion.h1>

          <motion.img
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            src="/aksara-bali.png"
            alt="Aksara Bali - Nexuz"
            className="h-20 md:h-28 mx-auto mb-4 notranslate"
            loading="lazy"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            {t("hero_subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-x-4"
          >
            <button
              onClick={() => {
                const profilSection = document.getElementById("profil");
                if (profilSection)
                  profilSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all hover:scale-105 cursor-pointer shadow-xl"
            >
              {t("hero_explore")}
            </button>
            {/* <button
              onClick={() => {
                const timelineSection = document.getElementById("timeline");
                if (timelineSection)
                  timelineSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-3 border border-white rounded-full font-semibold hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
            >
              {t("hero_view_timeline")}
            </button> */}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;