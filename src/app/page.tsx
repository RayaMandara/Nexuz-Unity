"use client";

import Hero from "@/components/Hero";
import FloatingMenu from "@/components/FloatingMenu";
import ClassProfile from "@/components/ClassProfile";
import StudentList from "@/components/StudentList";
import Gallery from "@/components/Gallery";
import Timeline from "@/components/Timeline";
import MemoryBook from "@/components/MemoryBook";
import MusicPlayer from "@/components/MusicPlayer";
import MiniGame from "@/components/MiniGame";
import Footer from "@/components/Footer";
import ProjectsGallery from "@/components/ProjectsGallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <FloatingMenu />
      <Hero />
      <ClassProfile />
      <StudentList />
      <Gallery />
      <Timeline />
      <ProjectsGallery />
      <div id="music" className="relative py-16">
        <MusicPlayer />
      </div>
      <MiniGame />

      <MemoryBook />
      <Footer />
    </main>
  );
}
