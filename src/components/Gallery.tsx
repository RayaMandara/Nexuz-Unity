"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Lightbox from "./Lightbox";
import { Image as ImageIcon, Calendar } from "lucide-react";

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  description: string;
  year: string;
}

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [groupedImages, setGroupedImages] = useState<Record<string, GalleryImage[]>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, src, title, description, year")
        .order("year", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching gallery:", error);
        setGalleryImages([]);
      } else {
        const images = data || [];
        setGalleryImages(images);

        const grouped: Record<string, GalleryImage[]> = {};
        images.forEach((img) => {
          if (!grouped[img.year]) {
            grouped[img.year] = [];
          }
          grouped[img.year].push(img);
        });
        setGroupedImages(grouped);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Urutan tahun dari kecil ke besar (2024 → 2027)
  const availableYears = Object.keys(groupedImages).sort();

  const getDisplayImages = () => {
    if (selectedYear === "all") {
      return galleryImages;
    }
    return groupedImages[selectedYear] || [];
  };

  const displayImages = getDisplayImages();

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    if (currentImageIndex < displayImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) {
    return (
      <section id="galeri" className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="text-gray-400">Loading galeri...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="galeri" className="py-24 px-6 bg-black">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Galeri Foto
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Momen-momen berharga yang telah kita lalui bersama
          </p>
        </motion.div>

        {availableYears.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setSelectedYear("all")}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedYear === "all"
                  ? "bg-white text-black"
                  : "bg-white/10 text-gray-400 hover:bg-white/20"
              }`}
            >
              Semua
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedYear === year
                    ? "bg-white text-black"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {displayImages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {selectedYear === "all"
              ? "Belum ada foto. Silakan tambah foto di admin panel."
              : `Belum ada foto untuk tahun ${selectedYear}.`}
          </div>
        ) : selectedYear === "all" ? (
          <div className="space-y-12">
            {availableYears.map((year) => (
              <div key={year}>
                <h3 className="text-2xl font-semibold text-white mb-6 text-center border-b border-white/10 pb-3 inline-block w-full flex items-center justify-center gap-2">
                  <Calendar className="w-6 h-6" />
                  {year}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedImages[year].map((image, idx) => (
                    <GalleryCard
                      key={image.id}
                      image={image}
                      onClick={() => {
                        const globalIndex = displayImages.findIndex(
                          (i) => i.id === image.id,
                        );
                        handleImageClick(globalIndex);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayImages.map((image, index) => (
              <GalleryCard
                key={image.id}
                image={image}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        )}

        <Lightbox
          images={displayImages}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </section>
  );
};

const GalleryCard = ({
  image,
  onClick,
}: {
  image: GalleryImage;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false, margin: "-100px" }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-2 text-white text-sm">
              <Calendar className="w-4 h-4" />
              <span>{image.year}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold">{image.title}</h3>
          {image.description && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
              {image.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <ImageIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Klik untuk lihat</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Gallery;