"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Move, Check } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  initialX: number;
  initialY: number;
  onClose: () => void;
  onSave: (x: number, y: number) => void;
}

const ImageCropModal = ({ isOpen, imageSrc, initialX, initialY, onClose, onSave }: ImageCropModalProps) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const containerSize = 400;
    const deltaPercentX = (deltaX / containerSize) * 100;
    const deltaPercentY = (deltaY / containerSize) * 100;
    
    let newX = position.x + deltaPercentX;
    let newY = position.y + deltaPercentY;
    
    newX = Math.min(100, Math.max(0, newX));
    newY = Math.min(100, Math.max(0, newY));
    
    setPosition({ x: newX, y: newY });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    // Bulatkan ke integer sebelum disimpan
    onSave(Math.round(position.x), Math.round(position.y));
    onClose();
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPosition({ x: initialX, y: initialY });
    }
  }, [isOpen, initialX, initialY]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-2xl w-full border border-white/20 shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h3 className="text-white font-semibold">Atur Posisi Foto</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex justify-center">
                <div 
                  ref={containerRef}
                  className="relative w-[400px] h-[400px] rounded-full overflow-hidden border-2 border-white/30 cursor-move bg-black/20"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                  <img
                    src={imageSrc}
                    alt="Drag to adjust"
                    className="w-full h-full object-cover pointer-events-none"
                    style={{
                      objectPosition: `${position.x}% ${position.y}%`
                    }}
                    draggable={false}
                  />
                  
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/20" />
                    <div className="absolute top-0 bottom-0 left-2/3 w-px bg-white/20" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/40" />
                    <div className="absolute left-0 right-0 top-1/3 h-px bg-white/20" />
                    <div className="absolute left-0 right-0 top-2/3 h-px bg-white/20" />
                    <div className="absolute left-0 right-0 top-1/2 h-px bg-white/40" />
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60" />
                    <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/30" />
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
                  </div>
                  
                  {!isDragging && (
                    <div className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1.5 pointer-events-none">
                      <Move className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Posisi Horizontal: {Math.round(position.x)}%</span>
                  <span>Posisi Vertikal: {Math.round(position.y)}%</span>
                </div>
              </div>

              <div className="px-6 pb-4">
                <p className="text-center text-xs text-gray-500">
                  💡 Klik dan drag gambar untuk mengatur posisi wajah di tengah lingkaran
                </p>
              </div>

              <div className="flex gap-3 p-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Simpan Posisi
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageCropModal;