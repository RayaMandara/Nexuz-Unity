"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Code, Calendar, CheckCircle, Clock } from "lucide-react";

interface Project {
  id: number;
  name: string;
  image_url: string;
  tech_stack: string;
  description: string;
  project_link: string;
  year: string;
  status: string;
}

const ProjectsGallery = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } else {
        setProjects(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Selesai</span>;
      case 'Dalam Pengembangan':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> WIP</span>;
      default:
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">{status}</span>;
    }
  };

  const filteredProjects = filter === "Semua" 
    ? projects 
    : projects.filter(p => p.status === filter);

  if (loading) {
    return (
      <section id="projek" className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="text-gray-400">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projek" className="py-24 px-6 bg-black">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Projek Kami
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Projek yang telah kami buat
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["Semua", "Selesai", "Dalam Pengembangan"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === item
                  ? "bg-white text-black"
                  : "bg-white/10 text-gray-400 hover:bg-white/20"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Belum ada projek. Silakan tambah di admin panel.
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Tidak ada projek dengan status "{filter}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: false, margin: "-100px" }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                {/* Gambar Sampul */}
                <div className="relative h-48 overflow-hidden bg-black/50">
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {project.year}
                  </p>
                  
                  <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    {project.tech_stack}
                  </p>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {project.project_link && (
                    <a
                      href={project.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Lihat Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsGallery;