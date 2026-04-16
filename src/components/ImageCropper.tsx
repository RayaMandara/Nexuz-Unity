"use client";

import { useState, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCw, Check } from "lucide-react";

interface ImageCropperProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
}

const ImageCropper = ({ isOpen, imageSrc, onClose, onCropComplete }: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation: number) => {
    setRotation(rotation);
  };

  const onCropCompleteHandler = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      setIsProcessing(true);
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx || !croppedAreaPixels) return;

      const { width, height, x, y } = croppedAreaPixels;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(
        image,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height
      );

      const croppedImage = canvas.toDataURL("image/jpeg", 0.9);
      onCropComplete(croppedImage);
      setIsProcessing(false);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
      setIsProcessing(false);
    }
  };

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
                <h3 className="text-white font-semibold">Crop Foto Profil</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-96 bg-black/50">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onRotationChange={onRotationChange}
                  onCropComplete={onCropCompleteHandler}
                  cropShape="round"
                  showGrid={true}
                  style={{
                    containerStyle: { position: "relative", width: "100%", height: "100%" },
                  }}
                />
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
                    >
                      <ZoomOut className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-white text-sm">{Math.round(zoom * 100)}%</span>
                    <button
                      onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
                    >
                      <ZoomIn className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <button
                    onClick={() => setRotation(rotation + 90)}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
                  >
                    <RotateCw className="w-4 h-4 text-white" />
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 mb-3">
                  💡 Drag untuk mengatur posisi • Zoom untuk memperbesar • Putar untuk rotasi
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={getCroppedImg}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      "Memproses..."
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Simpan Crop
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageCropper;