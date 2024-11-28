import type { EChartsOption } from 'echarts';
import type { DataSeries } from '../../services/api';
import { calculateYAxisRange, getAxisLabelOptions, getYAxisLabelConfig } from './utils';
import { commonChartOptions } from './chartConfig';

interface LineAreaChartProps {
  dataSeries: DataSeries[];
  chartType: 'line' | 'area';
  colors: string[];
  whiteBackground: boolean;
  animationStyle: {
    duration: number;
    easing: string;
    delay?: number;
  };
  smoothPoints: boolean;
}

export const getLineAreaChartOptions = ({
  dataSeries,
  chartType,
  colors,
  whiteBackground,
  animationStyle,
  smoothPoints
}: LineAreaChartProps): EChartsOption => {
  const categories = Array.from(new Set(
    dataSeries.flatMap(series => series.dataPoints.map(point => point.name))
  ));

  const yAxisRange = calculateYAxisRange(dataSeries);

  return {
    backgroundColor: whiteBackground ? '#ffffff' : 'transparent',
    grid: { bottom: 80, left: 80, right: 20, top: 20 },
    legend: {
      bottom: 0,
      data: dataSeries.map(series => series.name)
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: getAxisLabelOptions(categories, 800),
      axisLine: {
        lineStyle: { width: 2 }
      },
      axisTick: {
        alignWithLabel: true,
        length: 5,
        lineStyle: { width: 2 }
      }
    },
    yAxis: { 
      type: 'value',
      axisLabel: {
        ...commonChartOptions.textStyle,
        ...getYAxisLabelConfig(yAxisRange.min, yAxisRange.max)
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
    series: dataSeries.map((series, index) => ({
      name: series.name,
      data: categories.map(cat => {
        const point = series.dataPoints.find(p => p.name === cat);
        return point ? point.value : null;
      }),
      type: 'line',
      smooth: smoothPoints,
      symbolSize: 8,
      areaStyle: chartType === 'area' ? {
        opacity: 0.3,
        color: colors[index % colors.length]
      } : undefined,
      lineStyle: {
        width: 3,
        color: colors[index % colors.length]
      },
      itemStyle: {
        color: colors[index % colors.length],
        borderWidth: 2,
        borderColor: '#fff'
      },
      emphasis: {
        ...commonChartOptions.emphasis,
        areaStyle: chartType === 'area' ? {
          opacity: 0.5
        } : undefined,
        itemStyle: {
          borderWidth: 3,
          borderColor: '#fff'
        },
        lineStyle: {
          width: 5
        }
      },
      animationDuration: animationStyle.duration,
      animationEasing: animationStyle.easing,
      animationDelay: (idx: number) => idx * (animationStyle.delay || 100)
    })),
    tooltip: { 
      ...commonChartOptions.tooltip,
      trigger: 'axis'
    }
  };
};