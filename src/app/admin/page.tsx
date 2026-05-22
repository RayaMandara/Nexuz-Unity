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
  FolderGit2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageCropper from "@/components/ImageCropper";

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
  is_teacher?: boolean;
  role?: string;
  gender?: string;
}

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  date: string;
  year: string;
  description: string;
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

interface Project {
  id: number;
  name: string;
  image_url: string;
  tech_stack: string;
  description: string;
  project_link: string | null;
  year: string;
  status: string;
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
  const [projects, setProjects] = useState<Project[]>([]);

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
      loadProjects(),
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

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      console.error("Error loading projects:", error);
    } else {
      setProjects(data || []);
    }
  };

  // Validasi role sebelum tambah/edit
  const validateRole = async (
    formData: any,
    isEdit: boolean,
    currentId?: number,
  ) => {
    const { data: allStudents } = await supabase
      .from("students")
      .select("id, role, is_teacher");

    if (formData.is_teacher) {
      const existingTeacher = allStudents?.find(
        (s) => s.is_teacher === true && s.id !== currentId,
      );
      if (existingTeacher) {
        alert("❌ Wali Kelas sudah ada! Hanya boleh 1 Wali Kelas.");
        return false;
      }
    }

    if (formData.role === "ketua") {
      const existingKetua = allStudents?.find(
        (s) => s.role === "ketua" && s.id !== currentId,
      );
      if (existingKetua) {
        alert("❌ Ketua Kelas sudah ada! Hanya boleh 1 Ketua Kelas.");
        return false;
      }
    }

    if (formData.role === "wakil") {
      const existingWakil = allStudents?.find(
        (s) => s.role === "wakil" && s.id !== currentId,
      );
      if (existingWakil) {
        alert("❌ Wakil Ketua sudah ada! Hanya boleh 1 Wakil Ketua.");
        return false;
      }
    }

    if (formData.role === "sekretaris1" || formData.role === "sekretaris2") {
      const existingSekretaris =
        allStudents?.filter(
          (s) =>
            (s.role === "sekretaris1" || s.role === "sekretaris2") &&
            s.id !== currentId,
        ).length || 0;
      if (existingSekretaris >= 2) {
        alert("❌ Sekretaris sudah mencapai 2 orang! Tidak bisa tambah lagi.");
        return false;
      }
    }

    if (formData.role === "bendahara1" || formData.role === "bendahara2") {
      const existingBendahara =
        allStudents?.filter(
          (s) =>
            (s.role === "bendahara1" || s.role === "bendahara2") &&
            s.id !== currentId,
        ).length || 0;
      if (existingBendahara >= 2) {
        alert("❌ Bendahara sudah mencapai 2 orang! Tidak bisa tambah lagi.");
        return false;
      }
    }

    return true;
  };

  // CRUD Siswa
  const addStudent = async (student: Omit<Student, "id">) => {
    const isValid = await validateRole(student, false);
    if (!isValid) return false;

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
    const isValid = await validateRole(updatedData, true, id);
    if (!isValid) return false;

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
    try {
      const base64Data = item.src.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], `${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const fileName = `gallery/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (uploadError) {
        alert("Gagal upload file ke storage: " + uploadError.message);
        return false;
      }

      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      const newItem = {
        src: urlData.publicUrl,
        title: item.title,
        description: item.description || "",
        year: item.year,
        id: Date.now(),
      };

      const { error: dbError } = await supabase
        .from("gallery")
        .insert([newItem]);
      if (dbError) {
        alert("Gagal menambah foto: " + dbError.message);
        return false;
      }
      await loadGallery();
      return true;
    } catch (err) {
      console.error("Error adding gallery:", err);
      alert("Terjadi kesalahan saat menambah foto");
      return false;
    }
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
    try {
      const base64Data = song.url.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], `${Date.now()}.mp3`, {
        type: "audio/mpeg",
      });

      const fileName = `songs/${Date.now()}.mp3`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("music")
        .upload(fileName, file);

      if (uploadError) {
        alert("Gagal upload file ke storage: " + uploadError.message);
        return false;
      }

      const { data: urlData } = supabase.storage
        .from("music")
        .getPublicUrl(fileName);

      const newSong = {
        title: song.title,
        artist: song.artist,
        url: urlData.publicUrl,
        id: Date.now(),
        duration: 0,
      };

      const { error: dbError } = await supabase.from("songs").insert([newSong]);
      if (dbError) {
        alert("Gagal menambah lagu ke database: " + dbError.message);
        return false;
      }
      await loadSongs();
      return true;
    } catch (err) {
      console.error("Error adding song:", err);
      alert("Terjadi kesalahan saat menambah lagu");
      return false;
    }
  };

  const deleteSong = async (id: number) => {
    if (!confirm("Yakin ingin menghapus lagu ini?")) return false;

    const songToDelete = songs.find((s) => s.id === id);
    if (songToDelete?.url && songToDelete.url.includes("supabase.co")) {
      const urlParts = songToDelete.url.split("/");
      const fileName = `songs/${urlParts[urlParts.length - 1]}`;
      await supabase.storage.from("music").remove([fileName]);
    }

    const { error } = await supabase.from("songs").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus lagu: " + error.message);
      return false;
    }
    await loadSongs();
    return true;
  };

  // CRUD Projects
  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const base64Data = project.image_url.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], `${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const fileName = `projects/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("projects")
        .upload(fileName, file);

      if (uploadError) {
        alert("Gagal upload gambar: " + uploadError.message);
        return false;
      }

      const { data: urlData } = supabase.storage
        .from("projects")
        .getPublicUrl(fileName);

      const newProject = {
        ...project,
        image_url: urlData.publicUrl,
        id: Date.now(),
        project_link: project.project_link?.trim() || null,
      };

      const { error: dbError } = await supabase
        .from("projects")
        .insert([newProject]);
      if (dbError) {
        alert("Gagal menambah projek: " + dbError.message);
        return false;
      }
      await loadProjects();
      return true;
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Terjadi kesalahan saat menambah projek");
      return false;
    }
  };

  const updateProject = async (id: number, updatedData: Partial<Project>) => {
    try {
      let dataToUpdate: Partial<Project> = { ...updatedData };

      // Kalau ada gambar baru (base64), upload dulu ke storage
      if (updatedData.image_url?.startsWith("data:")) {
        const base64Data = updatedData.image_url.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], `${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        const fileName = `projects/${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("projects")
          .upload(fileName, file);

        if (uploadError) {
          alert("Gagal upload gambar: " + uploadError.message);
          return false;
        }

        const { data: urlData } = supabase.storage
          .from("projects")
          .getPublicUrl(fileName);

        dataToUpdate.image_url = urlData.publicUrl;
      }

      // project_link boleh null/kosong
      dataToUpdate.project_link = updatedData.project_link?.trim() || null;

      const { error } = await supabase
        .from("projects")
        .update(dataToUpdate)
        .eq("id", id);

      if (error) {
        alert("Gagal update projek: " + error.message);
        return false;
      }
      await loadProjects();
      return true;
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Terjadi kesalahan saat update projek");
      return false;
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Yakin ingin menghapus projek ini?")) return false;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus projek: " + error.message);
      return false;
    }
    await loadProjects();
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
          <button
            onClick={() => setActiveTab("projek")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "projek"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Projek ({projects.length})
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
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {student.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {student.nickname}{" "}
                          {student.aka ? `• ${student.aka}` : ""}
                          {student.is_teacher && (
                            <span className="ml-2 text-xs bg-yellow-500/30 text-yellow-400 px-2 py-0.5 rounded-full">
                              Wali Kelas
                            </span>
                          )}
                          {!student.is_teacher &&
                            student.role &&
                            student.role !== "siswa" && (
                              <span className="ml-2 text-xs bg-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full">
                                {student.role === "ketua" && "Ketua Kelas"}
                                {student.role === "wakil" && "Wakil Ketua"}
                                {(student.role === "sekretaris1" ||
                                  student.role === "sekretaris2") &&
                                  "Sekretaris"}
                                {(student.role === "bendahara1" ||
                                  student.role === "bendahara2") &&
                                  "Bendahara"}
                              </span>
                            )}
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
              // Kelompokkan berdasarkan tahun
              (() => {
                const groupedByYear: Record<string, GalleryImage[]> = {};
                gallery.forEach((item) => {
                  if (!groupedByYear[item.year]) {
                    groupedByYear[item.year] = [];
                  }
                  groupedByYear[item.year].push(item);
                });
                const years = Object.keys(groupedByYear).sort();

                return (
                  <div className="space-y-8">
                    {years.map((year) => (
                      <div
                        key={year}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Tahun {year}
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {groupedByYear[year].map((item) => (
                            <div
                              key={item.id}
                              className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col gap-3 hover:bg-white/10 transition"
                            >
                              <img
                                src={item.src}
                                alt={item.title}
                                className="w-full h-40 object-cover rounded-lg"
                              />
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-white truncate">
                                    {item.title}
                                  </h3>
                                  {item.description && (
                                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}
                                  <p className="text-gray-500 text-xs mt-1">
                                    {item.year}
                                  </p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
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
                      </div>
                    ))}
                  </div>
                );
              })()
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
                  Upload file MP3 (max 10MB)
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

        {/* Projek */}
        {activeTab === "projek" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-white">Manajemen Projek</h2>
              <button
                onClick={() => {
                  setModalType("add");
                  setEditingItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Projek
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FolderGit2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada projek. Tambah projek pertama!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col gap-3 hover:bg-white/10 transition"
                  >
                    <img
                      src={project.image_url}
                      alt={project.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {project.name}
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">
                          {project.tech_stack}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {project.year} •{" "}
                          <span
                            className={
                              project.status === "selesai"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            {project.status}
                          </span>
                        </p>
                        {/* Link projek — hanya tampil kalau ada */}
                        {project.project_link ? (
                          <a
                            href={project.project_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline mt-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Lihat Projek
                          </a>
                        ) : (
                          <span className="inline-block text-xs text-gray-600 mt-1">
                            Tidak ada link
                          </span>
                        )}
                      </div>
                      {/* Tombol Edit & Delete */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => {
                            setModalType("edit");
                            setEditingItem(project);
                            setShowModal(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
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
            } else if (activeTab === "projek") {
              if (modalType === "add") {
                success = await addProject(formData);
              } else {
                success = await updateProject(editingItem.id, formData);
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
  const [formData, setFormData] = useState(data || { year: "2024" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Handle audio upload (field "url")
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

    // Handle gallery image upload (field "src")
    if (fieldName === "src") {
      if (file.type.startsWith("image/")) {
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, [fieldName]: reader.result });
          setUploading(false);
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    // Handle project image upload (field "image_url")
    if (fieldName === "image_url") {
      if (file.type.startsWith("image/")) {
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, [fieldName]: reader.result });
          setUploading(false);
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    // Handle profile photo upload (field "photo") — buka crop modal
    if (file.type.startsWith("image/")) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === "photo") {
          setTempImageSrc(reader.result as string);
          setShowCropModal(true);
        } else {
          setFormData({ ...formData, [fieldName]: reader.result });
        }
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
        placeholder: "Contoh: Sam, Dave",
      },
      {
        name: "photo",
        label: "Foto Profil",
        type: "file",
        required: type === "add",
      },
      {
        name: "is_teacher",
        label: "Wali Kelas",
        type: "checkbox",
        default: false,
      },
      {
        name: "role",
        label: "Jabatan",
        type: "select",
        options: [
          { value: "siswa", label: "Siswa" },
          { value: "ketua", label: "Ketua Kelas" },
          { value: "wakil", label: "Wakil Ketua" },
          { value: "sekretaris1", label: "Sekretaris 1" },
          { value: "sekretaris2", label: "Sekretaris 2" },
          { value: "bendahara1", label: "Bendahara 1" },
          { value: "bendahara2", label: "Bendahara 2" },
        ],
        default: "siswa",
      },
      {
        name: "gender",
        label: "Jenis Kelamin",
        type: "select",
        options: [
          { value: "L", label: "Laki-laki" },
          { value: "P", label: "Perempuan" },
        ],
        default: "L",
      },
      { name: "hobby", label: "Hobi", type: "text", required: true },
      { name: "dream", label: "Cita-cita", type: "text", required: true },
      {
        name: "quote",
        label: "Quote/Kata-Kata",
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
      {
        name: "description",
        label: "Deskripsi (opsional)",
        type: "textarea",
        required: false,
        placeholder: "Cerita singkat tentang foto ini...",
      },
      {
        name: "year",
        label: "Tahun",
        type: "select",
        options: [
          { value: "2024", label: "2024" },
          { value: "2025", label: "2025" },
          { value: "2026", label: "2026" },
          { value: "2027", label: "2027" },
        ],
        default: "2024",
        required: true,
      },
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
    projek: [
      {
        name: "image_url",
        label: "Gambar Projek",
        type: "file",
        required: type === "add",
      },
      {
        name: "name",
        label: "Nama Projek",
        type: "text",
        required: true,
        placeholder: "Contoh: Perpustakaan Online",
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "textarea",
        required: true,
        placeholder: "Deskripsi Projek",
      },
      {
        name: "tech_stack",
        label: "Tech Stack",
        type: "text",
        required: true,
        placeholder: "Contoh: Laravel, Tailwind",
      },
      {
        name: "project_link",
        label: "Link Projek (opsional)",
        type: "text",
        required: false,
        placeholder: "https://...",
      },
      {
        name: "year",
        label: "Tahun",
        type: "text",
        required: true,
        placeholder: "2025",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "selesai", label: "Selesai" },
          { value: "ongoing", label: "Ongoing" },
        ],
        default: "selesai",
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
                  : tab === "musik"
                    ? "Musik"
                    : "Projek"}
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

                  {formData[field.name] &&
                    !uploading &&
                    field.name === "src" && (
                      <div className="mt-2">
                        <img
                          src={formData[field.name]}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                  {formData[field.name] &&
                    !uploading &&
                    field.name === "image_url" && (
                      <div className="mt-2">
                        <img
                          src={formData[field.name]}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                  {formData[field.name] &&
                    !uploading &&
                    field.name === "photo" && (
                      <div className="mt-3 p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-black/20 border border-white/20">
                            <img
                              src={formData[field.name]}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-xs text-gray-400">
                            <p>Foto siap di-crop</p>
                            <p className="text-blue-400 mt-1">
                              ✏️ Tunggu, modal crop akan muncul...
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
              ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.name]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-white/50"
                  />
                  <span className="text-white text-sm">{field.label}</span>
                </div>
              ) : field.type === "select" ? (
                <select
                  value={formData[field.name] || field.default || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className="w-full bg-black/60 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-white/50 appearance-none cursor-pointer"
                  style={{ colorScheme: "dark" }}
                >
                  {field.options.map((opt: any) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-black text-white py-1"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
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

        <ImageCropper
          isOpen={showCropModal}
          imageSrc={tempImageSrc}
          onClose={() => {
            setShowCropModal(false);
            setTempImageSrc("");
          }}
          onCropComplete={(croppedImage) => {
            setFormData({ ...formData, photo: croppedImage });
            setShowCropModal(false);
            setTempImageSrc("");
          }}
        />
      </div>
    </div>
  );
}
