import React from 'react';
import { Palette, Wand2, Type, LineChart, BarChart2, PieChart, LayoutList, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { COLOR_PALETTES, type ColorPalette } from '../constants/colorPalettes';
import { ANIMATION_STYLES, type ChartType, type AnimationStyle } from '../constants/animationStyles';

interface ChartControlsProps {
  chartType: ChartType;
  colorPalette: ColorPalette;
  animationStyle: string;
  smoothPoints: boolean;
  currentSeriesIndex?: number;
  totalSeries?: number;
  onChartTypeChange: (type: ChartType) => void;
  onColorPaletteChange: (palette: ColorPalette) => void;
  onAnimationStyleChange: (style: string) => void;
  onSmoothPointsChange: (smooth: boolean) => void;
  onSeriesChange?: (index: number) => void;
}

const ChartIcon = ({ type }: { type: ChartType }) => {
  switch (type) {
    case 'line':
      return <LineChart className="w-5 h-5" />;
    case 'area':
      return <Activity className="w-5 h-5" />;
    case 'pie':
      return <PieChart className="w-5 h-5" />;
    case 'donut':
      return <PieChart className="w-5 h-5" />;
    case 'vertical_bar':
      return <BarChart2 className="w-5 h-5" />;
    case 'horizontal_bar':
      return <LayoutList className="w-5 h-5" />;
    default:
      return <BarChart2 className="w-5 h-5" />;
  }
};

export const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  colorPalette,
  animationStyle,
  smoothPoints,
  currentSeriesIndex = 0,
  totalSeries = 1,
  onChartTypeChange,
  onColorPaletteChange,
  onAnimationStyleChange,
  onSmoothPointsChange,
  onSeriesChange
}) => {
  const SelectWrapper = ({ icon: Icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3">
        <div className="text-gray-500">{Icon}</div>
        <label className="text-sm font-medium text-gray-600">{label}</label>
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );

  const isPieOrDonut = chartType === 'pie' || chartType === 'donut';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <SelectWrapper icon={<Palette className="w-5 h-5" />} label="Color Theme">
        <select
          value={colorPalette}
          onChange={(e) => onColorPaletteChange(e.target.value as ColorPalette)}
          className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-indigo-300"
        >
          {Object.keys(COLOR_PALETTES).map(palette => (
            <option key={palette} value={palette}>
              {palette.charAt(0).toUpperCase() + palette.slice(1)}
            </option>
          ))}
        </select>
      </SelectWrapper>

      <SelectWrapper icon={<Wand2 className="w-5 h-5" />} label="Animation Style">
        <select
          value={animationStyle}
          onChange={(e) => onAnimationStyleChange(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-indigo-300"
        >
          {Object.entries(ANIMATION_STYLES[chartType]).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </select>
      </SelectWrapper>

      {(chartType === 'line' || chartType === 'area') && (
        <SelectWrapper icon={<Type className="w-5 h-5" />} label="Line Style">
          <select
            value={smoothPoints ? 'smooth' : 'straight'}
            onChange={(e) => onSmoothPointsChange(e.target.value === 'smooth')}
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-indigo-300"
          >
            <option value="smooth">Smooth</option>
            <option value="straight">Straight</option>
          </select>
        </SelectWrapper>
      )}

      {isPieOrDonut && totalSeries > 1 && (
        <SelectWrapper icon={<LayoutList className="w-5 h-5" />} label="Data Series">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSeriesChange?.(currentSeriesIndex > 0 ? currentSeriesIndex - 1 : totalSeries - 1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous series"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 text-center text-sm font-medium text-gray-700">
              Series {currentSeriesIndex + 1} of {totalSeries}
            </div>
            <button
              onClick={() => onSeriesChange?.(currentSeriesIndex < totalSeries - 1 ? currentSeriesIndex + 1 : 0)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Next series"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </SelectWrapper>
      )}

      <SelectWrapper icon={<ChartIcon type={chartType} />} label="Chart Type">
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
          className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-indigo-300"
        >
          <option value="line">Line Chart</option>
          <option value="area">Area Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="donut">Donut Chart</option>
          <option value="vertical_bar">Vertical Bar</option>
          <option value="horizontal_bar">Horizontal Bar</option>
        </select>
      </SelectWrapper>
    </div>
  );
};