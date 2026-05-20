"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import StudentCard from "./StudentCard";
import StudentModal from "./StudentModal";
import { Crown, Users, UsersRound } from "lucide-react";

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
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [maleStudents, setMaleStudents] = useState<Student[]>([]);
  const [femaleStudents, setFemaleStudents] = useState<Student[]>([]);
  const [teacher, setTeacher] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching students:', error);
    } else {
      const teacherData = data?.find(s => s.is_teacher === true) || null;
      const studentsData = data?.filter(s => s.is_teacher !== true) || [];
      
      // Pisahkan berdasarkan gender
      const males = studentsData.filter(s => s.gender === 'L' || !s.gender);
      const females = studentsData.filter(s => s.gender === 'P');
      
      setTeacher(teacherData);
      setMaleStudents(males);
      setFemaleStudents(females);
      setStudents(studentsData);
    }
    setLoading(false);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedStudent(null), 300);
  };

  if (loading) {
    return (
      <section id="siswa" className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="siswa" className="py-24 px-4 md:px-6 bg-black">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Keluarga Nexuz
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Bukan hanya kelas, ini adalah keluarga. Dengan bimbingan wali kelas yang hebat dan kebersamaan siswa yang luar biasa.
          </p>
        </motion.div>

        {/* Wali Kelas Section */}
        {teacher && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: false, margin: "-100px" }}
            className="mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h3 className="text-2xl font-semibold text-white">Wali Kelas</h3>
              <Crown className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="max-w-md mx-auto">
              <StudentCard
                student={teacher}
                onClick={() => handleStudentClick(teacher)}
                index={0}
              />
            </div>
          </motion.div>
        )}

        {/* Siswa Putra */}
        {maleStudents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-2xl font-semibold text-white">Boy's</h3>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {maleStudents.map((student, index) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onClick={() => handleStudentClick(student)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Siswi Putri */}
        {femaleStudents.length > 0 && (
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <UsersRound className="w-5 h-5 text-pink-400" />
              <h3 className="text-2xl font-semibold text-white">Girl's</h3>
              <UsersRound className="w-5 h-5 text-pink-400" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {femaleStudents.map((student, index) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onClick={() => handleStudentClick(student)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Jika tidak ada siswa sama sekali */}
        {maleStudents.length === 0 && femaleStudents.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Belum ada data siswa. Silakan tambah di admin panel.
          </div>
        )}

        <StudentModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default StudentList;