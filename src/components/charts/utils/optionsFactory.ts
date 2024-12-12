import type { EChartsOption } from 'echarts';
import type { ChartConfig } from '../../EChartsRenderer/types';
import { validateChartConfig } from './optionsValidator';
import { ensureValidColors } from './colorValidator';
import { getLineAreaChartOptions } from '../LineAreaChart';
import { getPieDonutChartOptions } from '../PieDonutChart';
import { getBarChartOptions } from '../BarChart';
import { getBarRaceChartOptions } from '../BarRaceChart';
import { CHART_FONTS } from '../../../constants/fonts';
import { getChartTextStyle } from '../chartConfig';

export const getChartOptions = (
  chartType: string,
  config: ChartConfig,
  smoothPoints: boolean
): EChartsOption | null => {
  try {
    // Validate configuration
    const validationError = validateChartConfig(chartType, config);
    if (validationError) {
      console.error(`[getChartOptions] Validation error: ${validationError}`, { chartType, config });
      return null;
    }

    // Ensure valid colors
    const validColors = ensureValidColors(config.colors);
    
    // Get font family
    const fontFamily = config.font in CHART_FONTS 
      ? CHART_FONTS[config.font as keyof typeof CHART_FONTS]
      : config.font;

    console.log('[getChartOptions] Using font:', {
      requested: config.font,
      resolved: fontFamily
    });

    // Create base config with font
    const baseConfig = {
      ...config,
      colors: validColors,
      textStyle: getChartTextStyle(fontFamily, config.theme === 'dark')
    };

    // For bar race charts, return minimal initial setup
    if (chartType === 'bar_race') {
      return getBarRaceChartOptions({
        ...baseConfig,
        dataSeries: config.dataSeries,
        showGridlines: config.showGridlines,
        animationStyle: config.animationStyle,
        showDataLabels: config.showDataLabels,
        theme: config.theme
      });
    }

    // For other chart types
    switch (chartType) {
      case 'line':
      case 'area':
        return getLineAreaChartOptions({ ...baseConfig, chartType, smoothPoints });

      case 'pie':
      case 'donut':
        return getPieDonutChartOptions({
          ...baseConfig,
          dataSeries: config.dataSeries[0],
          chartType
        });

      case 'vertical_bar':
      case 'horizontal_bar':
        return getBarChartOptions({ ...baseConfig, chartType });

      default:
        console.warn(`[getChartOptions] Unsupported chart type: ${chartType}`);
        return null;
    }
  } catch (error) {
    console.error('[getChartOptions] Error generating options:', error);
    return null;
  }
};