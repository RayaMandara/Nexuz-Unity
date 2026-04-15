"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { RefreshCw, Trophy, Star } from "lucide-react";

interface Student {
  id: number;
  name: string;
  nickname: string;
  photo: string;
  hobby: string;
  dream: string;
  quote: string;
  jurusan: string;
}

const MiniGame = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    fetchStudents();
    const savedHighScore = localStorage.getItem("nexuz_game_highscore");
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching students:', error);
    } else {
      setStudents(data || []);
      if (data && data.length > 0) {
        newRound(data);
      }
    }
    setIsLoading(false);
  };

  const shuffleArray = (arr: any[]) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const newRound = (studentsData = students) => {
    if (studentsData.length === 0) return;
    
    setIsLoading(true);
    const randomIndex = Math.floor(Math.random() * studentsData.length);
    const student = { ...studentsData[randomIndex] };
    
    const otherNames = studentsData.filter((s: Student) => s.id !== student.id).map((s: Student) => s.name);
    const shuffledOthers = shuffleArray(otherNames);
    const randomOptions = shuffleArray([student.name, ...shuffledOthers.slice(0, 3)]);
    
    setCurrentStudent(student);
    setOptions(randomOptions);
    setIsLoading(false);
  };

  const handleAnswer = (selectedName: string) => {
    if (isLoading || gameOver || !currentStudent) return;

    if (selectedName === currentStudent.name) {
      const newScore = score + 10;
      setScore(newScore);
      setMessage("✅ Benar! +10 poin");
      setMessageType("success");
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("nexuz_game_highscore", newScore.toString());
      }
      
      setTimeout(() => {
        setMessage("");
        if (round < 10) {
          setRound(round + 1);
          newRound();
        } else {
          setGameOver(true);
          setMessage(`🎉 Selesai! Skor akhir: ${newScore}`);
        }
      }, 1000);
    } else {
      setMessage(`❌ Salah! Itu adalah ${currentStudent.name}`);
      setMessageType("error");
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setGameOver(false);
    setMessage("");
    newRound();
  };

  if (isLoading) {
    return (
      <section id="game" className="py-24 px-6 bg-black min-h-screen flex items-center">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="text-gray-400">Loading game...</div>
        </div>
      </section>
    );
  }

  if (students.length === 0) {
    return (
      <section id="game" className="py-24 px-6 bg-black min-h-screen flex items-center">
        <div className="container mx-auto max-w-2xl text-center">
          <p className="text-gray-400">Tidak ada data siswa. Silakan tambah siswa di admin panel terlebih dahulu.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="game" className="py-24 px-6 bg-black min-h-screen flex items-center">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Mini Game
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400">Tebak teman sekelas dari foto blur!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center bg-white/5 rounded-2xl p-4 mb-6 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">High Score</p>
              <p className="text-white font-bold text-xl">{highScore}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Round</p>
            <p className="text-white font-bold text-xl">{round}/10</p>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">Score</p>
              <p className="text-white font-bold text-xl">{score}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-8 border border-white/10 text-center"
        >
          {!gameOver ? (
            <>
              <div className="relative mb-8">
                {currentStudent && (
                  <motion.div
                    key={currentStudent.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative inline-block"
                  >
                    <img
                      src={currentStudent.photo}
                      alt="Tebak siapa?"
                      className="w-48 h-48 rounded-full object-cover mx-auto shadow-2xl"
                      style={{ filter: `blur(${Math.max(3, 10 - Math.floor(round / 2))}px)` }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 to-transparent" />
                  </motion.div>
                )}
                <p className="text-gray-400 mt-4 text-sm">
                  Level blur: {Math.max(3, 10 - Math.floor(round / 2))}px
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-white font-medium transition-all"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3 rounded-lg ${
                      messageType === "success" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>
              <p className="text-gray-400 mb-2">Skor akhir kamu: {score}</p>
              {score === highScore && score > 0 && (
                <p className="text-yellow-400 mb-4">🎉 Skor tertinggi baru! 🎉</p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Main Lagi
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        <div className="text-center mt-6 text-gray-500 text-xs">
          <p>💡 Semakin tinggi round, foto semakin jelas!</p>
          <p>🏆 Jawab 10 pertanyaan dengan benar untuk menang</p>
        </div>
      </div>
    </section>
  );
};

export default MiniGame;