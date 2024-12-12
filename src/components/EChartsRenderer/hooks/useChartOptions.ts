import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type { ChartConfig } from '../types';
import { generateChartOptions } from '../utils/chartOptionsFactory';
import { calculateTotalDuration } from '../utils/durationCalculator';

export const useChartOptions = (
  chartType: string,
  config: ChartConfig,
  smoothPoints: boolean
): EChartsOption | null => {
  return useMemo(() => {
    try {
      // Validate input data
      if (!config.dataSeries?.length || !config.dataSeries[0]?.dataPoints?.length) {
        console.warn('[useChartOptions] Invalid input data:', {
          hasDataSeries: !!config.dataSeries?.length,
          hasDataPoints: !!config.dataSeries?.[0]?.dataPoints?.length
        });
        return null;
      }

      // Calculate total duration based on data points
      const totalDuration = calculateTotalDuration(chartType, config.animationStyle, config.dataSeries);

      // Get chart options with updated duration
      const options = generateChartOptions(chartType, {
        ...config,
        animationStyle: {
          ...config.animationStyle,
          duration: totalDuration
        }
      }, smoothPoints);

      return options;
    } catch (error) {
      console.error('[useChartOptions] Error:', error);
      return null;
    }
  }, [chartType, config, smoothPoints]);
};