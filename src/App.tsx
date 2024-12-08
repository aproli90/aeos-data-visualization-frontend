import React, { useState, useEffect, useRef } from 'react';
import { EChartsRenderer } from './components/EChartsRenderer';
import { TextInput } from './components/TextInput';
import { ChartControls } from './components/ChartControls';
import { ChartActions } from './components/ChartActions';
import { AuthorCredits } from './components/AuthorCredits';
import { RecordingOverlay } from './components/RecordingOverlay';
import { ThemeToggle } from './components/ThemeToggle';
import { ResizableChartContainer } from './components/ResizableChartContainer';
import { analyzeText, type ChartData } from './services/api';
import { COLOR_PALETTES, type ColorPalette } from './constants/colorPalettes';
import { ANIMATION_STYLES, type ChartType } from './constants/animationStyles';
import { BarChart2, LineChart, PieChart } from 'lucide-react';
import { rotateColors } from './utils/colorUtils';
import { useTheme } from './contexts/ThemeContext';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [colorPalette, setColorPalette] = useState<ColorPalette>('modern');
  const [showGridlines, setShowGridlines] = useState(true);
  const [animationStyle, setAnimationStyle] = useState('');
  const [smoothPoints, setSmoothPoints] = useState(true);
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const [colors, setColors] = useState(COLOR_PALETTES[colorPalette]);
  const chartSectionRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (chartData) {
      const chartType = chartData.recommendedChartType as ChartType;
      const styles = ANIMATION_STYLES[chartType];
      if (styles) {
        const defaultStyle = Object.keys(styles)[0];
        setAnimationStyle(defaultStyle);
      }
      
      setCurrentSeriesIndex(0);
      chartSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [chartData]);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await analyzeText(input);
      setChartData(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
    setLoading(false);
  };

  const handleRecordingComplete = (url: string | null) => {
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chart-animation.webm';
      a.click();
      URL.revokeObjectURL(url);
    }
    setIsRecording(false);
  };

  const handleReplay = () => {
    setAnimationKey(prev => prev + 1);
  };

  const handleExport = () => {
    setAnimationKey(prev => prev + 1);
    setIsRecording(true);
  };

  const handleColorPaletteChange = (palette: ColorPalette) => {
    setColorPalette(palette);
    setColors(COLOR_PALETTES[palette]);
    setAnimationKey(prev => prev + 1);
  };

  const handleColorRotate = () => {
    const rotatedColors = rotateColors([...colors]);
    COLOR_PALETTES[colorPalette] = rotatedColors;
    setColors(rotatedColors);
    setAnimationKey(prev => prev + 1);
  };

  const handleSeriesChange = (index: number) => {
    setCurrentSeriesIndex(index);
    setAnimationKey(prev => prev + 1);
  };

  const getCurrentAnimationStyle = () => {
    if (!chartData) return null;
    const chartType = chartData.recommendedChartType as ChartType;
    const styles = ANIMATION_STYLES[chartType];
    return styles?.[animationStyle as keyof typeof styles] || Object.values(styles)[0];
  };

  const isPieOrDonut = chartData?.recommendedChartType === 'pie' || chartData?.recommendedChartType === 'donut';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-12">
            <img src="/chart-genie-logo2.png" alt="Chart Genie" className="h-32" />
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Transform data stories into beautiful visualizations</p>
          </div>

          <div className="relative">
            <TextInput
              input={input}
              loading={loading}
              error={error}
              onInputChange={setInput}
              onAnalyze={handleAnalyze}
            />
            
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-30">
              <BarChart2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <LineChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <PieChart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
          </div>

          {chartData && (
            <div ref={chartSectionRef} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300 mb-6">{chartData.chartTypeExplanation}</p>
                
                <ChartControls
                  chartType={chartData.recommendedChartType as ChartType}
                  colorPalette={colorPalette}
                  animationStyle={animationStyle}
                  smoothPoints={smoothPoints}
                  showGridlines={showGridlines}
                  currentSeriesIndex={currentSeriesIndex}
                  totalSeries={chartData.dataSeries.length}
                  onChartTypeChange={(type) => setChartData({ ...chartData, recommendedChartType: type })}
                  onColorPaletteChange={handleColorPaletteChange}
                  onColorRotate={handleColorRotate}
                  onAnimationStyleChange={setAnimationStyle}
                  onSmoothPointsChange={setSmoothPoints}
                  onShowGridlinesChange={setShowGridlines}
                  onSeriesChange={handleSeriesChange}
                />
              </div>

              <div className="relative">
                <ResizableChartContainer>
                  <div ref={chartContainerRef} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg h-full">
                    <EChartsRenderer
                      dataSeries={chartData.dataSeries}
                      currentSeriesIndex={currentSeriesIndex}
                      chartType={chartData.recommendedChartType}
                      animationKey={animationKey}
                      colors={colors}
                      showGridlines={showGridlines}
                      animationStyle={getCurrentAnimationStyle()}
                      smoothPoints={smoothPoints}
                      showDataLabels={showDataLabels}
                    />
                  </div>
                </ResizableChartContainer>

                <ChartActions
                  isRecording={isRecording}
                  showDataLabels={showDataLabels}
                  showGridlines={showGridlines}
                  onReplay={handleReplay}
                  onExport={handleExport}
                  onDataLabelsChange={setShowDataLabels}
                  onShowGridlinesChange={setShowGridlines}
                  isPieOrDonut={isPieOrDonut}
                />

                <RecordingOverlay
                  targetRef={chartContainerRef}
                  isRecording={isRecording}
                  onRecordingComplete={handleRecordingComplete}
                  dataSeries={chartData.dataSeries}
                />
              </div>
            </div>
          )}

          <AuthorCredits />
        </div>
      </div>
    </div>
  );
}