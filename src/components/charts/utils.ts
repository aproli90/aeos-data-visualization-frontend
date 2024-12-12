import type { DataSeries } from '../../services/api';

export const calculateYAxisRange = (data: DataSeries[]) => {
  let minValue = Infinity;
  let maxValue = -Infinity;

  data.forEach(series => {
    series.dataPoints.forEach(point => {
      if (typeof point.value === 'number' && !isNaN(point.value)) {
        if (point.value < minValue) minValue = point.value;
        if (point.value > maxValue) maxValue = point.value;
      }
    });
  });

  if (minValue === Infinity || maxValue === -Infinity) {
    return { min: 0, max: 100 };
  }

  const hasNegativeValues = minValue < 0;
  if (!hasNegativeValues) {
    minValue = Math.min(...data.flatMap(s => 
      s.dataPoints
        .filter(p => typeof p.value === 'number' && !isNaN(p.value))
        .map(p => p.value)
    ));
  }

  const range = maxValue - minValue;
  const percentageDelta = maxValue !== 0 ? ((maxValue - minValue) / maxValue) * 100 : 100;

  if (percentageDelta < 30 && !hasNegativeValues && minValue > 0) {
    const baselinePercentage = Math.max(0.85, 1 - (percentageDelta / 100));
    minValue = minValue * baselinePercentage;
    const topPadding = range * 0.15;
    maxValue = maxValue + topPadding;
  } else {
    const padding = range * 0.1;
    if (hasNegativeValues) {
      minValue = minValue - padding;
      maxValue = maxValue + padding;
    } else {
      minValue = 0;
      maxValue = maxValue + padding;
    }
  }

  return { min: minValue, max: maxValue };
};

export const shouldRotateLabels = (categories: string[], containerWidth: number) => {
  const avgCharWidth = 8;
  const padding = 20;
  const maxLabelWidth = Math.max(...categories.map(cat => cat.length * avgCharWidth + padding));
  const totalWidth = categories.length * maxLabelWidth;

  return totalWidth > containerWidth || maxLabelWidth > (containerWidth / categories.length);
};

export const getAxisLabelOptions = (categories: string[], containerWidth: number, isDark: boolean, fontFamily?: string) => {
  const shouldRotate = shouldRotateLabels(categories, containerWidth);
  return {
    rotate: shouldRotate ? 45 : 0,
    overflow: 'break',
    interval: 0,
    width: shouldRotate ? undefined : containerWidth / categories.length - 10,
    align: shouldRotate ? 'right' : 'center',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: fontFamily || 'Default',
    padding: [8, 4],
    color: isDark ? '#e5e7eb' : '#374151'
  };
};

export const formatYAxisLabel = (value: number) => {
  return Number.isInteger(value) ? value.toString() : '';
};

export const getYAxisLabelConfig = (isDark: boolean, fontFamily?: string) => {
  return {
    formatter: (value: number) => formatYAxisLabel(value),
    interval: 'auto',
    axisLabel: {
      hideOverlap: true,
      color: isDark ? '#e5e7eb' : '#374151',
      fontFamily: fontFamily || 'Default',
    }
  };
};
