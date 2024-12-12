import type { AnimationStyle } from '../types';
import type { DataSeries } from '../../../services/api';

const BUFFER_DURATION = 500; // Buffer time in milliseconds

export const calculateTotalDuration = (
  chartType: string,
  animationStyle: AnimationStyle,
  dataSeries: DataSeries[]
): number => {
  // Get max points across all series
  const maxPoints = Math.max(...dataSeries.map(series => series.dataPoints.length));
  
  // Base duration from animation style
  const baseDuration = animationStyle.duration || 1000;
  const delay = animationStyle.delay || 0;

  // Calculate total duration based on chart type
  switch (chartType) {
    case 'bar_race':
      // For bar race, each point needs full animation time
      return (baseDuration * maxPoints) + BUFFER_DURATION;

    case 'pie':
    case 'donut':
      // Pie/donut charts need extra time for rotation/expansion
      return (baseDuration * 1.5) + (delay * maxPoints) + BUFFER_DURATION;

    case 'line':
    case 'area':
      // Line/area charts need time for each point to animate
      return baseDuration + (delay * maxPoints) + BUFFER_DURATION;

    case 'vertical_bar':
    case 'horizontal_bar':
      // Bar charts animate all bars with staggered delay
      return baseDuration + (delay * maxPoints) + BUFFER_DURATION;

    default:
      // Default duration calculation
      return baseDuration + (delay * maxPoints);
  }
};