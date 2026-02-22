import { useState } from "react";
import { motion } from "framer-motion";
import { Hand, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import QuizScreen from "@/components/QuizScreen";

const Index = () => {
  const [started, setStarted] = useState(false);

  if (started) {
    return <QuizScreen />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary mb-8"
        >
          <Hand className="w-12 h-12 text-primary-foreground" />
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
          Quiz Interaktif
        </h1>
        <p className="text-xl text-muted-foreground font-body mb-8 leading-relaxed">
          Jawab pertanyaan dengan{" "}
          <span className="text-primary font-semibold">gerakan tangan</span>{" "}
          kamu! Arahkan jari telunjuk ke jawaban yang benar.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: <Hand className="w-6 h-6" />,
              title: "Deteksi Tangan",
              desc: "Gunakan kamera untuk menjawab",
            },
            {
              icon: <BookOpen className="w-6 h-6" />,
              title: "5 Soal",
              desc: "Pengetahuan umum seru",
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Interaktif",
              desc: "Pengalaman belajar baru",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="text-primary mb-2">{item.icon}</div>
              <h3 className="font-display font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-display font-bold text-xl hover:opacity-90 transition-opacity animate-pulse-glow"
        >
          Mulai Quiz
          <ArrowRight className="w-6 h-6" />
        </motion.button>

        <p className="text-sm text-muted-foreground mt-6 font-body">
          ⚡ Pastikan kamera kamu aktif untuk pengalaman terbaik
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
