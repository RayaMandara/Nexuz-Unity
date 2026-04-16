"use client";

import { useState, useEffect, useRef } from "react";
import {
  Users,
  Image,
  Clock,
  LogOut,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Heart,
  RefreshCw,
  Music,
  Play,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageCropModal from "@/components/ImageCropModal";

// Tipe data
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
  image_position_x: number;
  image_position_y: number;
}

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  date: string;
}

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: string;
  date: string;
}

interface Memory {
  id: number;
  name: string;
  message: string;
  date: string;
  avatar: string;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("siswa");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<"add" | "edit">("add");

  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem("nexuz_admin_auth");
      const savedTime = localStorage.getItem("nexuz_admin_login_time");

      const isValid =
        savedAuth === "true" &&
        savedTime &&
        Date.now() - parseInt(savedTime) < 86400000;

      if (isValid) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        localStorage.removeItem("nexuz_admin_auth");
        localStorage.removeItem("nexuz_admin_login_time");
        window.location.href = "/";
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loadAllData = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadStudents(),
      loadGallery(),
      loadTimeline(),
      loadMemories(),
      loadSongs(),
    ]);
    setIsRefreshing(false);
  };

  const loadStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading students:", error);
    } else {
      setStudents(data || []);
    }
  };

  const loadGallery = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading gallery:", error);
    } else {
      setGallery(data || []);
    }
  };

  const loadTimeline = async () => {
    const { data, error } = await supabase
      .from("timeline")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading timeline:", error);
    } else {
      setTimeline(data || []);
    }
  };

  const loadMemories = async () => {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error loading memories:", error);
    } else {
      setMemories(data || []);
    }
  };

  const loadSongs = async () => {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading songs:", error);
    } else {
      setSongs(data || []);
    }
  };

  // CRUD Siswa
  const addStudent = async (student: Omit<Student, "id">) => {
    const newStudent = { ...student, id: Date.now(), jurusan: "RPL" };
    const { error } = await supabase.from("students").insert([newStudent]);

    if (error) {
      alert("Gagal menambah siswa: " + error.message);
      return false;
    }
    await loadStudents();
    return true;
  };

  const updateStudent = async (id: number, updatedData: Partial<Student>) => {
    const { error } = await supabase
      .from("students")
      .update({ ...updatedData, jurusan: "RPL" })
      .eq("id", id);

    if (error) {
      alert("Gagal update siswa: " + error.message);
      return false;
    }
    await loadStudents();
    return true;
  };

  const deleteStudent = async (id: number) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return false;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus siswa: " + error.message);
      return false;
    }
    await loadStudents();
    return true;
  };

  // CRUD Gallery
  const addGallery = async (item: Omit<GalleryImage, "id">) => {
    const newItem = { ...item, id: Date.now() };
    const { error } = await supabase.from("gallery").insert([newItem]);

    if (error) {
      alert("Gagal menambah foto: " + error.message);
      return false;
    }
    await loadGallery();
    return true;
  };

  const updateGallery = async (
    id: number,
    updatedData: Partial<GalleryImage>,
  ) => {
    const { error } = await supabase
      .from("gallery")
      .update(updatedData)
      .eq("id", id);
    if (error) {
      alert("Gagal update foto: " + error.message);
      return false;
    }
    await loadGallery();
    return true;
  };

  const deleteGallery = async (id: number) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return false;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus foto: " + error.message);
      return false;
    }
    await loadGallery();
    return true;
  };

  // CRUD Timeline
  const addTimeline = async (item: Omit<TimelineEvent, "id">) => {
    const newItem = { ...item, id: Date.now() };
    const { error } = await supabase.from("timeline").insert([newItem]);

    if (error) {
      alert("Gagal menambah event: " + error.message);
      return false;
    }
    await loadTimeline();
    return true;
  };

  const updateTimeline = async (
    id: number,
    updatedData: Partial<TimelineEvent>,
  ) => {
    const { error } = await supabase
      .from("timeline")
      .update(updatedData)
      .eq("id", id);
    if (error) {
      alert("Gagal update event: " + error.message);
      return false;
    }
    await loadTimeline();
    return true;
  };

  const deleteTimeline = async (id: number) => {
    if (!confirm("Yakin ingin menghapus event ini?")) return false;
    const { error } = await supabase.from("timeline").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus event: " + error.message);
      return false;
    }
    await loadTimeline();
    return true;
  };

  // CRUD Memories
  const deleteMemory = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return false;
    const { error } = await supabase.from("memories").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus pesan: " + error.message);
      return false;
    }
    await loadMemories();
    return true;
  };

  // CRUD Songs
  const addSong = async (song: Omit<Song, "id">) => {
    const newSong = { ...song, id: Date.now(), duration: 0 };
    const { error } = await supabase.from("songs").insert([newSong]);

    if (error) {
      alert("Gagal menambah lagu: " + error.message);
      return false;
    }
    await loadSongs();
    return true;
  };

  const deleteSong = async (id: number) => {
    if (!confirm("Yakin ingin menghapus lagu ini?")) return false;
    const { error } = await supabase.from("songs").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus lagu: " + error.message);
      return false;
    }
    await loadSongs();
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem("nexuz_admin_auth");
    localStorage.removeItem("nexuz_admin_login_time");
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-white/5 border-b border-white/10 px-6 py-4 sticky top-0 z-10 backdrop-blur">
        <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-xl font-bold text-white">Admin Panel Nexuz</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4 flex-wrap">
          <button
            onClick={() => setActiveTab("siswa")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "siswa"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Data Siswa ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("galeri")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "galeri"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Image className="w-4 h-4" />
            Galeri Foto ({gallery.length})
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "timeline"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            Timeline ({timeline.length})
          </button>
          <button
            onClick={() => setActiveTab("kenangan")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "kenangan"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4" />
            Buku Kenangan ({memories.length})
          </button>
          <button
            onClick={() => setActiveTab("musik")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "musik"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Music className="w-4 h-4" />
            Musik ({songs.length})
          </button>
        </div>

        {/* Data Siswa */}
        {activeTab === "siswa" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-white">Manajemen Siswa</h2>
              <button
                onClick={() => {
                  setModalType("add");
                  setEditingItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Siswa
              </button>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                Belum ada data siswa
              </div>
            ) : (
              <div className="grid gap-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-black/20">
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: `${student.image_position_x || 50}% ${student.image_position_y || 50}%`,
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {student.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {student.nickname}{" "}
                          {student.aka ? `• ${student.aka}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setModalType("edit");
                          setEditingItem(student);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4 text-yellow-400" />
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Galeri */}
        {activeTab === "galeri" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-white">Manajemen Galeri</h2>
              <button
                onClick={() => {
                  setModalType("add");
                  setEditingItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Foto
              </button>
            </div>

            {gallery.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                Belum ada foto galeri
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col gap-3 hover:bg-white/10 transition"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{item.date}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setModalType("edit");
                            setEditingItem(item);
                            setShowModal(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button
                          onClick={() => deleteGallery(item.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {activeTab === "timeline" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-white">
                Manajemen Timeline
              </h2>
              <button
                onClick={() => {
                  setModalType("add");
                  setEditingItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Event
              </button>
            </div>

            {timeline.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                Belum ada event timeline
              </div>
            ) : (
              <div className="grid gap-3">
                {timeline.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4 hover:bg-white/10 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <h3 className="font-semibold text-white">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {item.year} • {item.date}
                      </p>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setModalType("edit");
                          setEditingItem(item);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4 text-yellow-400" />
                      </button>
                      <button
                        onClick={() => deleteTimeline(item.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Buku Kenangan */}
        {activeTab === "kenangan" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-white">
                Manajemen Buku Kenangan
              </h2>
            </div>

            {memories.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                Belum ada pesan kenangan
              </div>
            ) : (
              <div className="grid gap-3">
                {memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={memory.avatar}
                        alt={memory.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-white">
                            {memory.name}
                          </h3>
                          <span className="text-gray-500 text-xs">
                            {memory.date}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">
                          {memory.message}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Musik */}
        {activeTab === "musik" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-white">Manajemen Musik</h2>
              <button
                onClick={() => {
                  setModalType("add");
                  setEditingItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Lagu
              </button>
            </div>

            {songs.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada lagu. Tambah lagu pertama kamu!</p>
                <p className="text-xs mt-2 text-gray-500">
                  Upload file MP3 (max 5MB)
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {song.title}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {song.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <audio controls className="h-8 w-32">
                        <source src={song.url} type="audio/mpeg" />
                      </audio>
                      <button
                        onClick={() => deleteSong(song.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <ModalForm
          type={modalType}
          data={editingItem}
          tab={activeTab}
          onClose={() => setShowModal(false)}
          onSave={async (formData: any) => {
            let success = false;
            if (activeTab === "siswa") {
              if (modalType === "add") {
                success = await addStudent(formData);
              } else {
                success = await updateStudent(editingItem.id, formData);
              }
            } else if (activeTab === "galeri") {
              if (modalType === "add") {
                success = await addGallery(formData);
              } else {
                success = await updateGallery(editingItem.id, formData);
              }
            } else if (activeTab === "timeline") {
              if (modalType === "add") {
                success = await addTimeline(formData);
              } else {
                success = await updateTimeline(editingItem.id, formData);
              }
            } else if (activeTab === "musik") {
              if (modalType === "add") {
                success = await addSong(formData);
              }
            }
            if (success) {
              setShowModal(false);
            }
          }}
        />
      )}
    </div>
  );
}

// Modal Form Component
function ModalForm({ type, data, tab, onClose, onSave }: any) {
  const [formData, setFormData] = useState(
    data || {
      image_position_x: 50,
      image_position_y: 50,
    },
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fieldName === "url") {
      if (file.type !== "audio/mpeg") {
        alert("File harus berformat MP3!");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 10MB.");
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [fieldName]: reader.result });
        setUploading(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    if (file.type.startsWith("image/")) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [fieldName]: reader.result,
          image_position_x: 50,
          image_position_y: 50,
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert("File harus berupa gambar!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  const fields: Record<string, any[]> = {
    siswa: [
      { name: "name", label: "Nama Lengkap", type: "text", required: true },
      { name: "nickname", label: "Panggilan", type: "text", required: true },
      {
        name: "aka",
        label: "AKA (As Known As)",
        type: "text",
        required: false,
        placeholder: "Contoh: Si Cerdas, The Master",
      },
      {
        name: "photo",
        label: "Foto Profil",
        type: "file",
        required: type === "add",
      },
      { name: "hobby", label: "Hobi", type: "text", required: true },
      { name: "dream", label: "Cita-cita", type: "text", required: true },
      {
        name: "quote",
        label: "Quote Pribadi",
        type: "textarea",
        required: true,
      },
    ],
    galeri: [
      {
        name: "src",
        label: "Foto Galeri",
        type: "file",
        required: type === "add",
      },
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "date", label: "Tanggal", type: "text", required: true },
    ],
    timeline: [
      { name: "year", label: "Tahun", type: "text", required: true },
      { name: "title", label: "Judul Event", type: "text", required: true },
      {
        name: "description",
        label: "Deskripsi",
        type: "textarea",
        required: true,
      },
      { name: "icon", label: "Icon (emoji)", type: "text", required: true },
      { name: "date", label: "Tanggal", type: "text", required: true },
    ],
    musik: [
      {
        name: "title",
        label: "Judul Lagu",
        type: "text",
        required: true,
        placeholder: "Contoh: Class Anthem",
      },
      {
        name: "artist",
        label: "Artis / Penyanyi",
        type: "text",
        required: true,
        placeholder: "Contoh: Nexuz Class",
      },
      {
        name: "url",
        label: "File MP3",
        type: "file",
        required: true,
        accept: "audio/mpeg",
      },
    ],
  };

  const currentFields = fields[tab];

  if (!currentFields) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-2xl border border-white/20 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-black">
          <h3 className="text-xl font-bold text-white">
            {type === "add" ? "Tambah" : "Edit"}{" "}
            {tab === "siswa"
              ? "Siswa"
              : tab === "galeri"
                ? "Galeri"
                : tab === "timeline"
                  ? "Timeline"
                  : "Musik"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentFields.map((field: any) => (
            <div key={field.name}>
              <label className="block text-gray-400 text-sm mb-1">
                {field.label}
              </label>

              {field.type === "file" ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={field.accept || "image/*"}
                    onChange={(e) => handleFileUpload(e, field.name)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white hover:bg-white/20 transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading
                      ? "Uploading..."
                      : formData[field.name]
                        ? "Ganti File"
                        : "Pilih File"}
                  </button>

                  {/* Preview foto profil dengan klik untuk crop */}
                  {formData[field.name] &&
                    !uploading &&
                    field.name === "photo" && (
                      <div
                        className="mt-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition"
                        onClick={() => setShowCropModal(true)}
                      >
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-black/20 border border-white/20">
                            <img
                              src={formData[field.name]}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              style={{
                                objectPosition: `${formData.image_position_x ?? 50}% ${formData.image_position_y ?? 50}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-400">
                            <p>X: {formData.image_position_x ?? 50}%</p>
                            <p>Y: {formData.image_position_y ?? 50}%</p>
                            <p className="text-blue-400 mt-1">
                              ✏️ Klik untuk atur posisi
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {formData[field.name] &&
                    !uploading &&
                    field.name === "url" && (
                      <div className="mt-2 text-gray-400 text-sm">
                        ✅ File siap diupload
                      </div>
                    )}
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-white/50"
                  rows={3}
                  required={field.required}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-white/50"
                  required={field.required}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploading || saving}
              className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>

        {/* Image Crop Modal */}
        {formData.photo && (
          <ImageCropModal
            isOpen={showCropModal}
            imageSrc={formData.photo}
            initialX={Math.round(formData.image_position_x ?? 50)}
            initialY={Math.round(formData.image_position_y ?? 50)}
            onClose={() => setShowCropModal(false)}
            onSave={(x, y) => {
              setFormData({
                ...formData,
                image_position_x: Math.round(x),
                image_position_y: Math.round(y),
              });
              setShowCropModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
