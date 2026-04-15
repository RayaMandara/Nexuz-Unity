export interface GalleryImage {
  id: number;
  src: string;
  title: string;
  date: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    title: "Wisata Belajar ke Museum",
    date: "15 Maret 2025",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    title: "Juara Lomba Kompetisi Siswa",
    date: "10 Februari 2025",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
    title: "Kegiatan Bakti Sosial",
    date: "5 Januari 2025",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    title: "Pentas Seni Kelas",
    date: "20 Desember 2024",
  },
];