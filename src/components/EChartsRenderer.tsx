import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { DataSeries } from '../services/api';
import { getLineAreaChartOptions } from './charts/LineAreaChart';
import { getPieDonutChartOptions } from './charts/PieDonutChart';
import { getBarChartOptions } from './charts/BarChart';

interface EChartsRendererProps {
  dataSeries: DataSeries[];
  chartType: string;
  animationKey: number;
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
  smoothPoints: boolean;
  currentSeriesIndex: number;
}

export const EChartsRenderer: React.FC<EChartsRendererProps> = ({ 
  dataSeries, 
  chartType,
  animationKey,
  colors,
  whiteBackground,
  animationStyle,
  smoothPoints,
  currentSeriesIndex
}) => {
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.getEchartsInstance();
      chart.clear();
      chart.setOption(getChartOptions());
    }
  }, [animationKey, chartType, colors, whiteBackground, animationStyle, smoothPoints, dataSeries, currentSeriesIndex]);

  const getChartOptions = () => {
    const isPieOrDonut = chartType === 'pie' || chartType === 'donut';
    const activeDataSeries = isPieOrDonut ? [dataSeries[currentSeriesIndex]] : dataSeries;

    switch (chartType) {
      case 'line':
      case 'area':
        return getLineAreaChartOptions({
          dataSeries: activeDataSeries,
          chartType,
          colors,
          whiteBackground,
          animationStyle,
          smoothPoints
        });

      case 'pie':
      case 'donut':
        return getPieDonutChartOptions({
          dataSeries: activeDataSeries[0],
          chartType,
          colors,
          whiteBackground,
          animationStyle
        });

      case 'vertical_bar':
      case 'horizontal_bar':
        return getBarChartOptions({
          dataSeries: activeDataSeries,
          chartType,
          colors,
          whiteBackground,
          animationStyle
        });

      default:
        return {};
    }
  };

  return (
    <ReactECharts
      ref={chartRef}
      option={getChartOptions()}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      lazyUpdate={false}
    />
  );
};