import { useEffect, useRef } from 'react';
import type { EChartsInstance } from 'echarts';
import { BarRaceDataManager } from '../../charts/animations/barRaceDataManager';
import { BarRaceAnimator } from '../../charts/animations/barRaceAnimator';
import type { AnimationConfig } from '../../charts/animations/types';
import type { DataSeries } from '../../../services/api';
import { TextStyle } from '../../charts/chartConfig';

export const useBarRaceAnimation = (
  chart: EChartsInstance | null,
  dataSeries: DataSeries[],
  colors: string[],
  animationStyle: AnimationConfig | null,
  theme: 'light' | 'dark',
  animationKey: number,
  textStyle: TextStyle
) => {
  const animatorRef = useRef<BarRaceAnimator | null>(null);

  // Cleanup function to ensure animation is stopped
  const cleanup = () => {
    if (animatorRef.current) {
      animatorRef.current.stop();
      animatorRef.current = null;
    }
  };

  // Initialize animator when chart or data changes
  useEffect(() => {
    // Only proceed if this is a bar race chart with valid data
    if (!chart || !dataSeries.length || !animationStyle) {
      cleanup();
      return;
    }

    const dataManager = new BarRaceDataManager(dataSeries);
    const animator = new BarRaceAnimator(
      chart,
      dataManager,
      colors,
      animationStyle,
      theme === 'dark',
      textStyle
    );

    animatorRef.current = animator;
    animator.start();

    return cleanup;
  }, [chart, dataSeries, colors, animationStyle, theme]);

  // Handle animation replay
  useEffect(() => {
    if (animatorRef.current) {
      animatorRef.current.start(true);
    }
  }, [animationKey]);

  return {
    restart: () => animatorRef.current?.start(true),
    stop: () => animatorRef.current?.stop()
  };
};