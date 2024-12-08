import { useRef, useState, useCallback, useEffect } from 'react';
import type { DataSeries } from '../services/api';
import { ANIMATION_STYLES, type ChartType } from '../constants/animationStyles';

interface UseRecordingOptions {
  targetRef: React.RefObject<HTMLDivElement>;
  dataSeries: DataSeries[];
  onComplete: (url: string | null) => void;
}

const FRAME_RATE = 60;
const FRAME_INTERVAL = 1000 / FRAME_RATE;
const POINTS_DURATION = 2000; // 2 seconds per data point
const BUFFER_DURATION = 1000;

export const useRecording = ({ targetRef, dataSeries, onComplete }: UseRecordingOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef(0);
  const durationRef = useRef(0);
  const frameIntervalRef = useRef<number>();
  const progressIntervalRef = useRef<number>();

  const calculateDuration = useCallback(() => {
    const maxPoints = Math.max(...dataSeries.map(series => series.dataPoints.length));

    // Find the longest animation duration from all styles
    let maxAnimationDuration = 0;
    Object.values(ANIMATION_STYLES).forEach(styles => {
      Object.values(styles).forEach(style => {
        const totalDuration = style.duration + ((style.delay || 0) * maxPoints);
        if (totalDuration > maxAnimationDuration) {
          maxAnimationDuration = totalDuration;
        }
      });
    });

    // Return the maximum of points-based duration and animation duration
    return maxAnimationDuration + BUFFER_DURATION;
  }, [dataSeries]);

  const updateProgress = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const newProgress = Math.min((elapsed / durationRef.current) * 100, 100);
    setProgress(newProgress);

    if (newProgress >= 100 && mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const captureFrame = useCallback((canvas: HTMLCanvasElement, targetElement: HTMLDivElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgElement = targetElement.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const startRecording = useCallback(async () => {
    if (!targetRef.current || !canvasRef.current) return;

    // Reset state
    setProgress(0);
    chunksRef.current = [];

    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = canvasRef.current;
    const targetElement = targetRef.current;
    const rect = targetElement.getBoundingClientRect();
    const scale = 2;
    
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    canvas.getContext('2d')?.scale(scale, scale);

    durationRef.current = calculateDuration();
    startTimeRef.current = Date.now();

    try {
      const stream = canvas.captureStream(FRAME_RATE);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        onComplete(url);
        setIsRecording(false);
        setProgress(100);
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Start progress updates
      progressIntervalRef.current = window.setInterval(updateProgress, 50);

      // Start frame capture
      frameIntervalRef.current = window.setInterval(() => {
        captureFrame(canvas, targetElement);
      }, FRAME_INTERVAL);

    } catch (error) {
      console.error('Recording failed:', error);
      onComplete(null);
      setIsRecording(false);
    }
  }, [targetRef, calculateDuration, captureFrame, updateProgress, onComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setIsRecording(false);
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    isRecording,
    progress,
    canvasRef,
    startRecording,
    stopRecording
  };
};