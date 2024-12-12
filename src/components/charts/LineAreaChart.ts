import type { EChartsOption } from 'echarts';
import type { DataSeries } from '../../services/api';
import { calculateYAxisRange, getAxisLabelOptions, getYAxisLabelConfig } from './utils';
import { TextStyle, commonChartOptions } from './chartConfig';
import { createGradient, hexToRGBA } from '../../utils/colorUtils';

interface LineAreaChartProps {
  textStyle: TextStyle;
  dataSeries: DataSeries[];
  chartType: 'line' | 'area';
  colors: string[];
  showGridlines: boolean;
  animationStyle: {
    duration: number;
    easing: string;
    delay?: number;
  };
  smoothPoints: boolean;
  showDataLabels: boolean;
  theme: 'light' | 'dark';
}

export const getLineAreaChartOptions = ({
  textStyle,
  dataSeries,
  chartType,
  colors,
  showGridlines,
  animationStyle,
  smoothPoints,
  showDataLabels,
  theme
}: LineAreaChartProps): EChartsOption => {
  const categories = Array.from(new Set(
    dataSeries.flatMap(series => series.dataPoints.map(point => point.name))
  ));

  const yAxisRange = calculateYAxisRange(dataSeries);
  const isDark = theme === 'dark';

  const generateSeriesData = (series: DataSeries) => 
    categories.map(cat => {
      const point = series.dataPoints.find(p => p.name === cat);
      return point ? point.value : null;
    });

  return {
    backgroundColor: 'transparent',
    grid: { bottom: 80, left: 80, right: 60, top: 40 },
    legend: {
      bottom: 0,
      data: dataSeries.map(series => series.name),
      textStyle: {
        color: isDark ? '#e5e7eb' : '#374151',
        fontFamily: textStyle?.fontFamily
      }
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        ...getAxisLabelOptions(categories, 800, isDark),
        fontFamily: textStyle?.fontFamily
      },
      axisLine: {
        lineStyle: { 
          width: 2,
          color: isDark ? '#4b5563' : '#d1d5db'
        }
      },
      axisTick: {
        alignWithLabel: true,
        length: 5,
        lineStyle: { 
          width: 2,
          color: isDark ? '#4b5563' : '#d1d5db'
        }
      }
    },
    yAxis: { 
      type: 'value',
      axisLabel: {
        ...commonChartOptions.textStyle,
        ...getYAxisLabelConfig(isDark),
        color: isDark ? '#d1d5db' : '#374151',
        fontFamily: textStyle?.fontFamily,
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
    series: dataSeries.flatMap((series, index) => {
      const baseColor = colors[index % colors.length];
      const seriesData = generateSeriesData(series);

      const decorativeSeries = chartType === 'line' ? [{
        name: `${series.name}_bar`,
        type: 'bar',
        barGap: '-100%',
        barWidth: 10,
        itemStyle: {
          color: new Function(`return {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [{
              offset: 0,
              color: '${hexToRGBA(baseColor, 0.5)}'
            }, {
              offset: 0.2,
              color: '${hexToRGBA(baseColor, 0.2)}'
            }, {
              offset: 1,
              color: '${hexToRGBA(baseColor, 0)}'
            }]
          }`)()
        },
        z: -12,
        data: seriesData.map(val => {
          if (val === null) return null;
          return {
            value: val,
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            }
          };
        }),
        animationDuration: animationStyle.duration * 0.6,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * (animationStyle.delay || 30),
        silent: true
      }] : [];

      const mainSeries = {
        name: series.name,
        data: seriesData,
        type: 'line',
        smooth: smoothPoints,
        symbolSize: 8,
        areaStyle: chartType === 'area' ? {
          opacity: 0.3,
          color: new Function(`return {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [{
              offset: 0,
              color: '${hexToRGBA(baseColor, 0.3)}'
            }, {
              offset: 1,
              color: '${hexToRGBA(baseColor, 0.8)}'
            }]
          }`)()
        } : undefined,
        label: {
          show: showDataLabels,
          position: 'top',
          distance: 10,
          fontSize: 14,
          fontWeight: 500,
          fontFamily: textStyle?.fontFamily,
          color: isDark ? '#e5e7eb' : '#374151',
          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          padding: [4, 8],
          borderRadius: 4,
          formatter: (params: any) => {
            const val = params.value;
            return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val;
          }
        },
        lineStyle: {
          width: 3,
          color: baseColor
        },
        itemStyle: {
          color: baseColor,
          borderWidth: 2,
          borderColor: isDark ? '#111827' : '#ffffff'
        },
        emphasis: {
          ...commonChartOptions.emphasis,
          label: {
            show: showDataLabels,
            fontSize: 16,
            fontWeight: 600,
            fontFamily: textStyle?.fontFamily,
            color: isDark ? '#e5e7eb' : '#374151',
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            padding: [6, 10],
            borderRadius: 6
          },
          itemStyle: {
            borderWidth: 3,
            borderColor: isDark ? '#1f2937' : '#ffffff'
          },
          lineStyle: {
            width: 5
          }
        },
        animationDuration: animationStyle.duration,
        animationEasing: animationStyle.easing,
        animationDelay: (idx: number) => idx * (animationStyle.delay || 100)
      };

      return [...decorativeSeries, mainSeries];
    }),
    tooltip: { 
      ...commonChartOptions.tooltip,
      trigger: 'axis',
      textStyle: {
        color: isDark ? '#e5e7eb' : '#374151'
      },
      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? '#4b5563' : '#e5e7eb'
    }
  };
};