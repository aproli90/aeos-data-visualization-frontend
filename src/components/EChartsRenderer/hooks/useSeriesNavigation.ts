import { useState, useCallback } from 'react';
import { ChartError } from '../../../utils/errors/ChartError';
import { ChartErrorCode } from '../../../utils/errors/chartErrorCodes';
import type { DataSeries } from '../../../services/api';

export const useSeriesNavigation = (
  dataSeries: DataSeries[],
  initialIndex: number = 0
) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const validateIndex = useCallback((index: number) => {
    console.log('[useSeriesNavigation] Validating index:', {
      index,
      totalSeries: dataSeries.length,
      currentSeries: dataSeries[index]?.name
    });

    if (!Array.isArray(dataSeries)) {
      throw new ChartError(
        'Cannot navigate series: Invalid data structure',
        ChartErrorCode.INVALID_DATA_SERIES,
        {
          dataType: typeof dataSeries,
          expectedType: 'array'
        }
      );
    }

    if (dataSeries.length === 0) {
      throw new ChartError(
        'Cannot navigate series: No data series available',
        ChartErrorCode.INVALID_DATA_SERIES,
        {
          seriesCount: 0
        }
      );
    }

    if (index < 0 || index >= dataSeries.length) {
      throw new ChartError(
        'Cannot navigate series: Index out of bounds',
        ChartErrorCode.INVALID_SERIES_INDEX,
        {
          requestedIndex: index,
          totalSeries: dataSeries.length,
          availableSeries: dataSeries.map(s => s.name)
        }
      );
    }

    const series = dataSeries[index];
    if (!series || !Array.isArray(series.dataPoints)) {
      throw new ChartError(
        'Cannot navigate series: Invalid series data',
        ChartErrorCode.INVALID_DATA_SERIES,
        {
          seriesIndex: index,
          seriesName: series?.name,
          hasDataPoints: !!series?.dataPoints
        }
      );
    }

    return true;
  }, [dataSeries]);

  const navigateToSeries = useCallback((index: number) => {
    console.log('[useSeriesNavigation] Attempting navigation:', {
      fromIndex: currentIndex,
      toIndex: index
    });

    try {
      validateIndex(index);
      setCurrentIndex(index);
      return true;
    } catch (error) {
      console.error('[useSeriesNavigation] Navigation failed:', error);
      return false;
    }
  }, [currentIndex, validateIndex]);

  const navigateNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % dataSeries.length;
    return navigateToSeries(nextIndex);
  }, [currentIndex, dataSeries.length, navigateToSeries]);

  const navigatePrevious = useCallback(() => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : dataSeries.length - 1;
    return navigateToSeries(prevIndex);
  }, [currentIndex, dataSeries.length, navigateToSeries]);

  return {
    currentIndex,
    navigateToSeries,
    navigateNext,
    navigatePrevious,
    totalSeries: dataSeries.length,
    currentSeries: dataSeries[currentIndex],
    isValidIndex: (index: number) => {
      try {
        return validateIndex(index);
      } catch {
        return false;
      }
    }
  };
};