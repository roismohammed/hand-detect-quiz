import { useEffect, useRef, useState, useCallback } from "react";
import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export interface HandDetectionResult {
  fingerCount: number; // 0-5
  visible: boolean;
}

// Finger tip and PIP landmark indices
const FINGER_TIPS = [8, 12, 16, 20]; // index, middle, ring, pinky
const FINGER_PIPS = [6, 10, 14, 18];

function countRaisedFingers(landmarks: { x: number; y: number; z: number }[]): number {
  let count = 0;

  // Thumb: compare tip x vs IP joint x (landmark 3)
  // For right hand: tip.x < ip.x means raised (mirrored camera)
  // Use absolute distance approach: if thumb tip is far from palm
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const wrist = landmarks[0];
  // Thumb is raised if tip is further from wrist than IP joint
  const thumbTipDist = Math.abs(thumbTip.x - wrist.x);
  const thumbIpDist = Math.abs(thumbIp.x - wrist.x);
  if (thumbTipDist > thumbIpDist) {
    count++;
  }

  // For index, middle, ring, pinky: tip y < pip y means raised (y goes down)
  for (let i = 0; i < FINGER_TIPS.length; i++) {
    if (landmarks[FINGER_TIPS[i]].y < landmarks[FINGER_PIPS[i]].y) {
      count++;
    }
  }
  return count;
}

export function useHandDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [detection, setDetection] = useState<HandDetectionResult>({
    fingerCount: 0,
    visible: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  const onResults = useCallback((results: Results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const fingerCount = countRaisedFingers(landmarks);
      setDetection({ fingerCount, visible: true });
    } else {
      setDetection((prev) => ({ ...prev, visible: false }));
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const initHands = async () => {
      try {
        const hands = new Hands({
          locateFile: (file) =>
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

        const camera = new Camera(videoRef.current!, {
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
        setIsLoading(false);
      } catch (err) {
        console.error("Hand detection error:", err);
        setError("Gagal memulai kamera. Pastikan kamera diizinkan.");
        setIsLoading(false);
      }
    };

    initHands();

    return () => {
      cameraRef.current?.stop();
      handsRef.current?.close();
    };
  }, [videoRef, onResults]);

  return { detection, isLoading, error };
}
