import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, Trophy, RotateCcw, Hand, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { questions } from "@/data/questions";
import { useHandDetection } from "@/hooks/useHandDetection";
import OptionCard from "./OptionCard";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type OptionState = "default" | "correct" | "wrong";

const FINGER_LABELS = ["", "A", "B", "C", "D"]; // 1-4 fingers
const STABLE_FRAMES_NEEDED = 5; // Need consistent detection for stability

const QuizScreen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { detection, isLoading, error } = useHandDetection(videoRef);

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [optionStates, setOptionStates] = useState<OptionState[]>(["default", "default", "default", "default"]);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertCorrect, setAlertCorrect] = useState(false);

  const question = questions[Math.min(currentQ, questions.length - 1)];

  // Stable finger detection - require consistent readings
  const lastSelectedRef = useRef<number | null>(null);
  const stableCountRef = useRef(0);
  const stableFingerRef = useRef<number | null>(null);

  useEffect(() => {
    if (answered) return;

    if (detection.visible && detection.fingerCount >= 1 && detection.fingerCount <= 4) {
      const optionIndex = detection.fingerCount - 1;

      // Check if same finger count is stable
      if (stableFingerRef.current === optionIndex) {
        stableCountRef.current += 1;
      } else {
        stableFingerRef.current = optionIndex;
        stableCountRef.current = 1;
      }

      // Only show hover after some stability
      if (stableCountRef.current >= 2) {
        setHoveredOption(optionIndex);
      }

      // Only select after STABLE_FRAMES_NEEDED consistent frames
      if (stableCountRef.current >= STABLE_FRAMES_NEEDED && lastSelectedRef.current !== optionIndex) {
        lastSelectedRef.current = optionIndex;
        handleAnswer(optionIndex);
      }
    } else {
      setHoveredOption(null);
      lastSelectedRef.current = null;
      stableFingerRef.current = null;
      stableCountRef.current = 0;
    }
  }, [detection, answered]);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setAnswered(true);

    const isCorrect = index === question.correctIndex;
    const newStates: OptionState[] = question.options.map((_, i) => {
      if (i === question.correctIndex) return "correct";
      if (i === index && !isCorrect) return "wrong";
      return "default";
    });

    setOptionStates(newStates);
    if (isCorrect) setScore((s) => s + 1);
    setAlertCorrect(isCorrect);
    setShowAlert(true);
  };

  const handleNextQuestion = () => {
    setShowAlert(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setOptionStates(["default", "default", "default", "default"]);
      setAnswered(false);
      setHoveredOption(null);
      lastSelectedRef.current = null;
      stableFingerRef.current = null;
      stableCountRef.current = 0;
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setScore(0);
    setOptionStates(["default", "default", "default", "default"]);
    setAnswered(false);
    setShowResult(false);
    setShowAlert(false);
    setHoveredOption(null);
    lastSelectedRef.current = null;
    stableFingerRef.current = null;
    stableCountRef.current = 0;
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-screen gap-8 p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <Trophy className="w-24 h-24 text-accent" />
        </motion.div>
        <h1 className="text-5xl font-display font-bold text-foreground">
          Selesai! 🎉
        </h1>
        <div className="glass-card rounded-3xl p-8 text-center">
          <p className="text-2xl font-display text-foreground mb-2">Skor Kamu</p>
          <p className="text-6xl font-display font-bold text-primary">
            {score}/{questions.length}
          </p>
          <p className="text-muted-foreground mt-4 font-body">
            {score === questions.length
              ? "Sempurna! Kamu luar biasa! 🌟"
              : score >= questions.length / 2
              ? "Bagus! Terus belajar! 💪"
              : "Ayo coba lagi! 📚"}
          </p>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-display font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="w-5 h-5" />
          Main Lagi
        </button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Hand className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Quiz Interaktif
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-display text-lg text-muted-foreground">
            {currentQ + 1}/{questions.length}
          </span>
          <div className="glass-card rounded-xl px-4 py-2">
            <span className="font-display font-bold text-primary text-lg">
              Skor: {score}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <motion.div
          className="bg-primary h-2 rounded-full"
          animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Section */}
        <div className="relative rounded-3xl overflow-hidden glass-card">
          <video
            ref={videoRef}
            className="w-full h-full object-cover min-h-[300px]"
            autoPlay
            playsInline
            muted
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Finger count indicator */}
          {detection.visible && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card rounded-full px-6 py-3 flex items-center gap-2">
              {detection.fingerCount === 0 ? (
                <>
                  <Hand className="w-5 h-5 text-muted-foreground" />
                  <span className="font-display font-bold text-muted-foreground text-lg">
                    ✊ Tangan Kepal
                  </span>
                </>
              ) : detection.fingerCount >= 1 && detection.fingerCount <= 4 ? (
                <span className="font-display font-bold text-foreground text-lg">
                  {`${detection.fingerCount} Jari → ${FINGER_LABELS[detection.fingerCount] || ""}`}
                </span>
              ) : (
                <span className="font-display font-bold text-muted-foreground text-lg">
                  ✋ {detection.fingerCount} Jari (1-4 untuk jawab)
                </span>
              )}
            </div>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="font-display text-foreground">
                Memuat kamera & deteksi tangan...
              </p>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center gap-4 p-8">
              <AlertCircle className="w-10 h-10 text-destructive" />
              <p className="font-display text-foreground text-center">{error}</p>
              <p className="text-sm text-muted-foreground text-center font-body">
                Kamu tetap bisa klik jawaban secara manual
              </p>
            </div>
          )}

          {/* Camera icon */}
          <div className="absolute top-4 left-4 glass-card rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-xs font-body text-foreground">
              {detection.visible ? "Tangan Terdeteksi ✓" : "Tunjukkan Tangan"}
            </span>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="flex flex-col gap-4">
          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-3xl p-6"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                {question.question}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {question.options.map((option, idx) => (
              <OptionCard
                key={`${currentQ}-${idx}`}
                label={["A", "B", "C", "D"][idx]}
                text={option}
                index={idx}
                isHovered={hoveredOption === idx && !answered}
                state={optionStates[idx]}
                onSelect={() => handleAnswer(idx)}
              />
            ))}
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-body">
              ☝️ 1 jari = A &nbsp;|&nbsp; ✌️ 2 jari = B &nbsp;|&nbsp; 🤟 3 jari = C &nbsp;|&nbsp; 🖐️ 4 jari = D
            </p>
          </div>
        </div>
      </div>

      {/* Answer Alert Dialog */}
      <AlertDialog open={showAlert}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader className="items-center text-center">
            {alertCorrect ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <CheckCircle2 className="w-16 h-16 text-correct mx-auto mb-2" />
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <XCircle className="w-16 h-16 text-wrong mx-auto mb-2" />
              </motion.div>
            )}
            <AlertDialogTitle className="text-2xl font-display">
              {alertCorrect ? "Jawaban Benar! 🎉" : "Jawaban Salah 😢"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base font-body">
              {alertCorrect
                ? "Hebat! Kamu menjawab dengan benar!"
                : `Jawaban yang benar adalah: ${question.options[question.correctIndex]}`}
              <br />
              <span className="text-sm mt-2 block">💡 {question.explanation}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center">
            <AlertDialogAction
              onClick={handleNextQuestion}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-display font-semibold"
            >
              {currentQ < questions.length - 1 ? "Soal Berikutnya →" : "Lihat Hasil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuizScreen;
