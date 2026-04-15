"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar } from "lucide-react";

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: string;
  date: string;
}

const Timeline = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Load data dari localStorage
  useEffect(() => {
    const loadTimeline = () => {
      const savedTimeline = localStorage.getItem("nexuz_timeline");
      if (savedTimeline) {
        setTimelineEvents(JSON.parse(savedTimeline));
      } else {
        // Default data jika belum ada
        const defaultTimeline: TimelineEvent[] = [
          { id: 1, year: "2024", title: "Awal Masuk Sekolah", description: "Momen pertama kali kita bertemu dan berkenalan di kelas.", icon: "🎓", date: "15 Juli 2024" },
          { id: 2, year: "2024", title: "Class Gathering", description: "Acara kumpul bersama pertama di luar sekolah.", icon: "🤝", date: "20 Agustus 2024" },
          { id: 3, year: "2024", title: "Juara Lomba Sekolah", description: "Tim dari kelas kita berhasil meraih juara 1 lomba debat.", icon: "🏆", date: "10 Oktober 2024" },
        ];
        setTimelineEvents(defaultTimeline);
        localStorage.setItem("nexuz_timeline", JSON.stringify(defaultTimeline));
      }
      setIsLoading(false);
    };

    loadTimeline();

    // Listen untuk perubahan dari admin panel
    const handleStorageChange = () => {
      loadTimeline();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <section id="timeline" className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="text-gray-400">Loading timeline...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="timeline" className="py-24 px-6 bg-black">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Perjalanan Kelas
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Setiap langkah adalah cerita. Setiap momen adalah kenangan.
          </p>
        </motion.div>

        {timelineEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Belum ada event timeline. Silakan tambah event di admin panel.
          </div>
        ) : (
          <div ref={ref} className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/20 transform -translate-x-1/2" />

            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`relative flex flex-col md:flex-row gap-6 mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 z-10">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-40" />
                </div>

                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm">
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <span className="text-3xl">{event.icon}</span>
                      {event.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-3">{event.year}</p>

                    <p className="text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Timeline;