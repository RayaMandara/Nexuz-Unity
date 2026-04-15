"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Users, Image, Clock, LogOut, Plus, Edit, Trash2, X, Upload, Heart, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Data state
  const [students, setStudents] = useState<Student[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<"add" | "edit">("add");

  // Cek autentikasi
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem("nexuz_admin_auth");
      const savedTime = localStorage.getItem("nexuz_admin_login_time");
      
      const isValid = savedAuth === "true" && 
                      savedTime && 
                      (Date.now() - parseInt(savedTime) < 86400000);
      
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
      loadMemories()
    ]);
    setIsRefreshing(false);
  };

  const loadStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error loading students:', error);
    } else {
      setStudents(data || []);
    }
  };

  const loadGallery = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error loading gallery:', error);
    } else {
      setGallery(data || []);
    }
  };

  const loadTimeline = async () => {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error loading timeline:', error);
    } else {
      setTimeline(data || []);
    }
  };

  const loadMemories = async () => {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Error loading memories:', error);
    } else {
      setMemories(data || []);
    }
  };

  // CRUD Siswa
  const addStudent = async (student: Omit<Student, "id">) => {
    const newStudent = { ...student, id: Date.now(), jurusan: "RPL" };
    const { error } = await supabase.from('students').insert([newStudent]);
    
    if (error) {
      alert('Gagal menambah siswa: ' + error.message);
      return false;
    }
    await loadStudents();
    return true;
  };

  const updateStudent = async (id: number, updatedData: Partial<Student>) => {
    const { error } = await supabase
      .from('students')
      .update({ ...updatedData, jurusan: "RPL" })
      .eq('id', id);
    
    if (error) {
      alert('Gagal update siswa: ' + error.message);
      return false;
    }
    await loadStudents();
    return true;
  };

  const deleteStudent = async (id: number) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return false;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
      alert('Gagal hapus siswa: ' + error.message);
      return false;
    }
    await loadStudents();
    return true;
  };

  // CRUD Gallery
  const addGallery = async (item: Omit<GalleryImage, "id">) => {
    const newItem = { ...item, id: Date.now() };
    const { error } = await supabase.from('gallery').insert([newItem]);
    
    if (error) {
      alert('Gagal menambah foto: ' + error.message);
      return false;
    }
    await loadGallery();
    return true;
  };

  const updateGallery = async (id: number, updatedData: Partial<GalleryImage>) => {
    const { error } = await supabase.from('gallery').update(updatedData).eq('id', id);
    if (error) {
      alert('Gagal update foto: ' + error.message);
      return false;
    }
    await loadGallery();
    return true;
  };

  const deleteGallery = async (id: number) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return false;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      alert('Gagal hapus foto: ' + error.message);
      return false;
    }
    await loadGallery();
    return true;
  };

  // CRUD Timeline
  const addTimeline = async (item: Omit<TimelineEvent, "id">) => {
    const newItem = { ...item, id: Date.now() };
    const { error } = await supabase.from('timeline').insert([newItem]);
    
    if (error) {
      alert('Gagal menambah event: ' + error.message);
      return false;
    }
    await loadTimeline();
    return true;
  };

  const updateTimeline = async (id: number, updatedData: Partial<TimelineEvent>) => {
    const { error } = await supabase.from('timeline').update(updatedData).eq('id', id);
    if (error) {
      alert('Gagal update event: ' + error.message);
      return false;
    }
    await loadTimeline();
    return true;
  };

  const deleteTimeline = async (id: number) => {
    if (!confirm("Yakin ingin menghapus event ini?")) return false;
    const { error } = await supabase.from('timeline').delete().eq('id', id);
    if (error) {
      alert('Gagal hapus event: ' + error.message);
      return false;
    }
    await loadTimeline();
    return true;
  };

  // CRUD Memories
  const deleteMemory = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return false;
    const { error } = await supabase.from('memories').delete().eq('id', id);
    if (error) {
      alert('Gagal hapus pesan: ' + error.message);
      return false;
    }
    await loadMemories();
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
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-6 py-4 sticky top-0 z-10 backdrop-blur">
        <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-xl font-bold text-white">Admin Panel Nexuz</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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

        {/* Loading Overlay saat refresh */}
        {isRefreshing && (
          <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center">
            <div className="bg-black/90 rounded-xl p-4 flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-white animate-spin" />
              <span className="text-white">Memuat data...</span>
            </div>
          </div>
        )}

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
              <div className="text-center py-12 text-gray-400">Belum ada data siswa</div>
            ) : (
              <div className="grid gap-3">
                {students.map((student) => (
                  <div key={student.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4 hover:bg-white/10 transition">
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
              <div className="text-center py-12 text-gray-400">Belum ada foto galeri</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col gap-3 hover:bg-white/10 transition">
                    <img src={item.src} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-white">{item.title}</h3>
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
            
            {timeline.length === 0 ? (
              <div className="text-center py-12 text-gray-400">Belum ada event timeline</div>
            ) : (
              <div className="grid gap-3">
                {timeline.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4 hover:bg-white/10 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <h3 className="font-semibold text-white">{item.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm">{item.year} • {item.date}</p>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
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
              <h2 className="text-xl font-bold text-white">Manajemen Buku Kenangan</h2>
            </div>
            
            {memories.length === 0 ? (
              <div className="text-center py-12 text-gray-400">Belum ada pesan kenangan</div>
            ) : (
              <div className="grid gap-3">
                {memories.map((memory) => (
                  <div key={memory.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center flex-wrap gap-4 hover:bg-white/10 transition">
                    <div className="flex items-center gap-4 flex-1">
                      <img src={memory.avatar} alt={memory.name} className="w-10 h-10 rounded-full object-cover" />
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
  const [formData, setFormData] = useState(data || {});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress dan konversi ke base64
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, [fieldName]: reader.result });
      setUploading(false);
    };
    reader.readAsDataURL(file);
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
      { name: "photo", label: "Foto Profil", type: "file", required: type === "add" },
      { name: "hobby", label: "Hobi", type: "text", required: true },
      { name: "dream", label: "Cita-cita", type: "text", required: true },
      { name: "quote", label: "Quote Pribadi", type: "textarea", required: true },
    ],
    galeri: [
      { name: "src", label: "Foto Galeri", type: "file", required: type === "add" },
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

  const currentFields = fields[tab];

  if (!currentFields) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-2xl border border-white/20 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-black">
          <h3 className="text-xl font-bold text-white">
            {type === "add" ? "Tambah" : "Edit"} {tab === "siswa" ? "Siswa" : tab === "galeri" ? "Galeri" : "Timeline"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-white/50"
                  required={field.required}
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
      </div>
    </div>
  );
}