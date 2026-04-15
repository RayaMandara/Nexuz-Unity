"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Calendar, BookOpen, Heart, MapPin, Clock } from "lucide-react";

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

const CountUp = ({
  end,
  duration = 2,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const ClassProfile = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load jumlah siswa dari localStorage
  useEffect(() => {
    const loadStudentCount = () => {
      const savedStudents = localStorage.getItem("nexuz_students");
      if (savedStudents) {
        const students = JSON.parse(savedStudents);
        setStudentCount(students.length);
      } else {
        // Default data
        const defaultStudents: Student[] = [
          {
            id: 1,
            name: "Ahmad Fauzi",
            nickname: "Ahmad",
            photo:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            hobby: "Programming",
            dream: "Software Engineer",
            quote: "Kode adalah seni",
            jurusan: "RPL",
          },
          {
            id: 2,
            name: "Citra Dewi",
            nickname: "Citra",
            photo:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            hobby: "Melukis",
            dream: "Illustrator",
            quote: "Warna-warni kehidupan",
            jurusan: "RPL",
          },
        ];
        setStudentCount(defaultStudents.length);
      }
      setIsLoading(false);
    };

    loadStudentCount();

    // Listen untuk perubahan data siswa
    const handleStorageChange = () => {
      loadStudentCount();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Statistik dinamis (siswa diambil dari localStorage)
  const stats = [
    { icon: Users, value: studentCount, label: "Siswa", suffix: "" },
    { icon: Calendar, value: 2024, label: "Angkatan", suffix: "" },
    { icon: BookOpen, value: 10, label: "Mata Pelajaran", suffix: "+" },
    { icon: Heart, value: null, label: "Kenangan", suffix: "∞" },
  ];

  const infoItems = [
    {
      icon: MapPin,
      label: "Lokasi",
      value: "SMK Pariwisata Triatma Jaya Badung",
    },
    { icon: Clock, label: "Tahun Ajaran", value: "2024 - 2027" },
  ];

  if (isLoading) {
    return (
      <section id="profil" className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="text-gray-400">Loading profil...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="profil" className="py-24 px-6 bg-black">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Profil Kelas
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Kelas dengan semangat juang tinggi dan prestasi membanggakan
          </p>
        </motion.div>

        {/* Deskripsi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/10"
        >
          <h3 className="text-2xl font-semibold mb-4">Tentang Kami</h3>
          <p className="text-gray-300 leading-relaxed">
            Kelas Nexuz adalah kelas yang terdiri dari{" "}
            <span className="text-white font-semibold">{studentCount}</span>{" "}
            siswa-siswi berbakat dengan semangat belajar tinggi. Kami memiliki
            visi menciptakan generasi yang tidak hanya cerdas secara akademik,
            tetapi juga memiliki karakter kuat dan jiwa kepemimpinan. Dengan
            didukung oleh guru-guru profesional dan fasilitas modern, kami terus
            berinovasi dan berprestasi di berbagai bidang.
          </p>
        </motion.div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 bg-white/5 rounded-xl p-5 border border-white/10"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{item.label}</p>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 text-center border border-white/10 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value !== null ? (
                  <CountUp end={stat.value} suffix={stat.suffix || ""} />
                ) : (
                  <span>{stat.suffix}</span>
                )}
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Moto */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-gray-400 italic text-lg">
            "Bersama Nexuz, Kita Wujudkan Mimpi"
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ClassProfile;
