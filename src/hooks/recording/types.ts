import type { DataSeries } from '../../services/api';
import type { ChartType } from '../../constants/animationStyles';

export interface UseRecordingOptions {
  targetRef: React.RefObject<HTMLDivElement>;
  dataSeries: DataSeries[];
  onComplete: (url: string | null) => void;
}

export interface RecordingState {
  isRecording: boolean;
  progress: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export interface DurationConfig {
  chartType: ChartType;
  animationStyle: any;
  maxPoints: number;
  bufferDuration: number;
}

export interface RecordingRefs {
  mediaRecorder: MediaRecorder | null;
  chunks: Blob[];
  startTime: number;
  duration: number;
  frameInterval?: number;
  progressInterval?: number;
}