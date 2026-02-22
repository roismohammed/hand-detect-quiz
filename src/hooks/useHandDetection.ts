import { useEffect, useRef, useState, useCallback } from "react";
import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export interface HandPosition {
  x: number;
  y: number;
  visible: boolean;
}

export function useHandDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [handPosition, setHandPosition] = useState<HandPosition>({
    x: 0,
    y: 0,
    visible: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  const onResults = useCallback((results: Results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Use index finger tip (landmark 8)
      const indexFingerTip = results.multiHandLandmarks[0][8];
      setHandPosition({
        x: indexFingerTip.x,
        y: indexFingerTip.y,
        visible: true,
      });
    } else {
      setHandPosition((prev) => ({ ...prev, visible: false }));
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
          modelComplexity: 0,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.5,
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

  return { handPosition, isLoading, error };
}
