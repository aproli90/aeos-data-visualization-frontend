import React, { useState, useEffect, useRef } from 'react';
import { EChartsRenderer } from './components/EChartsRenderer';
import { TextInput } from './components/TextInput';
import { ChartControls } from './components/ChartControls';
import { ChartActions } from './components/ChartActions';
import { AuthorCredits } from './components/AuthorCredits';
import { RecordingOverlay } from './components/RecordingOverlay';
import { ThemeToggle } from './components/ThemeToggle';
import { FontToggle } from './components/FontSelector/FontToggle';
import { ResizableChartContainer } from './components/ResizableChartContainer';
import { DataEditor } from './components/DataEditor';
import { analyzeText, type ChartData } from './services/api';
import { useColorPalette } from './hooks/useColorPalette';
import { useChartFont } from './hooks/useChartFont';
import { useAnimationStyle } from './hooks/useAnimationStyle';
import { type ChartType } from './constants/animationStyles';
import { useTheme } from './contexts/ThemeContext';

export default function App() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [smoothPoints, setSmoothPoints] = useState(true);
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [showGridlines, setShowGridlines] = useState(true);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const chartSectionRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { font, setFont } = useChartFont();

  const { 
    colorPalette, 
    colors, 
    handleColorPaletteChange,
    handleColorRotate
  } = useColorPalette('modern', () => {
    setAnimationKey(prev => prev + 1);
  });

  const { 
    animationStyle, 
    currentAnimationStyle, 
    setAnimationStyle, 
    initializeAnimationStyle 
  } = useAnimationStyle(chartData);

  useEffect(() => {
    if (chartData) {
      const chartType = chartData.recommendedChartType as ChartType;
      initializeAnimationStyle(chartType);
      setCurrentSeriesIndex(0);
      chartSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [chartData, initializeAnimationStyle]);

  const handleAnalyze = async () => {
    if (!userInput.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await analyzeText(userInput);
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

  const handleChartTypeChange = (type: ChartType) => {
    if (chartData) {
      setChartData({ ...chartData, recommendedChartType: type });
      initializeAnimationStyle(type);
      setAnimationKey(prev => prev + 1);
    }
  };

  const handleDataUpdate = (newData: ChartData['dataSeries']) => {
    if (chartData) {
      setChartData({ ...chartData, dataSeries: newData });
      setAnimationKey(prev => prev + 1);
    }
  };

  const isPieOrDonut = chartData?.recommendedChartType === 'pie' || chartData?.recommendedChartType === 'donut';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950 transition-colors">
      <ThemeToggle />
      <FontToggle currentFont={font} onFontChange={setFont} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-12">
            <img src="/chart-genie-logo2.png" alt="Chart Genie" className="h-32" />
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Transform data stories into beautiful visualizations</p>
          </div>

          <TextInput
            input={userInput}
            loading={loading}
            error={error}
            onInputChange={setUserInput}
            onAnalyze={handleAnalyze}
          />
          
          {chartData && (
            <div ref={chartSectionRef} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300 mb-6">{chartData.chartTypeExplanation}</p>
                
                <ChartControls
                  chartType={chartData.recommendedChartType as ChartType}
                  colorPalette={colorPalette}
                  colors={colors}
                  animationStyle={animationStyle}
                  smoothPoints={smoothPoints}
                  currentSeriesIndex={currentSeriesIndex}
                  totalSeries={chartData.dataSeries.length}
                  dataSeries={chartData.dataSeries}
                  onChartTypeChange={handleChartTypeChange}
                  onColorPaletteChange={handleColorPaletteChange}
                  onColorRotate={handleColorRotate}
                  onAnimationStyleChange={setAnimationStyle}
                  onSmoothPointsChange={setSmoothPoints}
                  onSeriesChange={setCurrentSeriesIndex}
                />
              </div>

              <div className="relative">
                <ResizableChartContainer>
                  <div ref={chartContainerRef} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg h-full">
                    <EChartsRenderer
                      dataSeries={isPieOrDonut ? [chartData.dataSeries[currentSeriesIndex]] : chartData.dataSeries}
                      chartType={chartData.recommendedChartType}
                      animationKey={animationKey}
                      colors={colors}
                      showGridlines={showGridlines}
                      animationStyle={currentAnimationStyle}
                      animationStyleKey={animationStyle}
                      smoothPoints={smoothPoints}
                      showDataLabels={showDataLabels}
                      currentSeriesIndex={currentSeriesIndex}
                      font={font}
                    />
                  </div>
                </ResizableChartContainer>

                <DataEditor
                  dataSeries={chartData.dataSeries}
                  onDataUpdate={handleDataUpdate}
                />

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