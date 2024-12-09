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
const BUFFER_DURATION = 2000; // Increased buffer duration

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
  const chartContainer = targetRef.current?.querySelector('[data-chart-type]');
  if (!chartContainer) {
    console.error('Chart container not found');
    return 5000; // Increased default duration as fallback
  }

  const chartType = chartContainer.getAttribute('data-chart-type') as ChartType;
  const animationStyleKey = chartContainer.getAttribute('data-animation-style');
  
  if (!chartType || !animationStyleKey || !ANIMATION_STYLES[chartType]) {
    console.error('Invalid chart type or animation style');
    return 5000; // Increased default duration as fallback
  }

  const styles = ANIMATION_STYLES[chartType];
  const animationStyle = styles[animationStyleKey as keyof typeof styles];
  if (!animationStyle) {
    console.error('Animation style not found');
    return 5000; // Increased default duration as fallback
  }

  // Calculate max points across all series
  const maxPoints = Math.max(...dataSeries.map(series => series.dataPoints.length));

  // For bar race, we need extra time for the full animation cycle
  if (chartType === 'bar_race') {
    const combinedDuration = animationStyle.duration * maxPoints;
    // Total duration includes all transitions between states plus extra time for sorting animations
    const totalDuration = combinedDuration * 1.5;
    // Add extra buffer for initial and final states
    return totalDuration + BUFFER_DURATION;
  }

  // For other chart types
  const baseDuration = animationStyle.duration;
  const delayPerPoint = animationStyle.delay || 0;
  
  // Calculate combined duration based on points
  const combinedDuration = baseDuration * maxPoints;
  const totalDelay = delayPerPoint * maxPoints;
  const complexityMultiplier = chartType === 'pie' || chartType === 'donut' ? 2 : 1.5;
  const totalDuration = (combinedDuration + totalDelay) * complexityMultiplier;

  // Add buffer duration for start and end states
  return totalDuration + BUFFER_DURATION;
}, [dataSeries, targetRef]);

  const updateProgress = useCallback(() => {
    if (durationRef.current === 0) return;
    
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

    try {
      durationRef.current = calculateDuration();
      startTimeRef.current = Date.now();

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