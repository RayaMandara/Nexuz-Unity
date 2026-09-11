"use client";

import { motion } from "framer-motion";
import { ExternalLink, Gamepad2, Sparkles, Play } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const GAMEHUB_URL = "https://gamehub-nexuz.vercel.app/";

const GamesGallery = () => {
  const { t } = useLanguage();

  return (
    <section id="games" className="py-24 px-4 md:px-6 bg-black relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-pink-600/15 blur-[120px] rounded-full pointer-events-none -z-0" />

      <div className="container mx-auto max-w-6xl relative z-10" id="game">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12"
        >


          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3 text-white">
            <span>{t("games_title") || "Kunjungi GameHub Kami"}</span>
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full mb-6" />

          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {t("games_subtitle") ||
              "Jelajahi dan mainkan berbagai koleksi game seru karya keluarga Nexuz langsung di portal resmi GameHub"}
          </p>
        </motion.div>

        {/* Full-width GameHub Showcase Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <a
            href={GAMEHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] cursor-pointer"
          >
            {/* Banner Image with responsive aspect ratio */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
              <motion.img
                src="/gamehub-banner.png"
                alt="GameHub Nexuz - Kunjungi GameHub Kami"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />


              {/* Bottom Interactive Content Area */}
              <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
                <div className="max-w-xl">
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md group-hover:text-purple-200 transition-colors">
                    GameHub
                  </h3>
                </div>

                {/* Call To Action Button (Pulses/Glows on Hover) */}
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black font-bold text-sm shadow-xl group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all duration-300 transform group-hover:scale-105">
                    <Play className="w-4 h-4 fill-current" />
                    <span>{t("games_cta") || "Buka GameHub"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GamesGallery;