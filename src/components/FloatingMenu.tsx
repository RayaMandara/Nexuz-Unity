"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, X as XIcon } from "lucide-react"; 
import {
  Home,
  Users,
  Image,
  Clock,
  BookMarked,
  Gamepad2,
  Music,
  X,
} from "lucide-react";

import { expandMusicPlayer } from "./MusicPlayer";

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Beranda", icon: Home, href: "#home" },
    { name: "Profil", icon: Users, href: "#profil" },
    { name: "Siswa", icon: Users, href: "#siswa" },
    { name: "Galeri", icon: Image, href: "#galeri" },
    { name: "Timeline", icon: Clock, href: "#timeline" },
    { name: "Kenangan", icon: BookMarked, href: "#kenangan" },
    { name: "Game", icon: Gamepad2, href: "#game" },
    { name: "Admin", icon: Shield, href: "#admin" },
  ];

  const handleClick = (item: { name: string; href: string }) => {
    setIsOpen(false);

    if (item.name === "Admin") {
      setShowAdminModal(true);
      return;
    }

    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      // Simpan auth dengan timestamp (24 jam)
      const loginTime = Date.now();
      localStorage.setItem("nexuz_admin_auth", "true");
      localStorage.setItem("nexuz_admin_login_time", loginTime.toString());
      
      setShowAdminModal(false);
      setAdminPassword("");
      setPasswordError("");
      window.location.href = "/admin";
    } else {
      setPasswordError("Password salah!");
    }
  };

  // Posisi tombol: di kiri, di atas music player (tidak diubah)
  const buttonPosition = scrolled ? "bottom-36" : "bottom-40";

  return (
    <>
      {/* Floating Button - Posisi Kiri Bawah (di atas music player) */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 transition-all duration-300 ${buttonPosition}`}
        style={{ left: "20px" }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-14 h-14 bg-black rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        >
          {isOpen ? (
            <X className="text-white w-6 h-6" />
          ) : (
            <img 
              src="/Logo.png" 
              alt="Nexuz Logo" 
              className="w-12 h-12 object-cover"
            />
          )}
        </motion.div>
      </motion.button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Menu Items - Tetap di Tengah Layar */}
            <div
              className="fixed z-50"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                marginLeft: "-30px",
              }}
            >
              {menuItems.map((item, index) => {
                const angle = (index * 360) / menuItems.length - 90;
                const radius = 150;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: x,
                      y: y,
                    }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{ delay: index * 0.03, type: "spring" }}
                    onClick={() => handleClick(item)}
                    className="absolute top-0 left-0 group"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300">
                        <item.icon className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                      </div>
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {item.name}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Password Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAdminModal(false);
                setAdminPassword("");
                setPasswordError("");
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-md w-full border border-white/20 shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">Admin Access</h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowAdminModal(false);
                      setAdminPassword("");
                      setPasswordError("");
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAdminLogin}>
                  <p className="text-gray-400 text-sm mb-4">
                    Masukkan password untuk mengakses panel admin.
                  </p>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Password"
                    autoFocus
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white mb-3 focus:outline-none focus:border-white/50"
                  />
                  {passwordError && (
                    <p className="text-red-400 text-sm mb-3">{passwordError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    Login
                  </button>
                </form>

                <p className="text-gray-500 text-xs text-center mt-4">
                  Hubungi admin untuk mendapatkan password
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingMenu;