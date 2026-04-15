"use client";

import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-black" />

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
            className="text-7xl md:text-8xl font-bold tracking-tighter mb-6"
          >
            NEXUZ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Lebih dari sekadar kelas. Ini adalah keluarga, perjalanan, dan
            kenangan yang akan terus hidup.
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
                if (profilSection) {
                  profilSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all hover:scale-105 cursor-pointer"
            >
              Jelajahi
            </button>
            <button
              onClick={() => {
                const timelineSection = document.getElementById("timeline");
                if (timelineSection) {
                  timelineSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-8 py-3 border border-white rounded-full font-semibold hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
            >
              Lihat Timeline
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {/* Scroll Indicator - Tengah Bawah */}
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 z-20"
        style={{ left: "calc(50% - 14px)" }}
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
