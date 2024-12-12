import type { ChartConfig } from '../../EChartsRenderer/types';
import { ChartError } from '../../../utils/errors/ChartError';
import { ChartErrorCode } from '../../../utils/errors/chartErrorCodes';

export const validateChartConfig = (chartType: string, config: ChartConfig): string | null => {
  try {
    // Validate chart type
    if (!chartType) {
      throw new ChartError(
        'Chart type is required',
        ChartErrorCode.INVALID_CHART_CONFIG
      );
    }

    // Validate data series
    if (!config.dataSeries?.length) {
      throw new ChartError(
        'Data series is required',
        ChartErrorCode.INVALID_DATA_SERIES
      );
    }

    // Validate colors with fallback
    if (!config.colors) {
      throw new ChartError(
        'Colors configuration is missing',
        ChartErrorCode.INVALID_CHART_CONFIG
      );
    }

    // Validate animation style
    if (!config.animationStyle) {
      throw new ChartError(
        'Animation style is required',
        ChartErrorCode.INVALID_ANIMATION_STYLE
      );
    }

    return null; // No errors
  } catch (error) {
    if (error instanceof ChartError) {
      return error.message;
    }
    return 'Invalid chart configuration';
  }
};