"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Code, Calendar, CheckCircle, Clock } from "lucide-react";
import { ProjectSkeleton } from "@/components/Skeleton";
import { useLanguage } from "../context/LanguageContext";

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
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
    // Map status database ke label translasi
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      'Selesai': { 
        label: t("projects_status_done"), 
        color: "bg-green-500/20 text-green-400", 
        icon: CheckCircle 
      },
      'Dalam Pengembangan': { 
        label: t("projects_status_wip"), 
        color: "bg-yellow-500/20 text-yellow-400", 
        icon: Clock 
      }
    };

    const matched = statusMap[status];
    if (matched) {
      const Icon = matched.icon;
      return (
        <span className={`${matched.color} px-2 py-0.5 rounded-full text-xs flex items-center gap-1`}>
          <Icon className="w-3 h-3" />
          {matched.label}
        </span>
      );
    }
    
    return (
      <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">
        {status}
      </span>
    );
  };

  // Filter options dengan value yang sesuai dengan status di database
  const filterOptions = [
    { key: "all", label: t("projects_filter_all") },
    { key: "Selesai", label: t("projects_filter_done") },
    { key: "Dalam Pengembangan", label: t("projects_filter_wip") }
  ];

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.status === filter);

  if (loading) {
    return (
      <section id="projects" className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              {t("projects_title")}
            </h2>
            <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          </div>
          <ProjectSkeleton />
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
            {t("projects_title")}
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t("projects_subtitle")}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === option.key
                  ? "bg-white text-black"
                  : "bg-white/10 text-gray-400 hover:bg-white/20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {t("projects_no_data")}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {t("projects_empty_filter").replace("{filter}", 
              filterOptions.find(f => f.key === filter)?.label || filter
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 notranslate">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: false, margin: "-100px" }}
                // whileHover={{ y: -5 }}
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
                    <span>{project.year}</span>
                  </p>
                  
                  <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    <span>{project.tech_stack}</span>
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
                      {t("projects_view")}
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