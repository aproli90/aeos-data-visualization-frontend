import React from 'react';
import { Palette, Wand2, Type, LineChart, BarChart2, PieChart, LayoutList, Activity, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { COLOR_PALETTES, type ColorPalette } from '../constants/colorPalettes';
import { ANIMATION_STYLES, type ChartType } from '../constants/animationStyles';
import { ColorPaletteDropdown } from './ColorPaletteDropdown';
import { SelectWrapper } from './SelectWrapper';
import { useSeriesNavigation } from './EChartsRenderer/hooks/useSeriesNavigation';

interface ChartControlsProps {
  chartType: ChartType;
  colorPalette: ColorPalette;
  colors: string[];
  animationStyle: string;
  smoothPoints: boolean;
  currentSeriesIndex?: number;
  dataSeries?: { name: string }[];
  onChartTypeChange: (type: ChartType) => void;
  onColorPaletteChange: (palette: string, colors: string[]) => void;
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
  colors,
  animationStyle,
  smoothPoints,
  currentSeriesIndex = 0,
  dataSeries = [],
  onChartTypeChange,
  onColorPaletteChange,
  onColorRotate,
  onAnimationStyleChange,
  onSmoothPointsChange,
  onSeriesChange
}) => {
  const {
    navigateNext,
    navigatePrevious,
    totalSeries,
    currentSeries
  } = useSeriesNavigation(dataSeries, currentSeriesIndex);

  const isPieOrDonut = chartType === 'pie' || chartType === 'donut';
  const isLineOrArea = chartType === 'line' || chartType === 'area';

  const handlePrevious = () => {
    if (navigatePrevious() && onSeriesChange) {
      onSeriesChange(currentSeriesIndex > 0 ? currentSeriesIndex - 1 : totalSeries - 1);
    }
  };

  const handleNext = () => {
    if (navigateNext() && onSeriesChange) {
      onSeriesChange(currentSeriesIndex < totalSeries - 1 ? currentSeriesIndex + 1 : 0);
    }
  };

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
          colors={colors}
          onChange={(palette, newColors) => onColorPaletteChange(palette, newColors)}
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

      {isPieOrDonut && totalSeries > 1 && (
        <SelectWrapper icon={<LayoutList className="w-5 h-5" />} label="Data Series">
          <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
            <button
              onClick={handlePrevious}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Previous series"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-200">
              {currentSeries?.name || `Series ${currentSeriesIndex + 1}`}
            </div>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Next series"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </SelectWrapper>
      )}
    </div>
  );
};