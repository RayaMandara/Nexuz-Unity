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
  gender?: string;
  image_position_x?: number;
  image_position_y?: number;
  enable_sad_emoji?: boolean;
}

interface StudentCardProps {
  student: Student;
  onClick: () => void;
  index: number;
}

const getRoleBadge = (role?: string, isTeacher?: boolean) => {
  if (isTeacher) {
    return { label: "Wali Kelas", color: "bg-purple-600", icon: GraduationCap };
  }
  
  switch (role) {
    case "ketua":
      return { label: "Ketua", color: "bg-amber-600", icon: Crown };
    case "wakil":
      return { label: "Wakil", color: "bg-sky-600", icon: Star };
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
      viewport={{ once: false, margin: "-100px" }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer relative"
    >
      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm">
        <div className="relative overflow-hidden h-48 sm:h-52 md:h-56 bg-black/20">
          {/* Badge Emoji Burung */}
          {student.enable_sad_emoji && (
            <div className="absolute top-2 right-2 z-20 w-8 h-8 bg-black/60 backdrop-blur rounded-full flex items-center justify-center text-lg animate-pulse">
              🕊️
            </div>
          )}
          
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

        <div className="p-3 md:p-4">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm md:text-base font-bold text-white truncate max-w-[100px] md:max-w-[120px]">
              {student.aka || student.nickname}
            </h3>
            
            {roleBadge && (
              <span className={`${roleBadge.color} px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white inline-flex items-center gap-0.5 flex-shrink-0`}>
                <roleBadge.icon className="w-2.5 h-2.5" />
                {roleBadge.label === "Ketua" ? "Ketua" : 
                 roleBadge.label === "Wakil" ? "Wakil" :
                 roleBadge.label === "Sekretaris" ? "Sekretaris" :
                 roleBadge.label === "Bendahara" ? "Bendahara" :
                 roleBadge.label}
              </span>
            )}
          </div>
          
          <p className="text-gray-400 text-xs md:text-sm mb-2 truncate" title={student.name}>
            {student.name}
          </p>
          
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <User className="w-3 h-3" />
            <span>Klik</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard;