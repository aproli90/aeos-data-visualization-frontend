import React from 'react';
import { Palette, Wand2, Type, LineChart, BarChart2, PieChart, LayoutList, Activity, TrendingUp } from 'lucide-react';
import { COLOR_PALETTES, type ColorPalette } from '../constants/colorPalettes';
import { ANIMATION_STYLES, type ChartType } from '../constants/animationStyles';
import { ColorPaletteDropdown } from './ColorPaletteDropdown';
import { SelectWrapper } from './SelectWrapper';

interface ChartControlsProps {
  chartType: ChartType;
  colorPalette: ColorPalette;
  animationStyle: string;
  smoothPoints: boolean;
  currentSeriesIndex?: number;
  totalSeries?: number;
  onChartTypeChange: (type: ChartType) => void;
  onColorPaletteChange: (palette: ColorPalette) => void;
  onColorRotate: () => void;
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
    case 'bar_race':
      return <TrendingUp className="w-5 h-5" />;
    default:
      return <BarChart2 className="w-5 h-5" />;
  }
};

const chartGroups = [
  {
    label: 'Line Charts',
    options: [
      { value: 'line', label: 'Line Chart' },
      { value: 'area', label: 'Area Chart' }
    ]
  },
  {
    label: 'Bar Charts',
    options: [
      { value: 'vertical_bar', label: 'Vertical Bar' },
      { value: 'horizontal_bar', label: 'Horizontal Bar' },
      { value: 'bar_race', label: 'Racing Bar' }
    ]
  },
  {
    label: 'Circular Charts',
    options: [
      { value: 'pie', label: 'Pie Chart' },
      { value: 'donut', label: 'Donut Chart' }
    ]
  }
];

export const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  colorPalette,
  animationStyle,
  smoothPoints,
  currentSeriesIndex = 0,
  totalSeries = 1,
  onChartTypeChange,
  onColorPaletteChange,
  onColorRotate,
  onAnimationStyleChange,
  onSmoothPointsChange,
  onSeriesChange
}) => {
  const isPieOrDonut = chartType === 'pie' || chartType === 'donut';
  const isLineOrArea = chartType === 'line' || chartType === 'area';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <SelectWrapper 
        icon={<ChartIcon type={chartType} />} 
        label="Chart Type"
      >
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
          className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-200"
        >
          {chartGroups.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </SelectWrapper>

      <SelectWrapper 
        icon={<Palette className="w-5 h-5" />} 
        label="Color Theme"
        onRotate={onColorRotate}
        showRotateButton={true}
      >
        <ColorPaletteDropdown
          value={colorPalette}
          onChange={onColorPaletteChange}
        />
      </SelectWrapper>

      <SelectWrapper icon={<Wand2 className="w-5 h-5" />} label="Animation Style">
        <select
          value={animationStyle}
          onChange={(e) => onAnimationStyleChange(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-200"
        >
          {Object.entries(ANIMATION_STYLES[chartType]).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </select>
      </SelectWrapper>

      {isLineOrArea && (
        <SelectWrapper icon={<Type className="w-5 h-5" />} label="Line Style">
          <select
            value={smoothPoints ? 'smooth' : 'straight'}
            onChange={(e) => onSmoothPointsChange(e.target.value === 'smooth')}
            className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-200"
          >
            <option value="smooth">Smooth</option>
            <option value="straight">Straight</option>
          </select>
        </SelectWrapper>
      )}
    </div>
  );
};