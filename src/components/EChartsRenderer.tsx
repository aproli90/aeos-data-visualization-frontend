import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { DataSeries } from '../services/api';
import { getLineAreaChartOptions } from './charts/LineAreaChart';
import { getPieDonutChartOptions } from './charts/PieDonutChart';
import { getBarChartOptions } from './charts/BarChart';
import { getBarRaceChartOptions } from './charts/BarRaceChart';
import { useTheme } from '../contexts/ThemeContext';
import { createGradient } from '../utils/colorUtils';
import { ANIMATION_STYLES, type ChartType } from '../constants/animationStyles';

interface EChartsRendererProps {
  dataSeries: DataSeries[];
  chartType: string;
  animationKey: number;
  colors: string[];
  showGridlines: boolean;
  animationStyle: {
    type: string;
    easing: string;
    duration: number;
    rotate?: number;
    centerPop?: boolean;
    startAngle?: number;
    clockwise?: boolean;
  } | null;
  animationStyleKey: string;
  smoothPoints: boolean;
  showDataLabels: boolean;
  currentSeriesIndex: number;
}

export const EChartsRenderer: React.FC<EChartsRendererProps> = ({ 
  dataSeries, 
  chartType,
  animationKey,
  colors,
  showGridlines,
  animationStyle,
  animationStyleKey,
  smoothPoints,
  showDataLabels,
  currentSeriesIndex
}) => {
  const chartRef = useRef<ReactECharts>(null);
  const { theme } = useTheme();
  const timerRef = useRef<number>();
  const currentIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set data attributes on the container div
    if (containerRef.current) {
      containerRef.current.setAttribute('data-chart-type', chartType);
      containerRef.current.setAttribute('data-animation-style', animationStyleKey || 'default');
    }

    if (chartRef.current) {
      const chart = chartRef.current.getEchartsInstance();
      const isPieOrDonut = chartType === 'pie' || chartType === 'donut';
      const activeDataSeries = isPieOrDonut ? [dataSeries[currentSeriesIndex]] : dataSeries;

      // Get default animation style if none provided
      const defaultStyle = ANIMATION_STYLES[chartType as ChartType]?.[Object.keys(ANIMATION_STYLES[chartType as ChartType])[0]];
      const currentStyle = animationStyle || defaultStyle;

      if (!currentStyle) {
        console.error('Animation style not found');
        return;
      }

      // Calculate total duration based on data points
      const maxPoints = Math.max(...activeDataSeries.map(series => series.dataPoints.length));
      const totalDuration = currentStyle.duration * maxPoints;

      const commonProps = {
        dataSeries: activeDataSeries,
        colors,
        showGridlines,
        animationStyle: {
          ...currentStyle,
          duration: totalDuration,
          delay: currentStyle.delay
        },
        showDataLabels,
        theme
      };

      let options;
      switch (chartType) {
        case 'line':
        case 'area':
          options = getLineAreaChartOptions({
            ...commonProps,
            chartType,
            smoothPoints
          });
          break;
        case 'pie':
        case 'donut':
          options = getPieDonutChartOptions({
            ...commonProps,
            dataSeries: activeDataSeries[0],
            chartType
          });
          break;
        case 'vertical_bar':
        case 'horizontal_bar':
          options = getBarChartOptions({
            ...commonProps,
            chartType
          });
          break;
        case 'bar_race':
          options = getBarRaceChartOptions({
            ...commonProps,
            updateDuration: totalDuration / maxPoints
          });

          // Clear any existing timer
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
          }

          // Get unique time points
          const timePoints = Array.from(new Set(
            dataSeries.flatMap(series => series.dataPoints.map(point => point.name))
          )).sort();

          currentIndexRef.current = 0;
          const updateFrequency = totalDuration / timePoints.length;

          // Start animation loop
          timerRef.current = window.setInterval(() => {
            currentIndexRef.current = (currentIndexRef.current + 1) % timePoints.length;
            const currentTime = timePoints[currentIndexRef.current];

            // Get values for current time point and sort by value
            const values = dataSeries.map((series, index) => ({
              name: series.name,
              value: series.dataPoints.find(p => p.name === currentTime)?.value || 0,
              color: colors[index % colors.length]
            })).sort((a, b) => b.value - a.value);

            const cornerRadius = 6;

            // Update chart with synchronized animations
            chart.setOption({
              yAxis: {
                data: values.map(v => v.name)
              },
              series: [{
                data: values.map((v, idx) => {
                  const [gradientStart, gradientEnd] = createGradient(v.color);
                  const isLeader = idx === 0;

                  return {
                    value: v.value,
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
                })
              }],
              graphic: [{
                type: 'text',
                left: 'center',
                top: 10,
                style: {
                  text: currentTime,
                  fontSize: 16,
                  fontWeight: 'bold',
                  fill: theme === 'dark' ? '#e5e7eb' : '#374151'
                }
              }]
            });

            // Stop after one complete cycle
            if (currentIndexRef.current === timePoints.length - 1) {
              window.clearInterval(timerRef.current);
            }
          }, updateFrequency);
          break;
        default:
          options = {};
      }

      if (options) {
        chart.clear();
        chart.setOption(options, true);
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [animationKey, chartType, colors, showGridlines, animationStyle, smoothPoints, showDataLabels, dataSeries, currentSeriesIndex, theme]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <ReactECharts
        ref={chartRef}
        option={{}}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
        lazyUpdate={false}
        theme={theme === 'dark' ? 'dark' : undefined}
      />
    </div>
  );
};