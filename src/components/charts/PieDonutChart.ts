import type { EChartsOption } from 'echarts';
import type { DataSeries } from '../../services/api';
import { commonChartOptions, TextStyles } from './chartConfig';
import { hexToRGBA, createGradient } from '../../utils/colorUtils';

interface PieDonutChartProps {
  textStyle: TextStyle;
  dataSeries: DataSeries;
  chartType: 'pie' | 'donut';
  colors: string[];
  showGridlines: boolean;
  animationStyle: {
    type: string;
    easing: string;
    duration: number;
    delay?: number;
    rotate?: number;
    centerPop?: boolean;
    startAngle?: number;
    clockwise?: boolean;
  };
  showDataLabels: boolean;
  theme: 'light' | 'dark';
}

export const getPieDonutChartOptions = ({
  textStyle,
  dataSeries,
  chartType,
  colors,
  animationStyle,
  showDataLabels,
  theme
}: PieDonutChartProps): EChartsOption => {
  const isPie = chartType === 'pie';
  const total = dataSeries.dataPoints.reduce((sum, point) => sum + point.value, 0);
  const isDark = theme === 'dark';
  const borderColor = isDark ? 'rgba(17, 24, 39, 1)' : 'rgba(256, 256, 256, 1)';
  const hoverBorderColor = isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(256, 256, 256, 0.9)';
  
  return {
    backgroundColor: 'transparent',
    title: {
      text: dataSeries.name,
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? '#e5e7eb' : '#374151',
        fontFamily: textStyle?.fontFamily,
      }
    },
    grid: { containLabel: true },
    series: [{
      type: 'pie',
      radius: isPie ? '70%' : ['40%', '70%'],
      center: ['50%', '55%'],
      startAngle: animationStyle.startAngle || 0,
      clockwise: animationStyle.clockwise !== undefined ? animationStyle.clockwise : true,
      itemStyle: {
        borderRadius: 8,
        borderColor,
        borderWidth: 6,
        shadowBlur: 0,
        shadowColor: isDark ? 'rgba(256, 256, 256, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      },
      label: {
        show: showDataLabels,
        position: 'outside',
        formatter: (params: any) => {
          const value = params.value;
          const percentage = ((value / total) * 100).toFixed(1);
          return `${params.name}\n${percentage}%`;
        },
        color: isDark ? '#e5e7eb' : '#374151',
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        padding: [4, 8],
        borderRadius: 4,
        fontFamily: textStyle?.fontFamily,
        fontSize: 14,
        fontWeight: 500,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 4,
        shadowOffsetY: 2
      },
      labelLine: {
        show: showDataLabels,
        length: 20,
        length2: 30,
        smooth: true,
        lineStyle: {
          width: 1.5,
          type: 'solid',
          color: isDark ? '#6b7280' : '#9ca3af'
        }
      },
      emphasis: {
        scale: true,
        scaleSize: 15,
        label: {
          show: showDataLabels,
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: textStyle?.fontFamily,
          formatter: (params: any) => {
            const value = params.value;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${params.name}\n${value} (${percentage}%)`;
          }
        },
        itemStyle: {
          borderRadius: 20,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          borderWidth: 8,
          borderColor: hoverBorderColor
        }
      },
      data: dataSeries.dataPoints.map((point, index) => {
        const baseColor = colors[index % colors.length];
        const [gradientStart, gradientEnd] = createGradient(baseColor);
        
        return {
          name: point.name,
          value: point.value,
          itemStyle: {
            color: new Function(`return {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [{
                offset: 0,
                color: '${gradientStart}'
              }, {
                offset: 1,
                color: '${gradientEnd}'
              }]
            }`)(),
            borderRadius: 8,
            borderWidth: 6,
            borderColor
          }
        };
      }),
      gapWidth: 8,
      animationType: animationStyle.centerPop ? 'scale' : animationStyle.type,
      animationDuration: animationStyle.duration,
      animationEasing: animationStyle.centerPop ? 'elasticOut' : animationStyle.easing,
      animationDelay: (idx: number) => {
        if (animationStyle.centerPop) {
          return idx * (animationStyle.duration / dataSeries.dataPoints.length);
        }
        return animationStyle.delay ? idx * animationStyle.delay : 0;
      },
      animationRotate: animationStyle.centerPop ? undefined : animationStyle.rotate
    }],
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: (params: any) => {
        const value = params.value;
        const percentage = ((value / total) * 100).toFixed(1);
        return `${params.name}<br/>${value} (${percentage}%)`;
      },
      textStyle: {
        color: isDark ? '#e5e7eb' : '#374151'
      },
      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? '#4b5563' : '#e5e7eb'
    }
  };
};