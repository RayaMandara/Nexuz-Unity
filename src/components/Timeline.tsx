"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/lib/supabase";
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
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    fetchTimeline();

    // Subscribe ke perubahan data timeline (realtime)
    const subscription = supabase
      .channel('timeline-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'timeline' }, 
        () => fetchTimeline()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTimeline = async () => {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching timeline:', error);
    } else {
      setTimelineEvents(data || []);
    }
    setLoading(false);
  };

  if (loading) {
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
        {/* Section Header */}
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
            {/* Garis Vertikal Timeline */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/20 transform -translate-x-1/2" />

            {/* Timeline Items */}
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
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 z-10">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-40" />
                </div>

                {/* Konten Kiri/Kanan */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm">
                    {/* Year Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <span className="text-3xl">{event.icon}</span>
                      {event.title}
                    </h3>

                    {/* Year */}
                    <p className="text-gray-400 text-sm mb-3">{event.year}</p>

                    {/* Description */}
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