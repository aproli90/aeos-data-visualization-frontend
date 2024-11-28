import type { EChartsOption } from 'echarts';
import type { DataSeries } from '../../services/api';
import { calculateYAxisRange, getAxisLabelOptions, getYAxisLabelConfig } from './utils';
import { commonChartOptions } from './chartConfig';

interface BarChartProps {
  dataSeries: DataSeries[];
  chartType: 'vertical_bar' | 'horizontal_bar';
  colors: string[];
  whiteBackground: boolean;
  animationStyle: {
    duration: number;
    easing: string;
    delay?: number;
  };
}

export const getBarChartOptions = ({
  dataSeries,
  chartType,
  colors,
  whiteBackground,
  animationStyle
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

  return {
    backgroundColor: whiteBackground ? '#ffffff' : 'transparent',
    grid: isHorizontal
      ? { left: 150, right: 20, top: 20, bottom: 80 }
      : { bottom: 80, left: 80, right: 20, top: 20 },
    legend: {
      bottom: 0,
      data: dataSeries.map(series => series.name),
      show: !isSingleSeries // Only show legend for multiple series
    },
    [isHorizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: categories,
      axisLabel: isHorizontal 
        ? { width: 120, ...commonChartOptions.textStyle }
        : getAxisLabelOptions(categories, 800),
      axisLine: {
        lineStyle: { width: 2 }
      },
      axisTick: {
        alignWithLabel: true,
        length: 5,
        lineStyle: { width: 2 }
      }
    },
    [isHorizontal ? 'xAxis' : 'yAxis']: { 
      type: 'value',
      axisLabel: {
        ...commonChartOptions.textStyle,
        ...getYAxisLabelConfig()
      },
      min: yAxisRange.min,
      max: yAxisRange.max,
      axisLine: {
        lineStyle: { width: 2 }
      },
      splitLine: {
        lineStyle: { type: 'dashed' }
      }
    },
    series: dataSeries.map((series, seriesIndex) => ({
      name: series.name,
      data: categories.map((cat, categoryIndex) => {
        const point = series.dataPoints.find(p => p.name === cat);
        const value = point ? point.value : null;
        
        // For single series, use different colors for each bar
        // For multiple series, use same color for all bars in a series
        const colorIndex = isSingleSeries ? categoryIndex : seriesIndex;
        
        return {
          value,
          itemStyle: {
            color: colors[colorIndex % colors.length]
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
        itemStyle: {
          borderRadius: isHorizontal 
            ? [0, cornerRadius * 2, cornerRadius * 2, 0] 
            : [cornerRadius * 2, cornerRadius * 2, 0, 0],
          borderWidth: 2,
          borderColor: '#fff'
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
      }
    }
  };
};