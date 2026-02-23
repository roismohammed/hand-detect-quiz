import { useState } from "react";
import { motion } from "framer-motion";
import { Hand, BookOpen, Sparkles, ArrowRight, Fingerprint, Zap, Monitor } from "lucide-react";
import QuizScreen from "@/components/QuizScreen";

const Index = () => {
  const [started, setStarted] = useState(false);

  if (started) {
    return <QuizScreen />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[15%] text-4xl opacity-20"
        >
          ☝️
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-32 right-[20%] text-4xl opacity-20"
        >
          ✌️
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-28 left-[25%] text-4xl opacity-20"
        >
          🤟
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-40 right-[15%] text-4xl opacity-20"
        >
          🖐️
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl relative z-10"
      >
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
          className="inline-flex items-center justify-center w-28 h-28 rounded-[2rem] bg-primary mb-8 shadow-2xl relative"
        >
          <Hand className="w-14 h-14 text-primary-foreground" />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-[2rem] border-2 border-primary"
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-6"
        >
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm font-body font-medium text-muted-foreground">
            Pengalaman Belajar Interaktif
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-5 leading-tight">
          Quiz dengan{" "}
          <span className="text-primary relative">
            Gerakan Tangan
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-1 left-0 h-2 bg-primary/20 rounded-full -z-10"
            />
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-body mb-10 leading-relaxed max-w-xl mx-auto">
          Jawab pertanyaan cukup dengan menunjukkan jumlah jari ke kamera.
          Angkat <span className="text-primary font-semibold">1-4 jari</span> untuk memilih jawaban A-D!
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: <Fingerprint className="w-7 h-7" />,
              title: "Deteksi Tangan AI",
              desc: "MediaPipe mengenali gerakan tangan secara real-time",
              delay: 0.4,
            },
            {
              icon: <BookOpen className="w-7 h-7" />,
              title: "5 Soal Seru",
              desc: "Pengetahuan umum yang menarik dan edukatif",
              delay: 0.5,
            },
            {
              icon: <Monitor className="w-7 h-7" />,
              title: "Tanpa Sentuh",
              desc: "Cukup tunjukkan jari, tidak perlu klik!",
              delay: 0.6,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                {item.icon}
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl p-5 mb-10 max-w-lg mx-auto"
        >
          <p className="text-sm font-display font-semibold text-foreground mb-3">Cara Menjawab:</p>
          <div className="flex items-center justify-center gap-6 text-center">
            {[
              { emoji: "☝️", label: "1 Jari = A" },
              { emoji: "✌️", label: "2 Jari = B" },
              { emoji: "🤟", label: "3 Jari = C" },
              { emoji: "🖐️", label: "4 Jari = D" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-body text-muted-foreground font-medium">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-12 py-5 rounded-2xl font-display font-bold text-xl hover:opacity-90 transition-opacity animate-pulse-glow shadow-2xl"
        >
          Mulai Quiz
          <ArrowRight className="w-6 h-6" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-sm text-muted-foreground mt-6 font-body flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          Pastikan kamera kamu aktif untuk pengalaman terbaik
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Index;
