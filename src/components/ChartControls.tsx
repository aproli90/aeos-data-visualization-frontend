import React from 'react';
import { Palette, Wand2, Type, LineChart, BarChart2, PieChart, LayoutList, Activity } from 'lucide-react';
import { COLOR_PALETTES, type ColorPalette } from '../constants/colorPalettes';
import { ANIMATION_STYLES, type ChartType, type AnimationStyle } from '../constants/animationStyles';

interface ChartControlsProps {
  chartType: ChartType;
  colorPalette: ColorPalette;
  animationStyle: string;
  smoothPoints: boolean;
  onChartTypeChange: (type: ChartType) => void;
  onColorPaletteChange: (palette: ColorPalette) => void;
  onAnimationStyleChange: (style: string) => void;
  onSmoothPointsChange: (smooth: boolean) => void;
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
  onChartTypeChange,
  onColorPaletteChange,
  onAnimationStyleChange,
  onSmoothPointsChange
}) => {
  const SelectWrapper = ({ icon: Icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <div className="text-gray-500">
          {Icon}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SelectWrapper icon={<Palette className="w-5 h-5" />}>
        <select
          value={colorPalette}
          onChange={(e) => onColorPaletteChange(e.target.value as ColorPalette)}
          className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-indigo-300"
        >
          {Object.keys(COLOR_PALETTES).map(palette => (
            <option key={palette} value={palette}>
              {palette.charAt(0).toUpperCase() + palette.slice(1)}
            </option>
          ))}
        </select>
      </SelectWrapper>

      <SelectWrapper icon={<Wand2 className="w-5 h-5" />}>
        <select
          value={animationStyle}
          onChange={(e) => onAnimationStyleChange(e.target.value)}
          className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-indigo-300"
        >
          {Object.entries(ANIMATION_STYLES[chartType]).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </select>
      </SelectWrapper>

      {(chartType === 'line' || chartType === 'area') && (
        <SelectWrapper icon={<Type className="w-5 h-5" />}>
          <select
            value={smoothPoints ? 'smooth' : 'straight'}
            onChange={(e) => onSmoothPointsChange(e.target.value === 'smooth')}
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-indigo-300"
          >
            <option value="smooth">Smooth</option>
            <option value="straight">Straight</option>
          </select>
        </SelectWrapper>
      )}

      <SelectWrapper icon={<ChartIcon type={chartType} />}>
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
          className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-indigo-300"
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