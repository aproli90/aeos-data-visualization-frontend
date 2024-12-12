import { useState, useEffect } from 'react';
import type { ChartFont } from '../constants/fonts';
import { CHART_FONTS } from '../constants/fonts';

const STORAGE_KEY = 'chartGenie_font';

export const useChartFont = () => {
  const [font, setFont] = useState<ChartFont>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ChartFont;
      return stored && stored in CHART_FONTS ? stored : 'Default';
    } catch {
      return 'Default';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, font);
    } catch (error) {
      console.error('Error saving font preference:', error);
    }
  }, [font]);

  return { font, setFont };
};