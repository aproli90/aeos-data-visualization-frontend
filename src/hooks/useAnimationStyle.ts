import { useState, useCallback } from 'react';
import { ANIMATION_STYLES, type ChartType } from '../constants/animationStyles';
import type { ChartData } from '../services/api';

interface UseAnimationStyleReturn {
  animationStyle: string;
  currentAnimationStyle: any | null; // Using any here as the animation style structure varies
  setAnimationStyle: (style: string) => void;
  initializeAnimationStyle: (chartType: ChartType) => void;
}

export const useAnimationStyle = (chartData: ChartData | null): UseAnimationStyleReturn => {
  const [animationStyle, setAnimationStyle] = useState('');

  const initializeAnimationStyle = useCallback((chartType: ChartType) => {
    const styles = ANIMATION_STYLES[chartType];
    if (styles) {
      const defaultStyle = Object.keys(styles)[0];
      setAnimationStyle(defaultStyle);
    }
  }, []);

  const getCurrentAnimationStyle = useCallback(() => {
    if (!chartData) return null;
    const chartType = chartData.recommendedChartType as ChartType;
    const styles = ANIMATION_STYLES[chartType];
    return styles?.[animationStyle] || Object.values(styles)[0];
  }, [chartData, animationStyle]);

  return {
    animationStyle,
    currentAnimationStyle: getCurrentAnimationStyle(),
    setAnimationStyle,
    initializeAnimationStyle
  };
};