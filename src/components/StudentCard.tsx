"use client";

import { motion } from "framer-motion";
import { User, Crown, Star, FileText, Calculator, GraduationCap } from "lucide-react";

interface Student {
  id: number;
  name: string;
  nickname: string;
  aka: string;
  photo: string;
  hobby: string;
  dream: string;
  quote: string;
  jurusan: string;
  is_teacher?: boolean;
  role?: string;
  image_position_x?: number;
  image_position_y?: number;
}

interface StudentCardProps {
  student: Student;
  onClick: () => void;
  index: number;
}

// Fungsi untuk mendapatkan badge berdasarkan role
const getRoleBadge = (role?: string, isTeacher?: boolean) => {
  // Wali Kelas
  if (isTeacher) {
    return { label: "Wali Kelas", color: "bg-purple-600", icon: GraduationCap };
  }
  
  // Jabatan siswa
  switch (role) {
    case "ketua":
      return { label: "Ketua Kelas", color: "bg-amber-600", icon: Crown };
    case "wakil":
      return { label: "Wakil Ketua", color: "bg-sky-600", icon: Star };
    case "sekretaris1":
    case "sekretaris2":
      return { label: "Sekretaris", color: "bg-emerald-600", icon: FileText };
    case "bendahara1":
    case "bendahara2":
      return { label: "Bendahara", color: "bg-blue-600", icon: Calculator };
    default:
      return null;
  }
};

const StudentCard = ({ student, onClick, index }: StudentCardProps) => {
  const roleBadge = getRoleBadge(student.role, student.is_teacher);

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
        <div className="relative overflow-hidden h-64 bg-black/20">
          <img
            src={student.photo}
            alt={student.nickname}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            style={{
              objectPosition: `${student.image_position_x || 50}% ${student.image_position_y || 50}%`
            }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="p-5">
          {/* Nama dan Badge dalam satu baris (flex) */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-xl font-bold text-white truncate">{student.aka || student.nickname}</h3>
            
            {/* Badge */}
            {roleBadge && (
              <span className={`${roleBadge.color} px-2 py-0.5 rounded-full text-xs font-semibold text-white inline-flex items-center gap-1 flex-shrink-0`}>
                <roleBadge.icon className="w-3 h-3" />
                {roleBadge.label}
              </span>
            )}
          </div>
          
          {/* Nama lengkap */}
          <p className="text-gray-400 text-sm mb-3 truncate" title={student.name}>
            {student.name}
          </p>
          
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