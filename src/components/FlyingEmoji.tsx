"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface FlyingEmojiProps {
  emoji: string;
  x: number;
  y: number;
  onComplete: () => void;
}

const FlyingEmoji = ({ emoji, x, y, onComplete }: FlyingEmojiProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const randomRotation = (Math.random() - 0.5) * 30;
  const randomX = (Math.random() - 0.5) * 300;
  const randomY = -200 - Math.random() * 300;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 1, 
            scale: 0.3,
            x: 0, 
            y: 0,
            rotate: 0
          }}
          animate={{
            opacity: 0,
            scale: 2,
            y: randomY,
            x: randomX,
            rotate: randomRotation,
          }}
          transition={{ 
            duration: 2.5, 
            ease: "easeOut",
            scale: { duration: 1.5 }
          }}
          className="fixed pointer-events-none z-[200] text-5xl md:text-7xl select-none"
          style={{ 
            left: x, 
            top: y,
            textShadow: "0 0 40px rgba(255,255,255,0.2)"
          }}
        >
          {emoji}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlyingEmoji;