import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, Trophy, RotateCcw, Hand, AlertCircle } from "lucide-react";
import { questions, Question } from "@/data/questions";
import { useHandDetection, HandPosition } from "@/hooks/useHandDetection";
import OptionCard from "./OptionCard";
import HandCursor from "./HandCursor";

type OptionState = "default" | "correct" | "wrong";

const HOVER_THRESHOLD = 1.5; // seconds to confirm selection

const QuizScreen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { handPosition, isLoading, error } = useHandDetection(videoRef);

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [optionStates, setOptionStates] = useState<OptionState[]>(["default", "default", "default", "default"]);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [hoverTimer, setHoverTimer] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const timerRef = useRef<number | null>(null);

  const question = questions[currentQ];

  // Detect which option the hand is hovering over
  const getHoveredOption = useCallback(
    (pos: HandPosition): number | null => {
      if (!pos.visible || !containerRef.current) return null;

      // The hand position is relative to the video (mirrored)
      // Map x: 0-1 to the quiz area. We split into a 2x2 grid for 4 options
      const mirroredX = 1 - pos.x; // Mirror since webcam is mirrored
      const y = pos.y;

      // Options are in a 2-column grid
      // Top-left: 0, Top-right: 1, Bottom-left: 2, Bottom-right: 3
      if (y < 0.15 || y > 0.95) return null;
      if (mirroredX < 0.05 || mirroredX > 0.95) return null;

      const col = mirroredX < 0.5 ? 0 : 1;
      const row = y < 0.5 ? 0 : 1;
      return row * 2 + col;
    },
    []
  );

  // Handle hover detection and timer
  useEffect(() => {
    if (answered) return;

    const option = getHoveredOption(handPosition);
    setHoveredOption(option);

    if (option !== null) {
      if (timerRef.current === null) {
        const startTime = Date.now();
        const interval = window.setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000;
          setHoverTimer(elapsed);
          if (elapsed >= HOVER_THRESHOLD) {
            clearInterval(interval);
            timerRef.current = null;
            handleAnswer(option);
          }
        }, 50);
        timerRef.current = interval;
      }
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setHoverTimer(0);
      }
    }

    return () => {
      // Don't clear on every render, only when answered changes
    };
  }, [handPosition, answered, getHoveredOption]);

  // Clean up timer on answer
  useEffect(() => {
    if (answered && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [answered]);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setAnswered(true);
    setHoverTimer(0);

    const isCorrect = index === question.correctIndex;
    const newStates: OptionState[] = question.options.map((_, i) => {
      if (i === question.correctIndex) return "correct";
      if (i === index && !isCorrect) return "wrong";
      return "default";
    });

    setOptionStates(newStates);
    if (isCorrect) setScore((s) => s + 1);

    setShowExplanation(true);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
        setOptionStates(["default", "default", "default", "default"]);
        setAnswered(false);
        setShowExplanation(false);
        setHoveredOption(null);
      } else {
        setShowResult(true);
      }
    }, 3000);
  };

  const restart = () => {
    setCurrentQ(0);
    setScore(0);
    setOptionStates(["default", "default", "default", "default"]);
    setAnswered(false);
    setShowResult(false);
    setShowExplanation(false);
    setHoveredOption(null);
    setHoverTimer(0);
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
    <div className="min-h-screen p-4 md:p-8 flex flex-col" ref={containerRef}>
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

          {/* Hand cursor overlay */}
          <HandCursor
            x={1 - handPosition.x}
            y={handPosition.y}
            visible={handPosition.visible}
            isHovering={hoveredOption !== null}
          />

          {/* Hover progress indicator */}
          {hoveredOption !== null && !answered && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card rounded-full px-6 py-2">
              <div className="flex items-center gap-3">
                <div className="w-32 bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(hoverTimer / HOVER_THRESHOLD) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-body text-muted-foreground">
                  Memilih...
                </span>
              </div>
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
              {handPosition.visible ? "Tangan Terdeteksi ✓" : "Arahkan Tangan"}
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

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-2xl p-4"
              >
                <p className="text-sm font-body text-muted-foreground">
                  💡 {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-body">
              👆 Arahkan jari telunjuk ke jawaban dan tahan {HOVER_THRESHOLD} detik untuk memilih, atau klik langsung
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
