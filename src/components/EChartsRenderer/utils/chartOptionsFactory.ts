import type { EChartsOption } from 'echarts';
import type { ChartConfig } from '../types';
import { getChartOptions } from '../../charts/utils/optionsFactory';

export const generateChartOptions = (
  chartType: string,
  config: ChartConfig,
  smoothPoints: boolean
): EChartsOption | null => {
  try {
    // Generate options using the factory
    const options = getChartOptions(chartType, config, smoothPoints);

    if (!options) {
      console.warn('[generateChartOptions] Failed to generate options', {
        chartType,
        hasDataSeries: !!config.dataSeries?.length,
        hasColors: !!config.colors?.length
      });
      return null;
    }

    return options;
  } catch (error) {
    console.error('[generateChartOptions] Error:', error);
    return null;
  }
};