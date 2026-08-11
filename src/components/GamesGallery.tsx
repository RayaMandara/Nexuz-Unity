"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Gamepad2, ImageOff } from "lucide-react";

// Update Interface untuk menampung image_url
interface Game {
  id: number;
  title: string;
  description: string;
  image_url: string | null; // Tambahkan ini
  game_url: string;
}

const GamesGallery = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) {
        console.error('Error fetching games:', error);
        setGames([]);
      } else {
        setGames(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="games" className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="text-gray-400">Loading games...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="games" className="py-24 px-6 bg-black">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 flex items-center justify-center gap-3">
            <Gamepad2 className="w-10 h-10" />
            Game Kami
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Kumpulan game seru yang telah dibuat oleh keluarga Nexuz
          </p>
        </motion.div>

        {games.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Belum ada game.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: false, margin: "-100px" }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col"
              >
                {/* --- BAGIAN GAMBAR GAME --- */}
                <div className="relative w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden flex-shrink-0">
                  {game.image_url ? (
                    <motion.img
                      src={game.image_url}
                      alt={game.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-2">
                      <ImageOff className="w-8 h-8 opacity-50" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </div>
                {/* -------------------------- */}

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <Gamepad2 className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">{game.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                    {game.description}
                  </p>
                  
                  <a
                    href={game.game_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-white transition-all w-fit mt-auto"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Mainkan Sekarang
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GamesGallery;