"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

// Tipe data langsung di dalam file
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

interface StudentCardProps {
  student: Student;
  onClick: () => void;
  index: number;
}

const StudentCard = ({ student, onClick, index }: StudentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm">
        <div className="relative overflow-hidden h-64">
          <img
            src={student.photo}
            alt={student.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
          <p className="text-gray-400 text-sm mb-3">{student.nickname}</p>
          
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <User className="w-4 h-4" />
            <span>Klik untuk detail</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard;