import type { EChartsOption } from 'echarts';
import type { DataSeries } from '../../services/api';

export const calculateYAxisRange = (data: DataSeries[]) => {
  let minValue = Infinity;
  let maxValue = -Infinity;

  // Find min and max values from valid numerical data points
  data.forEach(series => {
    series.dataPoints.forEach(point => {
      if (typeof point.value === 'number' && !isNaN(point.value)) {
        if (point.value < minValue) minValue = point.value;
        if (point.value > maxValue) maxValue = point.value;
      }
    });
  });

  // Handle case where no valid numerical data is found
  if (minValue === Infinity || maxValue === -Infinity) {
    return { min: 0, max: 100 }; // Default range
  }

  // Only show negative values if they exist
  const hasNegativeValues = minValue < 0;
  if (!hasNegativeValues) {
    minValue = Math.min(...data.flatMap(s => 
      s.dataPoints
        .filter(p => typeof p.value === 'number' && !isNaN(p.value))
        .map(p => p.value)
    ));
  }

  // Calculate percentage delta
  const range = maxValue - minValue;
  const percentageDelta = maxValue !== 0 ? ((maxValue - minValue) / maxValue) * 100 : 100;

  // If percentage delta is small (less than 30%) and all values are positive,
  // adjust the baseline to make differences more visible
  if (percentageDelta < 30 && !hasNegativeValues && minValue > 0) {
    // Start from 85-95% of the minimum value to show deltas better
    const baselinePercentage = Math.max(0.85, 1 - (percentageDelta / 100));
    minValue = minValue * baselinePercentage;

    // Add some padding to the top
    const topPadding = range * 0.15;
    maxValue = maxValue + topPadding;
  } else {
    // For larger deltas or negative values, use standard padding
    const padding = range * 0.1;
    if (hasNegativeValues) {
      minValue = minValue - padding;
      maxValue = maxValue + padding;
    } else {
      // For positive values with large deltas, start from 0
      minValue = 0;
      maxValue = maxValue + padding;
    }
  }

  return { min: minValue, max: maxValue };
};

export const shouldRotateLabels = (categories: string[], containerWidth: number) => {
  // Estimate text width (assuming average char width of 8px and some padding)
  const avgCharWidth = 8;
  const padding = 20;
  const maxLabelWidth = Math.max(...categories.map(cat => cat.length * avgCharWidth + padding));
  const totalWidth = categories.length * maxLabelWidth;

  // If total width of labels exceeds container width or any single label is too wide
  return totalWidth > containerWidth || maxLabelWidth > (containerWidth / categories.length);
};

export const getAxisLabelOptions = (categories: string[], containerWidth: number) => {
  const shouldRotate = shouldRotateLabels(categories, containerWidth);
  return {
    rotate: shouldRotate ? 45 : 0,
    overflow: 'break', // Force label to break into multiple lines if needed
    interval: 0, // Show all labels
    width: shouldRotate ? undefined : containerWidth / categories.length - 10,
    align: shouldRotate ? 'right' : 'center',
    fontSize: 14,
    fontWeight: 500,
    padding: [8, 4]
  };
};

export const formatYAxisLabel = (value: number) => {
  // Only show integer values
  return Number.isInteger(value) ? value.toString() : '';
};

export const getYAxisLabelConfig = () => {
  return {
    formatter: (value: number) => formatYAxisLabel(value),
    interval: 'auto', // Let ECharts determine optimal interval
    axisLabel: {
      hideOverlap: true // Hide overlapping labels
    }
  };
};