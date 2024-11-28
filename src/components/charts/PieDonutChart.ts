import type { EChartsOption } from 'echarts';
import type { DataSeries } from '../../services/api';
import { commonChartOptions } from './chartConfig';

interface PieDonutChartProps {
  dataSeries: DataSeries;
  chartType: 'pie' | 'donut';
  colors: string[];
  whiteBackground: boolean;
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
}

export const getPieDonutChartOptions = ({
  dataSeries,
  chartType,
  colors,
  whiteBackground,
  animationStyle
}: PieDonutChartProps): EChartsOption => {
  const isPie = chartType === 'pie';
  
  return {
    backgroundColor: whiteBackground ? '#ffffff' : 'transparent',
    title: {
      text: dataSeries.name,
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: 500,
        color: '#374151'
      }
    },
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: isPie ? '70%' : ['40%', '70%'],
      center: ['50%', '55%'], // Moved down slightly to accommodate title
      startAngle: animationStyle.startAngle || 0,
      clockwise: animationStyle.clockwise !== undefined ? animationStyle.clockwise : true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {d}%',
        position: 'outside',
        fontSize: 14,
        fontWeight: 500,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: [4, 8],
        borderRadius: 4
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 30,
        smooth: true
      },
      emphasis: {
        scale: true,
        scaleSize: 15,
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          backgroundColor: '#fff',
          padding: [6, 10],
          borderRadius: 4,
          shadowBlur: 4,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      },
      data: dataSeries.dataPoints.map((point, index) => ({
        name: point.name,
        value: point.value,
        itemStyle: { color: colors[index % colors.length] }
      })),
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
    }]
  };
};