import { useEffect, useRef, useState, useCallback } from "react";

export interface HandDetectionResult {
  fingerCount: number;
  visible: boolean;
}

const FINGER_TIPS = [8, 12, 16, 20];
const FINGER_PIPS = [6, 10, 14, 18];

function countRaisedFingers(landmarks: { x: number; y: number; z: number }[]): number {
  let count = 0;
  for (let i = 0; i < FINGER_TIPS.length; i++) {
    if (landmarks[FINGER_TIPS[i]].y < landmarks[FINGER_PIPS[i]].y) {
      count++;
    }
  }
  return count;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export function useHandDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [detection, setDetection] = useState<HandDetectionResult>({
    fingerCount: 0,
    visible: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const mountedRef = useRef(true);

  const onResults = useCallback((results: any) => {
    if (!mountedRef.current) return;
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const fingerCount = countRaisedFingers(landmarks);
      setDetection({ fingerCount, visible: true });
    } else {
      setDetection((prev) => ({ ...prev, visible: false }));
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (!videoRef.current) return;

    const initHands = async () => {
      try {
        // Load MediaPipe scripts from CDN
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

        const win = window as any;
        if (!win.Hands || !win.Camera) {
          throw new Error("MediaPipe failed to load");
        }

        const hands = new win.Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.8,
          minTrackingConfidence: 0.7,
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        const camera = new win.Camera(videoRef.current!, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        cameraRef.current = camera;
        await camera.start();
        if (mountedRef.current) setIsLoading(false);
      } catch (err) {
        console.error("Hand detection error:", err);
        if (mountedRef.current) {
          setError("Gagal memulai kamera. Pastikan kamera diizinkan.");
          setIsLoading(false);
        }
      }
    };

    initHands();

    return () => {
      mountedRef.current = false;
      cameraRef.current?.stop();
      handsRef.current?.close();
    };
  }, [videoRef, onResults]);

  return { detection, isLoading, error };
}
