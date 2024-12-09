import type { EChartsOption } from 'echarts';
import type { DataSeries } from '../../services/api';
import { calculateYAxisRange } from './utils';
import { commonChartOptions } from './chartConfig';
import { createGradient } from '../../utils/colorUtils';

interface BarRaceChartProps {
  dataSeries: DataSeries[];
  colors: string[];
  showGridlines: boolean;
  animationStyle: {
    easing: string;
    updateDuration?: number;
    emphasizeLeader?: boolean;
  };
  showDataLabels: boolean;
  theme: 'light' | 'dark';
}

export const getBarRaceChartOptions = ({
  dataSeries,
  colors,
  showGridlines,
  animationStyle,
  showDataLabels,
  theme
}: BarRaceChartProps): EChartsOption => {
  const isDark = theme === 'dark';
  const yAxisRange = calculateYAxisRange(dataSeries);
  const cornerRadius = 6;

  // Get all unique time points
  const timePoints = Array.from(new Set(
    dataSeries.flatMap(series => series.dataPoints.map(point => point.name))
  )).sort();

  // Prepare initial data
  const initialData = dataSeries.map((series, index) => ({
    name: series.name,
    value: series.dataPoints[0]?.value || 0,
    color: colors[index % colors.length]
  })).sort((a, b) => b.value - a.value);
  const dataPointsCount = dataSeries.length;

  const updateDuration = animationStyle.updateDuration || 1000;

  // Calculate value range for axis
  const allValues = dataSeries.flatMap(s => s.dataPoints.map(d => d.value));
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueRange = maxValue - minValue;
  const padding = valueRange * 0.1;

  return {
    backgroundColor: 'transparent',
    grid: { left: 200, right: 120, top: 50, bottom: 50 },
    xAxis: {
      type: 'value',
      min: Math.max(0, yAxisRange.min - padding),
      max: yAxisRange.max + padding,
      axisLabel: {
        formatter: (value: number) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value,
        color: isDark ? '#d1d5db' : '#374151'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: isDark ? '#4b5563' : '#d1d5db',
          width: 2
        }
      },
      axisTick: {
        show: true,
        length: 5,
        lineStyle: {
          color: isDark ? '#4b5563' : '#d1d5db',
          width: 2
        }
      },
      splitLine: {
        show: showGridlines,
        lineStyle: {
          type: 'dashed',
          color: isDark ? '#374151' : '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: initialData.map(d => d.name),
      inverse: true,
      axisLabel: {
        color: isDark ? '#d1d5db' : '#374151',
        fontSize: 14,
        fontWeight: 500,
        width: 150,
        overflow: 'truncate',
        align: 'right',
        padding: [0, 20, 0, 0]
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: isDark ? '#4b5563' : '#d1d5db',
          width: 2
        }
      },
      axisTick: {
        show: true,
        length: 5,
        lineStyle: {
          color: isDark ? '#4b5563' : '#d1d5db',
          width: 2
        }
      },
      animationDuration: updateDuration,
      animationDurationUpdate: updateDuration / dataPointsCount,
      animationEasing: animationStyle.easing,
      animationEasingUpdate: animationStyle.easing,
    },
    series: [{
      type: 'bar',
      realtimeSort: true,
      seriesLayoutBy: 'column',
      data: initialData.map((d, index) => {
        const [gradientStart, gradientEnd] = createGradient(d.color);
        const isLeader = index === 0 && animationStyle.emphasizeLeader;

        return {
          value: d.value,
          itemStyle: {
            color: new Function(`return {
              type: 'linear',
              x: 0,
              y: 0.5,
              x2: 1,
              y2: 0.5,
              colorStops: [{
                offset: 0,
                color: '${gradientStart}'
              }, {
                offset: 1,
                color: '${gradientEnd}'
              }]
            }`)(),
            borderRadius: isLeader ? cornerRadius * 1.5 : cornerRadius,
            shadowBlur: isLeader ? 10 : 0,
            shadowColor: isLeader ? 'rgba(0,0,0,0.2)' : 'transparent'
          }
        };
      }),
      label: {
        show: showDataLabels,
        position: 'right',
        distance: 10,
        valueAnimation: true,
        color: isDark ? '#e5e7eb' : '#374151',
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        padding: [4, 8],
        borderRadius: 4,
        formatter: (params: any) => {
          const val = params.value;
          return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val;
        }
      },
      itemStyle: {
        borderRadius: cornerRadius
      },
      emphasis: {
        label: {
          fontSize: 16,
          fontWeight: 600,
          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          padding: [6, 10],
          borderRadius: 6
        },
        itemStyle: {
          borderRadius: cornerRadius * 2,
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      },
    }],
    animationDuration: updateDuration * dataPointsCount,
    animationDurationUpdate: updateDuration * dataPointsCount,
    animationEasing: animationStyle.easing,
    animationEasingUpdate: animationStyle.easing,
    tooltip: {
      ...commonChartOptions.tooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const dataPoint = params[0];
        const value = dataPoint.value;
        return `${dataPoint.name}: ${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`;
      },
      textStyle: {
        color: isDark ? '#e5e7eb' : '#374151'
      },
      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? '#4b5563' : '#e5e7eb'
    }
  };
};