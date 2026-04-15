"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StudentCard from "./StudentCard";
import StudentModal from "./StudentModal";
import type { Student } from "@/data/students";

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load data dari localStorage (sync dengan admin panel)
  useEffect(() => {
    const loadStudents = () => {
      const savedStudents = localStorage.getItem("nexuz_students");
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        // Default data jika belum ada
        const defaultStudents: Student[] = [
          { id: 1, name: "Ahmad Fauzi", nickname: "Ahmad", photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", hobby: "Programming", dream: "Software Engineer", quote: "Kode adalah seni", jurusan: "RPL" },
          { id: 2, name: "Citra Dewi", nickname: "Citra", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", hobby: "Melukis", dream: "Illustrator", quote: "Warna-warni kehidupan", jurusan: "RPL" },
          { id: 3, name: "Budi Santoso", nickname: "Budi", photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150", hobby: "Basket", dream: "Pebasket", quote: "Jangan pernah menyerah", jurusan: "RPL" },
        ];
        setStudents(defaultStudents);
        localStorage.setItem("nexuz_students", JSON.stringify(defaultStudents));
      }
    };

    loadStudents();

    // Listen untuk perubahan dari admin panel
    const handleStorageChange = () => {
      loadStudents();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedStudent(null), 300);
  };

  return (
    <section id="siswa" className="py-24 px-6 bg-black">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Daftar Siswa
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Kenali lebih dekat teman-teman sekelas kita yang luar biasa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => handleStudentClick(student)}
              index={index}
            />
          ))}
        </div>

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