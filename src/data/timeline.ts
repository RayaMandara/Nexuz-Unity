export interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: string;
  date: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    year: "2024",
    title: "Awal Masuk Sekolah",
    description: "Momen pertama kali kita bertemu dan berkenalan di kelas. Rasa canggung bercampur antusiasme menyambut masa baru.",
    icon: "🎓",
    date: "15 Juli 2024"
  },
  {
    id: 2,
    year: "2024",
    title: "Class Gathering",
    description: "Acara kumpul bersama pertama di luar sekolah. Mulai terbangun rasa kekeluargaan yang hangat.",
    icon: "🤝",
    date: "20 Agustus 2024"
  },
  {
    id: 3,
    year: "2024",
    title: "Juara Lomba Sekolah",
    description: "Tim dari kelas kita berhasil meraih juara 1 lomba debat antar kelas. Prestasi membanggakan!",
    icon: "🏆",
    date: "10 Oktober 2024"
  },
  {
    id: 4,
    year: "2024",
    title: "Study Tour",
    description: "Wisata belajar ke Yogyakarta. Pengalaman seru dan penuh kenangan yang tidak terlupakan.",
    icon: "✈️",
    date: "5 Desember 2024"
  },
  {
    id: 5,
    year: "2025",
    title: "Bakti Sosial",
    description: "Berbagi kebahagiaan dengan masyarakat sekitar. Belajar arti kepedulian dan kebersamaan.",
    icon: "💝",
    date: "20 Januari 2025"
  },
  {
    id: 6,
    year: "2025",
    title: "Pentas Seni Kelas",
    description: "Menampilkan bakat terbaik di depan sekolah. Semua siswa tampil maksimal!",
    icon: "🎭",
    date: "15 Maret 2025"
  },
  {
    id: 7,
    year: "2025",
    title: "Sekarang",
    description: "Terus berkarya, berprestasi, dan mengukir kenangan terbaik bersama Nexuz.",
    icon: "⭐",
    date: "Sekarang"
  }
];