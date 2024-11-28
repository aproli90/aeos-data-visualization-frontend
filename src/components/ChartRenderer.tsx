import React, { useRef, useState } from 'react';
import { EChartsRenderer } from './EChartsRenderer';
import { RecordingOverlay } from './RecordingOverlay';
import { ResizeHandle } from './ResizeHandle';
import type { DataSeries } from '../services/api';

interface ChartRendererProps {
  dataSeries: DataSeries[];
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
    centerPop?: boolean;
    startAngle?: number;
    clockwise?: boolean;
  };
  smoothPoints: boolean;
  currentSeriesIndex: number;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ 
  dataSeries, 
  chartType, 
  isRecording, 
  onRecordingComplete,
  animationKey,
  colors,
  whiteBackground,
  animationStyle,
  smoothPoints,
  currentSeriesIndex
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState<number | undefined>();
  const containerHeight = 350;

  const handleResize = (width: number) => {
    setChartWidth(width);
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
      <div 
        ref={chartRef} 
        className="w-full"
        style={{ 
          height: `${containerHeight}px`,
          width: chartWidth ? `${chartWidth}px` : '100%',
          transition: 'width 0.2s ease-in-out'
        }}
      >
        <EChartsRenderer
          dataSeries={dataSeries}
          chartType={chartType}
          animationKey={animationKey}
          colors={colors}
          whiteBackground={whiteBackground}
          animationStyle={animationStyle}
          smoothPoints={smoothPoints}
          currentSeriesIndex={currentSeriesIndex}
        />
      </div>
      
      <ResizeHandle onResize={handleResize} minWidth={300} />
      
      <RecordingOverlay
        targetRef={chartRef}
        isRecording={isRecording}
        onRecordingComplete={onRecordingComplete}
        dataSeries={dataSeries}
      />
    </div>
  );
};