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
  image_position_x?: number;
  image_position_y?: number;
}

const MiniGame = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [gameQueue, setGameQueue] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [optionsEmojis, setOptionsEmojis] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const TOTAL_ROUNDS = 10;

  const funnyEmojis = [
    "😀",
    "😂",
    "🤣",
    "😎",
    "🤔",
    "🥴",
    "😜",
    "🤪",
    "😏",
    "🙃",
    "😇",
    "🥳",
    "😱",
    "🤯",
    "😈",
    "👻",
    "💀",
    "🔥",
    "⭐",
    "💪",
    "🤘",
    "✌️",
    "👌",
    "👍",
    "💯",
    "🎉",
    "✨",
    "🌟",
    "💎",
    "🎈",
  ];

  const getRandomEmoji = () => {
    return funnyEmojis[Math.floor(Math.random() * funnyEmojis.length)];
  };

  useEffect(() => {
    fetchStudents();
    const savedHighScore = localStorage.getItem("nexuz_game_highscore");
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching students:", error);
        return;
      }

      console.log("Fetched students count:", data?.length);

      // Filter siswa yang bukan wali kelas
      const studentList = (data || []).filter((s) => s.is_teacher !== true);
      console.log("Students after filter (non-teacher):", studentList.length);

      setStudents(studentList);

      if (studentList.length >= 4) {
        const shuffled = shuffleArray([...studentList]);
        setGameQueue(shuffled);
        startNewRound(shuffled, studentList);
      } else {
        console.log("Not enough students, need at least 4");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const shuffleArray = (arr: any[]) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const startNewRound = (queue: Student[], allStudents = students) => {
    if (!queue || queue.length === 0) {
      console.log("Queue is empty");
      setIsLoading(false);
      return;
    }

    const student = queue[0];
    console.log("Current student:", student.nickname);

    // Ambil 3 siswa lain secara acak
    const otherStudents = allStudents.filter((s) => s.id !== student.id);
    console.log("Other students count:", otherStudents.length);

    if (otherStudents.length === 0) {
      setCurrentStudent(student);
      setOptions([student.nickname]);
      setOptionsEmojis([getRandomEmoji()]);
      setIsLoading(false);
      return;
    }

    // Acak dan ambil 3 siswa lain
    const shuffledOthers = shuffleArray([...otherStudents]);
    const selectedOthers = shuffledOthers.slice(0, 3);
    const otherNames = selectedOthers.map((s) => s.nickname);

    // Gabungkan nickname siswa + 3 lainnya
    const allOptions = [student.nickname, ...otherNames];
    const randomOptions = shuffleArray([...allOptions]);
    const randomEmojis = randomOptions.map(() => getRandomEmoji());

    console.log("Options:", randomOptions);

    setCurrentStudent(student);
    setOptions(randomOptions);
    setOptionsEmojis(randomEmojis);
    setIsLoading(false);
  };

  const handleAnswer = (selectedName: string, emoji: string) => {
    if (isLoading || gameOver || !currentStudent) return;

    if (selectedName === currentStudent.nickname) {
      const newScore = score + 10;
      setScore(newScore);
      setMessage(`Benar! ${emoji} +10 poin`);
      setMessageType("success");

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("nexuz_game_highscore", newScore.toString());
      }

      const newQueue = gameQueue.slice(1);
      setGameQueue(newQueue);

      setTimeout(() => {
        setMessage("");
        if (round < TOTAL_ROUNDS) {
          setRound(round + 1);
          if (newQueue.length === 0) {
            const freshQueue = shuffleArray([...students]);
            setGameQueue(freshQueue);
            startNewRound(freshQueue, students);
          } else {
            startNewRound(newQueue, students);
          }
        } else {
          setGameOver(true);
          setMessage(`🎉 Selesai! Skor akhir: ${newScore}`);
        }
      }, 1000);
    } else {
      setMessage(`❌ Salah! ${emoji} Itu adalah ${currentStudent.nickname}`);
      setMessageType("error");
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setGameOver(false);
    setMessage("");
    const freshQueue = shuffleArray([...students]);
    setGameQueue(freshQueue);
    startNewRound(freshQueue, students);
  };

  const getBlurLevel = () => {
    const blur = Math.min(15, Math.max(2, 2 + (round - 1) * 1.3));
    return Math.round(blur);
  };

  if (isLoading) {
    return (
      <section
        id="game"
        className="py-24 px-6 bg-black min-h-screen flex items-center"
      >
        <div className="container mx-auto max-w-2xl text-center">
          <div className="text-gray-400">Loading game...</div>
        </div>
      </section>
    );
  }

  if (students.length < 4) {
    return (
      <section
        id="game"
        className="py-24 px-6 bg-black min-h-screen flex items-center"
      >
        <div className="container mx-auto max-w-2xl text-center">
          <p className="text-gray-400">Minimal 4 siswa untuk bermain game.</p>
          <p className="text-gray-500 text-sm mt-2">
            Saat ini hanya {students.length} siswa (wali kelas tidak termasuk).
          </p>
          <p className="text-gray-500 text-sm">
            Silakan tambah siswa di admin panel.
          </p>
        </div>
      </section>
    );
  }

  const blurLevel = getBlurLevel();

  return (
    <section
      id="game"
      className="py-24 px-6 bg-black min-h-screen flex items-center"
    >
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: "-100px" }}
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
            <p className="text-white font-bold text-xl">
              {round}/{TOTAL_ROUNDS}
            </p>
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
                      style={{
                        filter: `blur(${blurLevel}px)`,
                        objectPosition: `${currentStudent.image_position_x || 50}% ${currentStudent.image_position_y || 50}%`,
                      }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 to-transparent" />
                  </motion.div>
                )}
                <p className="mt-4 text-sm font-semibold">
                  <span>Level : </span> 
                  {blurLevel <= 4 ? (
                    <span className="text-green-400">Easy</span>
                  ) : blurLevel <= 8 ? (
                    <span className="text-yellow-400">Medium</span>
                  ) : (
                    <span className="text-red-400">Hard</span>
                  )}
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
                    onClick={() => handleAnswer(option, optionsEmojis[index])}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-white font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">{optionsEmojis[index]}</span>
                    <span>{option}</span>
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
                <p className="text-yellow-400 mb-4">
                  🎉 Skor tertinggi baru! 🎉
                </p>
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
          <p>🏆 Jawab 10 pertanyaan dengan benar untuk menang</p>
        </div>
      </div>
    </section>
  );
};

export default MiniGame;
