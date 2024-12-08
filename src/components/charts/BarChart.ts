import type { EChartsOption } from 'echarts';
import type { DataSeries } from '../../services/api';
import { calculateYAxisRange, getAxisLabelOptions, getYAxisLabelConfig } from './utils';
import { commonChartOptions } from './chartConfig';
import { createGradient, hexToRGBA } from '../../utils/colorUtils';

interface BarChartProps {
  dataSeries: DataSeries[];
  chartType: 'vertical_bar' | 'horizontal_bar';
  colors: string[];
  showGridlines: boolean;
  animationStyle: {
    duration: number;
    easing: string;
    delay?: number;
  };
  showDataLabels: boolean;
  theme: 'light' | 'dark';
}

export const getBarChartOptions = ({
  dataSeries,
  chartType,
  colors,
  showGridlines,
  animationStyle,
  showDataLabels,
  theme
}: BarChartProps): EChartsOption => {
  const categories = Array.from(new Set(
    dataSeries.flatMap(series => series.dataPoints.map(point => point.name))
  ));

  const isHorizontal = chartType === 'horizontal_bar';
  const isSingleSeries = dataSeries.length === 1;
  const barGap = '30%';
  const barCategoryGap = '20%';
  const cornerRadius = 6;
  const yAxisRange = calculateYAxisRange(dataSeries);
  const isDark = theme === 'dark';

  return {
    backgroundColor: 'transparent',
    grid: isHorizontal
      ? { left: 150, right: 60, top: 20, bottom: 80 }
      : { bottom: 80, left: 80, right: 60, top: 40 },
    legend: {
      bottom: 0,
      data: dataSeries.map((series, index) => ({
        name: series.name,
        itemStyle: {
          color: colors[index % colors.length]
        }
      })),
      show: !isSingleSeries,
      textStyle: {
        color: isDark ? '#e5e7eb' : '#374151'
      }
    },
    [isHorizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: categories,
      axisLabel: isHorizontal 
        ? { ...commonChartOptions.textStyle, width: 120, color: isDark ? '#d1d5db' : '#374151' }
        : getAxisLabelOptions(categories, 800, isDark),
      axisLine: {
        lineStyle: { 
          width: 2,
          color: isDark ? '#d1d5db' : '#4b5563'
        }
      },
      axisTick: {
        alignWithLabel: true,
        length: 5,
        lineStyle: { 
          width: 2,
          color: isDark ? '#d1d5db' : '#4b5563'
        }
      }
    },
    [isHorizontal ? 'xAxis' : 'yAxis']: { 
      type: 'value',
      axisLabel: {
        ...commonChartOptions.textStyle,
        ...getYAxisLabelConfig(isDark),
        color: isDark ? '#d1d5db' : '#374151'
      },
      min: yAxisRange.min,
      max: yAxisRange.max,
      axisLine: {
        lineStyle: { 
          width: 2,
          color: isDark ? '#d1d5db' : '#4b5563'
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
    series: dataSeries.map((series, seriesIndex) => ({
      name: series.name,
      data: categories.map((cat, categoryIndex) => {
        const point = series.dataPoints.find(p => p.name === cat);
        const value = point ? point.value : null;
        
        const colorIndex = isSingleSeries ? categoryIndex : seriesIndex;
        const baseColor = colors[colorIndex % colors.length];
        const [gradientStart, gradientEnd] = createGradient(baseColor);
        
        return {
          value,
          itemStyle: {
            color: new Function(`return {
              type: 'linear',
              x: 0,
              y: ${isHorizontal ? '0.5' : '1'},
              x2: ${isHorizontal ? '1' : '0'},
              y2: ${isHorizontal ? '0.5' : '0'},
              colorStops: [{
                offset: 0,
                color: '${gradientStart}'
              }, {
                offset: 1,
                color: '${gradientEnd}'
              }]
            }`)()
          },
          label: {
            show: showDataLabels,
            position: isHorizontal ? 'right' : 'top',
            distance: isHorizontal ? 5 : 8,
            fontSize: 14,
            fontWeight: 500,
            color: isDark ? '#e5e7eb' : '#374151',
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            padding: [4, 8],
            borderRadius: 4,
            formatter: (params: any) => {
              const val = params.value;
              return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val;
            }
          }
        };
      }),
      type: 'bar',
      barGap,
      barCategoryGap,
      itemStyle: {
        borderRadius: isHorizontal 
          ? [0, cornerRadius, cornerRadius, 0] 
          : [cornerRadius, cornerRadius, 0, 0]
      },
      emphasis: {
        ...commonChartOptions.emphasis,
        label: {
          show: showDataLabels,
          fontSize: 16,
          fontWeight: 600,
          color: isDark ? '#e5e7eb' : '#374151',
          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          padding: [6, 10],
          borderRadius: 6
        },
        itemStyle: {
          borderRadius: isHorizontal 
            ? [0, cornerRadius * 2, cornerRadius * 2, 0] 
            : [cornerRadius * 2, cornerRadius * 2, 0, 0]
        }
      },
      animationDuration: animationStyle.duration,
      animationEasing: animationStyle.easing,
      animationDelay: (idx: number) => idx * (animationStyle.delay || 100)
    })),
    tooltip: { 
      ...commonChartOptions.tooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      textStyle: {
        color: isDark ? '#e5e7eb' : '#374151'
      },
      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? '#4b5563' : '#e5e7eb'
    }
  };
};