"use client";

import { motion } from "framer-motion";

export const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
          <div className="h-64 bg-white/10 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-5 bg-white/10 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
            <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProjectSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
          <div className="h-40 bg-white/10 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-5 bg-white/10 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-white/10 rounded animate-pulse w-full" />
            <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10">
      <div className="h-48 bg-white/10 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-white/10 rounded animate-pulse w-2/3" />
        <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
      </div>
    </div>
  );
};