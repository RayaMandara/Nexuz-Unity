"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Tipe data langsung di dalam file (tidak import dari data/gallery)
interface GalleryImage {
  id: number;
  src: string;
  title: string;
  date: string;
}

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) => {
  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 z-50"
          />

          {/* Lightbox Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Prev Button */}
            <button
              onClick={onPrev}
              className="absolute left-4 z-10 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Next Button */}
            <button
              onClick={onNext}
              className="absolute right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
              disabled={currentIndex === images.length - 1}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Image */}
            <div className="max-w-5xl max-h-[90vh]">
              <img
                src={currentImage.src}
                alt={currentImage.title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              
              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-center">
                  <h3 className="text-white text-xl font-semibold mb-1">
                    {currentImage.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{currentImage.date}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {currentIndex + 1} / {images.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;