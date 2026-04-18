"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const igUsername = "nexuz.unity";
  const igUrl = `https://instagram.com/${igUsername}`;

  return (
    <footer className="bg-black/90 border-t border-white/10 py-12 px-6">
      <div className="container mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: "-100px" }}
          className="mb-8"
        >
          <p className="text-gray-300 italic text-lg md:text-xl">
            "Bukan akhir dari segalanya, tapi awal dari kenangan yang akan terus hidup."
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            — Nexuz Unity, 2024 — 2027
          </p>
        </motion.div>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: false, margin: "-100px" }}
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-semibold hover:scale-105 transition-transform mb-8"
        >
          <FaInstagram className="w-4 h-4" />
          @{igUsername}
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: false, margin: "-100px" }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Heart className="w-4 h-4 text-red-400" />
            <span>Terima kasih telah menjadi bagian dari cerita kami</span>
            <Heart className="w-4 h-4 text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-gray-500 text-xs space-y-1"
        >
          <p>© 2024 - 2027 • Nexuz Unity • SMK Pariwisata Triatma Jaya Badung</p>
          <p>Dibuat dengan ❤️ oleh Keluarga Nexuz</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: false, margin: "-100px" }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group"
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="w-4 h-4 text-white group-hover:text-black transition-colors" />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;