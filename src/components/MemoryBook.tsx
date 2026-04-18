"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Send, Calendar, User, Heart } from "lucide-react";

interface Memory {
  id: number;
  name: string;
  message: string;
  date: string;
  avatar: string;
}

const MemoryBook = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Error fetching memories:', error);
    } else {
      setMemories(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    
    const newMemory = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString().split("T")[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.trim()}`
    };

    const { error } = await supabase.from('memories').insert([newMemory]);
    
    if (error) {
      alert('Gagal mengirim pesan: ' + error.message);
    } else {
      await fetchMemories();
      setName("");
      setMessage("");
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <section id="kenangan" className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="text-gray-400">Loading kenangan...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="kenangan" className="py-24 px-6 bg-black">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Buku Kenangan
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tuliskan pesan dan kesanmu untuk kelas tercinta
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, margin: "-100px" }}
            className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Tulis Pesanmu
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Nama / Panggilan
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi, Purnama, Mulia"
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Pesan / Kesan
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis pesan kenanganmu untuk kelas Nexuz..."
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-colors resize-none"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Mengirim..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Pesan
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Daftar Pesan */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, margin: "-100px" }}
            className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scroll"
          >
            {memories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Belum ada pesan. Jadi yang pertama menulis!
              </div>
            ) : (
              memories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={memory.avatar}
                      alt={memory.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="font-semibold text-white">{memory.name}</h4>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Calendar className="w-3 h-3" />
                          {memory.date}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mt-2">{memory.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default MemoryBook;