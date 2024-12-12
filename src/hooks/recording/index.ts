import { useCallback, useEffect, useRef } from 'react';
import type { UseRecordingOptions, RecordingRefs } from './types';
import { useRecordingState } from './useRecordingState';
import { useRecordingDuration } from './useRecordingDuration';
import { useFrameCapture, FRAME_INTERVAL } from './useFrameCapture';
import { useMediaRecorder } from './useMediaRecorder';

export const useRecording = ({ targetRef, dataSeries, onComplete }: UseRecordingOptions) => {
  const { isRecording, progress, canvasRef, setIsRecording, setProgress } = useRecordingState();
  const { calculateDuration } = useRecordingDuration();
  const { captureFrame } = useFrameCapture();
  const { setupMediaRecorder } = useMediaRecorder(onComplete);

  const refs = useRef<RecordingRefs>({
    mediaRecorder: null,
    chunks: [],
    startTime: 0,
    duration: 0
  });

  const updateProgress = useCallback(() => {
    if (refs.current.duration === 0) return;
    
    const elapsed = Date.now() - refs.current.startTime;
    const newProgress = Math.min((elapsed / refs.current.duration) * 100, 100);
    
    setProgress(newProgress);

    if (newProgress >= 100 && refs.current.mediaRecorder?.state === 'recording') {
      console.log('[updateProgress] Recording complete');
      refs.current.mediaRecorder.stop();
    }
  }, [setProgress]);

  const startRecording = useCallback(async () => {
    if (!targetRef.current || !canvasRef.current) return;

    console.log('[startRecording] Initializing recording');
    setIsRecording(true);
    setProgress(0);
    refs.current.chunks = [];

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
      // Calculate max points across all series
      const maxPoints = Math.max(...dataSeries.map(series => series.dataPoints.length));
      refs.current.duration = calculateDuration(targetElement, maxPoints);
      console.log('[startRecording] Calculated duration:', refs.current.duration);

      const stream = canvas.captureStream(60);
      refs.current.mediaRecorder = setupMediaRecorder(stream, refs.current);

      // Start frame capture
      refs.current.frameInterval = window.setInterval(() => {
        captureFrame(canvas, targetElement);
      }, FRAME_INTERVAL);

      // Start progress updates
      refs.current.progressInterval = window.setInterval(updateProgress, 50);

      // Start recording
      refs.current.startTime = Date.now();
      refs.current.mediaRecorder.start();
      console.log('[startRecording] Recording started');

    } catch (error) {
      console.error('[startRecording] Recording failed:', error);
      setIsRecording(false);
      setProgress(0);
      onComplete(null);
    }
  }, [targetRef, canvasRef, dataSeries, calculateDuration, captureFrame, setupMediaRecorder, updateProgress, onComplete, setIsRecording, setProgress]);

  const stopRecording = useCallback(() => {
    console.log('[stopRecording] Stopping recording');
    if (refs.current.mediaRecorder?.state === 'recording') {
      refs.current.mediaRecorder.stop();
    }
    if (refs.current.frameInterval) {
      clearInterval(refs.current.frameInterval);
    }
    if (refs.current.progressInterval) {
      clearInterval(refs.current.progressInterval);
    }
    setIsRecording(false);
    setProgress(0);
  }, [setIsRecording, setProgress]);

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