import React, { useEffect } from 'react';
import { useRecording } from '../hooks/useRecording';
import type { DataSeries } from '../services/api';

interface RecordingOverlayProps {
  targetRef: React.RefObject<HTMLDivElement>;
  isRecording: boolean;
  onRecordingComplete: (videoUrl: string | null) => void;
  dataSeries: DataSeries[];
}

export const RecordingOverlay: React.FC<RecordingOverlayProps> = ({
  targetRef,
  isRecording,
  onRecordingComplete,
  dataSeries
}) => {
  const { progress, canvasRef, startRecording } = useRecording({
    targetRef,
    dataSeries,
    onComplete: onRecordingComplete
  });

  useEffect(() => {
    if (isRecording) {
      startRecording();
    }
  }, [isRecording, startRecording]);

  if (!isRecording) return null;

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-0 inset-x-0 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-b-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-red-600 dark:text-red-400">Recording animation...</span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-700 dark:to-transparent">
          <div 
            className="h-full transform origin-left bg-gradient-to-l from-red-600/100 to-red-600/30 dark:from-red-500/100 dark:to-red-500/30 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </>
  );
};