import { useMemo } from 'react';
import type { DataSeries } from '../../../services/api';
import { ChartError } from '../../../utils/errors/ChartError';
import { ChartErrorCode } from '../../../utils/errors/chartErrorCodes';

export const useDataValidation = (
  dataSeries: DataSeries[] | undefined,
  chartType: string,
  currentSeriesIndex: number
) => {
  return useMemo(() => {
    if (!dataSeries || !Array.isArray(dataSeries)) {
      throw new ChartError(
        'Invalid data series provided',
        ChartErrorCode.INVALID_DATA_SERIES,
        { dataSeries }
      );
    }

    if (dataSeries.length === 0) {
      throw new ChartError(
        'Empty data series',
        ChartErrorCode.INVALID_DATA_SERIES,
        { length: 0 }
      );
    }

    const isPieOrDonut = chartType === 'pie' || chartType === 'donut';

    // For pie/donut charts, ensure valid series index
    if (isPieOrDonut) {
      // Clamp the index to valid range
      const validIndex = Math.max(0, Math.min(currentSeriesIndex, dataSeries.length - 1));
      
      const selectedSeries = dataSeries[validIndex];
      if (!selectedSeries?.dataPoints?.length) {
        throw new ChartError(
          'Invalid data points in selected series',
          ChartErrorCode.INVALID_DATA_SERIES,
          {
            seriesIndex: validIndex,
            series: selectedSeries
          }
        );
      }

      return [selectedSeries];
    }

    // Validate all series for non-pie/donut charts
    dataSeries.forEach((series, index) => {
      if (!series?.dataPoints?.length) {
        throw new ChartError(
          'Invalid data points in series',
          ChartErrorCode.INVALID_DATA_SERIES,
          {
            seriesIndex: index,
            series
          }
        );
      }
    });

    return dataSeries;
  }, [dataSeries, chartType, currentSeriesIndex]);
};