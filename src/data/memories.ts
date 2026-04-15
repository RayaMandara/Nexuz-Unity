export interface Memory {
  id: number;
  name: string;
  message: string;
  date: string;
  avatar: string;
}

export const initialMemories: Memory[] = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    message: "Terima kasih Nexuz! Kalian semua luar biasa. Semoga sukses selalu!",
    date: "2025-03-15",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
  },
  {
    id: 2,
    name: "Citra Dewi",
    message: "Kelas terbaik yang pernah aku punya. Kenangan indah yang nggak akan pernah terlupakan 💕",
    date: "2025-03-14",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
  },
  {
    id: 3,
    name: "Budi Santoso",
    message: "We are family! Terus jaga silaturahmi ya guys 🔥",
    date: "2025-03-13",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100"
  },
  {
    id: 4,
    name: "Dian Pratama",
    message: "Nexuz bukan cuma kelas, ini rumah kedua buat aku. Love you all!",
    date: "2025-03-12",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
  }
];