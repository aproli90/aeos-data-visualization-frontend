import React, { useRef } from 'react';
import { EChartsRenderer } from './EChartsRenderer';
import { RecordingOverlay } from './RecordingOverlay';

interface ChartRendererProps {
  data: Array<{ name: string; value: number }>;
  chartType: string;
  isRecording: boolean;
  onRecordingComplete: (videoUrl: string | null) => void;
  animationKey: number;
  colors: string[];
  whiteBackground: boolean;
  animationStyle: {
    type: string;
    easing: string;
    duration: number;
    delay?: number;
    rotate?: number;
  };
  smoothPoints: boolean;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ 
  data, 
  chartType, 
  isRecording, 
  onRecordingComplete,
  animationKey,
  colors,
  whiteBackground,
  animationStyle,
  smoothPoints
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
      <div ref={chartRef} className="w-full h-[350px]">
        <EChartsRenderer
          data={data}
          chartType={chartType}
          animationKey={animationKey}
          colors={colors}
          whiteBackground={whiteBackground}
          animationStyle={animationStyle}
          smoothPoints={smoothPoints}
        />
      </div>
      
      <RecordingOverlay
        targetRef={chartRef}
        isRecording={isRecording}
        onRecordingComplete={onRecordingComplete}
      />
    </div>
  );
};