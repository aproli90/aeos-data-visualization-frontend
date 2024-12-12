import type { DataSeries } from '../../services/api';
import type { ChartType } from '../../constants/animationStyles';
import type { ChartFont } from '../../constants/fonts';
import type { MutableRefObject } from 'react';
import type ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

export interface AnimationStyle {
  type: string;
  easing: string;
  duration: number;
  rotate?: number;
  centerPop?: boolean;
  startAngle?: number;
  clockwise?: boolean;
}

export interface EChartsRendererProps {
  dataSeries: DataSeries[];
  chartType: string;
  animationKey: number;
  colors: string[];
  showGridlines: boolean;
  animationStyle: AnimationStyle | null;
  animationStyleKey: string;
  smoothPoints: boolean;
  showDataLabels: boolean;
  currentSeriesIndex: number;
  font: ChartFont;
}

export interface ChartState {
  timePoints: string[];
  currentIndex: number;
  updateFrequency: number;
}

export interface ChartConfig {
  dataSeries: DataSeries[];
  colors: string[];
  showGridlines: boolean;
  animationStyle: AnimationStyle;
  showDataLabels: boolean;
  theme: 'light' | 'dark';
  font: ChartFont;
}

export interface ChartContainerProps {
  children: React.ReactNode;
  chartType: string;
  animationStyleKey: string;
  containerRef: MutableRefObject<HTMLDivElement | null>;
}

export interface ChartRendererProps {
  chartRef: MutableRefObject<ReactECharts | null>;
  options: EChartsOption | null;
  theme: 'light' | 'dark';
}