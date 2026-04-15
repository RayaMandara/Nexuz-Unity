"use client";

import { useState, useEffect, useRef } from "react";
import { Users, Image, Clock, LogOut, Plus, Edit, Trash2, X, Upload, Heart } from "lucide-react";

// Tipe data
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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("siswa");
  const [students, setStudents] = useState<Student[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<"add" | "edit">("add");

  // Validasi autentikasi dengan timestamp
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem("nexuz_admin_auth");
      const savedTime = localStorage.getItem("nexuz_admin_login_time");
      
      const isValid = savedAuth === "true" && 
                      savedTime && 
                      (Date.now() - parseInt(savedTime) < 86400000);
      
      if (isValid) {
        setIsAuthenticated(true);
        loadData();
      } else {
        localStorage.removeItem("nexuz_admin_auth");
        localStorage.removeItem("nexuz_admin_login_time");
        window.location.href = "/";
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const loadData = () => {
    // Load Students
    const defaultStudents: Student[] = [
      { id: 1, name: "Ahmad Fauzi", nickname: "Ahmad", photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", hobby: "Programming", dream: "Software Engineer", quote: "Kode adalah seni", jurusan: "RPL" },
      { id: 2, name: "Citra Dewi", nickname: "Citra", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", hobby: "Melukis", dream: "Illustrator", quote: "Warna-warni kehidupan", jurusan: "RPL" },
    ];
    
    // Load Gallery
    const defaultGallery: GalleryImage[] = [
      { id: 1, src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400", title: "Wisata Belajar", date: "15 Maret 2025" },
      { id: 2, src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400", title: "Juara Lomba", date: "10 Februari 2025" },
    ];
    
    // Load Timeline
    const defaultTimeline: TimelineEvent[] = [
      { id: 1, year: "2024", title: "Awal Masuk", description: "Momen pertama bertemu", icon: "🎓", date: "15 Juli 2024" },
      { id: 2, year: "2024", title: "Class Gathering", description: "Acara kumpul bersama", icon: "🤝", date: "20 Agustus 2024" },
    ];

    // Load Memories
    const defaultMemories: Memory[] = [
      { id: 1, name: "Admin Nexuz", message: "Selamat datang di Buku Kenangan Nexuz! Tuliskan pesan dan kesanmu di sini ya! 📝", date: new Date().toISOString().split("T")[0], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" },
    ];

    const savedStudents = localStorage.getItem("nexuz_students");
    const savedGallery = localStorage.getItem("nexuz_gallery");
    const savedTimeline = localStorage.getItem("nexuz_timeline");
    const savedMemories = localStorage.getItem("nexuz_memories");
    
    setStudents(savedStudents ? JSON.parse(savedStudents) : defaultStudents);
    setGallery(savedGallery ? JSON.parse(savedGallery) : defaultGallery);
    setTimeline(savedTimeline ? JSON.parse(savedTimeline) : defaultTimeline);
    setMemories(savedMemories ? JSON.parse(savedMemories) : defaultMemories);
  };

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("storage"));
  };

  // CRUD Siswa
  const addStudent = (student: Omit<Student, "id" | "jurusan">) => {
    const newStudent = { ...student, id: Date.now(), jurusan: "RPL" };
    const updated = [...students, newStudent];
    setStudents(updated);
    saveToLocalStorage("nexuz_students", updated);
  };

  const updateStudent = (id: number, updatedData: Partial<Student>) => {
    const updated = students.map(s => s.id === id ? { ...s, ...updatedData, jurusan: "RPL" } : s);
    setStudents(updated);
    saveToLocalStorage("nexuz_students", updated);
  };

  const deleteStudent = (id: number) => {
    if (confirm("Yakin ingin menghapus siswa ini?")) {
      const updated = students.filter(s => s.id !== id);
      setStudents(updated);
      saveToLocalStorage("nexuz_students", updated);
    }
  };

  // CRUD Gallery
  const addGallery = (item: Omit<GalleryImage, "id">) => {
    const newItem = { ...item, id: Date.now() };
    const updated = [...gallery, newItem];
    setGallery(updated);
    saveToLocalStorage("nexuz_gallery", updated);
  };

  const updateGallery = (id: number, updatedData: Partial<GalleryImage>) => {
    const updated = gallery.map(g => g.id === id ? { ...g, ...updatedData } : g);
    setGallery(updated);
    saveToLocalStorage("nexuz_gallery", updated);
  };

  const deleteGallery = (id: number) => {
    if (confirm("Yakin ingin menghapus foto ini?")) {
      const updated = gallery.filter(g => g.id !== id);
      setGallery(updated);
      saveToLocalStorage("nexuz_gallery", updated);
    }
  };

  // CRUD Timeline
  const addTimeline = (item: Omit<TimelineEvent, "id">) => {
    const newItem = { ...item, id: Date.now() };
    const updated = [...timeline, newItem];
    setTimeline(updated);
    saveToLocalStorage("nexuz_timeline", updated);
  };

  const updateTimeline = (id: number, updatedData: Partial<TimelineEvent>) => {
    const updated = timeline.map(t => t.id === id ? { ...t, ...updatedData } : t);
    setTimeline(updated);
    saveToLocalStorage("nexuz_timeline", updated);
  };

  const deleteTimeline = (id: number) => {
    if (confirm("Yakin ingin menghapus event ini?")) {
      const updated = timeline.filter(t => t.id !== id);
      setTimeline(updated);
      saveToLocalStorage("nexuz_timeline", updated);
    }
  };

  // CRUD Memories
  const deleteMemory = (id: number) => {
    if (confirm("Yakin ingin menghapus pesan ini?")) {
      const updated = memories.filter(m => m.id !== id);
      setMemories(updated);
      saveToLocalStorage("nexuz_memories", updated);
    }
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
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-6 py-4 sticky top-0 z-10 backdrop-blur">
        <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-xl font-bold text-white">Admin Panel Nexuz</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4 flex-wrap">
          <button
            onClick={() => setActiveTab("siswa")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "siswa" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Data Siswa ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("galeri")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "galeri" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <Image className="w-4 h-4" />
            Galeri Foto ({gallery.length})
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "timeline" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            Timeline ({timeline.length})
          </button>
          <button
            onClick={() => setActiveTab("kenangan")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "kenangan" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4" />
            Buku Kenangan ({memories.length})
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
            
            <div className="grid gap-4">
              {students.map((student) => (
                <div key={student.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold text-white">{student.name}</h3>
                      <p className="text-gray-400 text-sm">{student.nickname}</p>
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
            
            <div className="grid md:grid-cols-2 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <img src={item.src} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.date}</p>
                    </div>
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
                      onClick={() => deleteGallery(item.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {activeTab === "timeline" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-white">Manajemen Timeline</h2>
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
            
            <div className="grid gap-4">
              {timeline.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">{item.year} • {item.date}</p>
                    <p className="text-gray-400 text-sm mt-1">{item.description.substring(0, 100)}...</p>
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
          </div>
        )}

        {/* Buku Kenangan */}
        {activeTab === "kenangan" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-white">Manajemen Buku Kenangan</h2>
              <p className="text-gray-400 text-sm">Total pesan: {memories.length}</p>
            </div>
            
            {memories.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                Belum ada pesan kenangan.
              </div>
            ) : (
              <div className="grid gap-4">
                {memories.map((memory) => (
                  <div key={memory.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <img src={memory.avatar} alt={memory.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-white">{memory.name}</h3>
                          <span className="text-gray-500 text-xs">{memory.date}</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">{memory.message}</p>
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
      </div>

      {/* Modal Form */}
      {showModal && (
        <ModalForm
          type={modalType}
          data={editingItem}
          tab={activeTab}
          onClose={() => setShowModal(false)}
          onSave={(data: any) => {
            if (activeTab === "siswa") {
              if (modalType === "add") addStudent(data);
              else updateStudent(editingItem.id, data);
            } else if (activeTab === "galeri") {
              if (modalType === "add") addGallery(data);
              else updateGallery(editingItem.id, data);
            } else if (activeTab === "timeline") {
              if (modalType === "add") addTimeline(data);
              else updateTimeline(editingItem.id, data);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

// Modal Form Component (sama seperti sebelumnya)
function ModalForm({ type, data, tab, onClose, onSave }: any) {
  const [formData, setFormData] = useState(data || {});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, [fieldName]: reader.result });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const fields = {
    siswa: [
      { name: "name", label: "Nama Lengkap", type: "text", required: true },
      { name: "nickname", label: "Panggilan", type: "text", required: true },
      { name: "photo", label: "Foto Profil", type: "file", required: true },
      { name: "hobby", label: "Hobi", type: "text", required: true },
      { name: "dream", label: "Cita-cita", type: "text", required: true },
      { name: "quote", label: "Quote Pribadi", type: "textarea", required: true },
    ],
    galeri: [
      { name: "src", label: "Foto Galeri", type: "file", required: true },
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "date", label: "Tanggal", type: "text", required: true },
    ],
    timeline: [
      { name: "year", label: "Tahun", type: "text", required: true },
      { name: "title", label: "Judul Event", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea", required: true },
      { name: "icon", label: "Icon (emoji)", type: "text", required: true },
      { name: "date", label: "Tanggal", type: "text", required: true },
    ],
  };

  const currentFields = fields[tab as keyof typeof fields];

  if (!currentFields) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-2xl border border-white/20 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {type === "add" ? "Tambah" : "Edit"} {tab === "siswa" ? "Siswa" : tab === "galeri" ? "Galeri" : "Timeline"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {currentFields.map((field: any) => (
            <div key={field.name}>
              <label className="block text-gray-400 text-sm mb-1">{field.label}</label>
              
              {field.type === "file" ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, field.name)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white hover:bg-white/20 transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : (formData[field.name] ? "Ganti Foto" : "Pilih Foto")}
                  </button>
                  {formData[field.name] && !uploading && (
                    <div className="mt-2">
                      <img src={formData[field.name]} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-white/50"
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-white/50"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}