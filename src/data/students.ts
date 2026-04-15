export interface Student {
  id: number;
  name: string;
  nickname: string;
  photo: string;
  hobby: string;
  dream: string;
  quote: string;
  jurusan: string; // Tetap ada untuk kompatibilitas, tapi semua "RPL"
}

export const students: Student[] = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    nickname: "Ahmad",
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
    hobby: "Programming & Gaming",
    dream: "Menjadi Software Engineer di Google",
    quote: "Kode adalah seni, dan aku adalah senimannya.",
    jurusan: "RPL",
  },
  {
    id: 2,
    name: "Citra Dewi",
    nickname: "Citra",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    hobby: "Melukis & Menulis",
    dream: "Menjadi Illustrator Ternama",
    quote: "Warna-warni kehidupan adalah inspirasiku.",
    jurusan: "RPL",
  },
  // Tambah siswa lain dengan jurusan "RPL"
];