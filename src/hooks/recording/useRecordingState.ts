import { useState, useRef } from 'react';
import type { RecordingState } from './types';

export const useRecordingState = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return {
    isRecording,
    progress,
    canvasRef,
    setIsRecording,
    setProgress
  };
};