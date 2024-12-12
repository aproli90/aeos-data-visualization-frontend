import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { ChartRendererProps } from './types';

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  chartRef,
  options,
  theme
}) => {
  if (!options) {
    return null;
  }

  return (
    <ReactECharts
      ref={chartRef}
      option={options}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      lazyUpdate={false}
      theme={theme === 'dark' ? 'dark' : undefined}
    />
  );
};