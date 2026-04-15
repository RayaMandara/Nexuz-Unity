"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  X,
  Minimize2,
  Shuffle,
  Repeat,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

let globalExpandMusic: (() => void) | null = null;

export const expandMusicPlayer = () => {
  if (globalExpandMusic) {
    globalExpandMusic();
  }
};

const MusicPlayer = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load songs dari Supabase
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error loading songs:', error);
    } else if (data && data.length > 0) {
      setSongs(data);
      setCurrentSongIndex(0);
    }
    setLoading(false);
  };

  // Register global expand function
  useEffect(() => {
    globalExpandMusic = () => setIsMinimized(false);
    return () => {
      globalExpandMusic = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto play next song when current ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentSongIndex, isRepeat, isShuffle, songs]);

  const playNext = () => {
    if (songs.length === 0) return;

    let nextIndex;
    if (isRepeat) {
      nextIndex = currentSongIndex;
    } else if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }
    
    setCurrentSongIndex(nextIndex);
  };

  const playPrevious = () => {
    if (songs.length === 0) return;
    
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * songs.length);
    } else {
      prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    
    setCurrentSongIndex(prevIndex);
  };

  const togglePlay = () => {
    if (songs.length === 0) return;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.muted = false;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentSong = songs[currentSongIndex];

  if (loading) {
    return (
      <div className="fixed bottom-6 left-6 z-50 w-80 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-4">
        <p className="text-gray-400 text-sm text-center">Loading playlist...</p>
      </div>
    );
  }

  if (songs.length === 0) {
    return null;
  }

  return (
    <>
      <audio
        key={currentSong?.url}
        ref={audioRef}
        src={currentSong?.url}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Icon Minimized */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, delay: 0.3 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 left-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group"
          >
            <Music className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Music Player Panel */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ x: -100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-6 left-6 z-50 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-4 w-80"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-semibold truncate">
                    {currentSong?.title || "Nexuz Radio"}
                  </h4>
                  <p className="text-gray-400 text-xs truncate">
                    {currentSong?.artist || "Classroom Beats"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`transition-colors ${isShuffle ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-black" />
                ) : (
                  <Play className="w-5 h-5 text-black ml-0.5" />
                )}
              </button>
              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`transition-colors ${isRepeat ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>

            {/* Playlist Info */}
            <div className="mt-2 pt-2 border-t border-white/10 text-center">
              <p className="text-gray-500 text-xs">
                {songs.length} lagu • {isShuffle ? "Shuffle ON" : isRepeat ? "Repeat ON" : "Normal"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;