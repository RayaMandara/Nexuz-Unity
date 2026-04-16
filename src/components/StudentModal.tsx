"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Target, Quote } from "lucide-react";

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
  image_position_x?: number;
  image_position_y?: number;
}

interface StudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentModal = ({ student, isOpen, onClose }: StudentModalProps) => {
  if (!student) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-2xl w-full overflow-hidden border border-white/20 shadow-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-64 md:h-full object-cover"
                    style={{
                      objectPosition: `${student.image_position_x || 50}% ${student.image_position_y || 50}%`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                <div className="md:w-3/5 p-6 md:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-3xl font-bold text-white mb-1">{student.name}</h2>
                    <p className="text-gray-400 mb-4">
                      {student.aka && <span className="text-white font-medium">{student.aka}</span>}
                      {student.aka && student.nickname && <span> • </span>}
                      {student.nickname && <span>{student.nickname}</span>}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Hobi</p>
                          <p className="text-white font-medium">{student.hobby}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Cita-cita</p>
                          <p className="text-white font-medium">{student.dream}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Quote className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Quote Pribadi</p>
                          <p className="text-white italic">"{student.quote}"</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudentModal;