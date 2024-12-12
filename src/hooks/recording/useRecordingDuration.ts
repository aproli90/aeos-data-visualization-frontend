import { useCallback } from 'react';
import { ANIMATION_STYLES, type ChartType } from '../../constants/animationStyles';
import type { DurationConfig } from './types';

const BUFFER_DURATION = 2000; // 2 seconds buffer

export const useRecordingDuration = () => {
  const calculateDuration = useCallback((container: HTMLDivElement, maxDataPoints: number): number => {
    console.log('[calculateDuration] Starting duration calculation');

    const chartContainer = container.querySelector('[data-chart-type]');
    if (!chartContainer) {
      console.warn('[calculateDuration] Chart container not found, using fallback duration');
      return 4500;
    }

    const chartType = chartContainer.getAttribute('data-chart-type') as ChartType;
    const animationStyleKey = chartContainer.getAttribute('data-animation-style');
    
    if (!chartType || !animationStyleKey || !ANIMATION_STYLES[chartType]) {
      console.warn('[calculateDuration] Invalid chart configuration', { chartType, animationStyleKey });
      return 4500;
    }

    const styles = ANIMATION_STYLES[chartType];
    const animationStyle = styles[animationStyleKey as keyof typeof styles];
    
    if (!animationStyle) {
      console.warn('[calculateDuration] Animation style not found');
      return 4500;
    }

    console.log('[calculateDuration] Configuration:', {
      chartType,
      animationStyle: animationStyleKey,
      maxDataPoints,
      baseAnimationDuration: animationStyle.duration
    });

    const duration = calculateTotalDuration({
      chartType,
      animationStyle,
      maxPoints: maxDataPoints,
      bufferDuration: BUFFER_DURATION
    });

    console.log('[calculateDuration] Final duration:', duration);
    return duration;
  }, []);

  return { calculateDuration, BUFFER_DURATION };
};

const calculateTotalDuration = (config: DurationConfig): number => {
  const { chartType, animationStyle, maxPoints, bufferDuration } = config;

  // Base duration from animation style
  const baseDuration = animationStyle.duration || 2500;
  const delayPerPoint = animationStyle.delay || 0;

  // Calculate total delay based on data points
  const totalDelay = delayPerPoint * maxPoints;

  // Get type-specific multiplier
  const multiplier = getDurationMultiplier(chartType);

  // Special handling for bar race charts
  if (chartType === 'bar_race') {
    const updateDuration = animationStyle.updateDuration || 2000;
    const finalDuration = (updateDuration * maxPoints) + bufferDuration;
    console.log('[calculateTotalDuration]', {
      chartType,
      baseDuration,
      delayPerPoint,
      updateDuration,
      maxPoints,
      totalDelay,
      bufferDuration,
      finalDuration
    });
    return finalDuration;
  }

  // Calculate final duration with multiplier and buffer
  const finalDuration = (baseDuration + totalDelay) * multiplier + bufferDuration;

  console.log('[calculateTotalDuration]', {
    chartType,
    baseDuration,
    delayPerPoint,
    maxPoints,
    totalDelay,
    multiplier,
    bufferDuration,
    finalDuration
  });

  return finalDuration;
};

const getDurationMultiplier = (chartType: ChartType): number => {
  switch (chartType) {
    case 'pie':
    case 'donut':
      return 1.75; // Increased for rotation animations
    case 'line':
    case 'area':
      return 1.5; // For sequential point animations
    case 'vertical_bar':
    case 'horizontal_bar':
      return 1.25; // For staggered animations
    default:
      return 1;
  }
};