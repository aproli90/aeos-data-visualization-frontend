import React, { useEffect, useRef, useState } from 'react';

interface RecordingOverlayProps {
  targetRef: React.RefObject<HTMLDivElement>;
  isRecording: boolean;
  onRecordingComplete: (videoUrl: string | null) => void;
}

const RECORDING_DURATION = 6000; // 6 seconds to capture full animation
const FRAME_RATE = 60;
const FRAME_INTERVAL = 1000 / FRAME_RATE;

export const RecordingOverlay: React.FC<RecordingOverlayProps> = ({
  targetRef,
  isRecording,
  onRecordingComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [progress, setProgress] = useState(0);
  const frameCountRef = useRef(0);
  const animationStartTimeRef = useRef(0);

  useEffect(() => {
    if (!isRecording) {
      setProgress(0);
      frameCountRef.current = 0;
      return;
    }

    const startRecording = async () => {
      if (!targetRef.current || !canvasRef.current) return;

      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;

      // Set canvas size with higher resolution
      const targetElement = targetRef.current;
      const rect = targetElement.getBoundingClientRect();
      const scale = 2; // Increase quality
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      ctx.scale(scale, scale);

      try {
        const stream = canvas.captureStream(FRAME_RATE);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 8000000 // Increase bitrate for better quality
        });

        chunksRef.current = [];
        mediaRecorderRef.current = mediaRecorder;
        animationStartTimeRef.current = Date.now();

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          onRecordingComplete(url);
        };

        const captureFrame = () => {
          if (!targetElement || !ctx) return;

          const svgElement = targetElement.querySelector('svg');
          if (!svgElement) return;

          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);

          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            frameCountRef.current++;
            const elapsed = Date.now() - animationStartTimeRef.current;
            const newProgress = Math.min((elapsed / RECORDING_DURATION) * 100, 100);
            setProgress(newProgress);

            if (elapsed >= RECORDING_DURATION && mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
          };
          img.src = url;
        };

        // Start recording
        mediaRecorder.start();
        
        // Capture frames at specified interval
        const frameInterval = setInterval(captureFrame, FRAME_INTERVAL);

        // Stop recording after duration
        setTimeout(() => {
          clearInterval(frameInterval);
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, RECORDING_DURATION);

      } catch (error) {
        console.error('Recording setup failed:', error);
        onRecordingComplete(null);
      }
    };

    startRecording();

    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording, targetRef, onRecordingComplete]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      {isRecording && (
        <div className="absolute bottom-0 left-4 right-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-600">Processing...</span>
            <span className="text-sm font-medium text-gray-600">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-50 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
};