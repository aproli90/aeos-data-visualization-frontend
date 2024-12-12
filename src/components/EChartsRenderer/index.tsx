import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useChartOptions } from './hooks/useChartOptions';
import { useDataValidation } from './hooks/useDataValidation';
import { useBarRaceAnimation } from './hooks/useBarRaceAnimation';
import { ChartErrorBoundary } from './ErrorBoundary';
import { ChartContainer } from './ChartContainer';
import { ChartRenderer } from './ChartRenderer';
import type { EChartsRendererProps } from './types';

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
  currentSeriesIndex,
  font
}) => {
  const chartRef = useRef<ReactECharts>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Validate data and get active series
  const activeDataSeries = useDataValidation(dataSeries, chartType, currentSeriesIndex);

  // Generate chart options
  const chartOptions = useChartOptions(
    chartType,
    {
      dataSeries: activeDataSeries,
      colors,
      showGridlines,
      animationStyle: animationStyle || {
        type: 'linear',
        easing: 'linear',
        duration: 1000
      },
      showDataLabels,
      theme,
      font
    },
    smoothPoints
  );

  // Log chart options for debugging
  useEffect(() => {
    console.log('[EChartsRenderer] Chart options:', {
      chartType,
      font,
      theme,
      hasOptions: !!chartOptions,
      textStyle: chartOptions?.textStyle
    });
  }, [chartOptions, chartType, font, theme]);

  // Handle bar race animation
  useBarRaceAnimation(
    chartType === 'bar_race' ? chartRef.current?.getEchartsInstance() : null,
    activeDataSeries,
    colors,
    chartType === 'bar_race' ? animationStyle : null,
    theme,
    animationKey,
    font
  );

  // Update chart when options change
  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance();
    if (chart && chartOptions && chartType !== 'bar_race') {
      chart.clear();
      chart.setOption(chartOptions, true);
    }
  }, [chartOptions, animationKey, chartType]);

  return (
    <ChartErrorBoundary>
      <ChartContainer
        chartType={chartType}
        animationStyleKey={animationStyleKey}
        containerRef={containerRef}
      >
        <ChartRenderer
          chartRef={chartRef}
          options={chartOptions}
          theme={theme}
        />
      </ChartContainer>
    </ChartErrorBoundary>
  );
};