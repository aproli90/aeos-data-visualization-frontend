import React, { useState, useEffect, useRef } from 'react';
import { ChartRenderer } from './components/ChartRenderer';
import { TextInput } from './components/TextInput';
import { ChartControls } from './components/ChartControls';
import { ChartActions } from './components/ChartActions';
import { AuthorCredits } from './components/AuthorCredits';
import { analyzeText, type ChartData } from './services/api';
import { COLOR_PALETTES, type ColorPalette } from './constants/colorPalettes';
import { ANIMATION_STYLES, type ChartType } from './constants/animationStyles';
import { BarChart2, LineChart, PieChart } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [colorPalette, setColorPalette] = useState<ColorPalette>('modern');
  const [whiteBackground, setWhiteBackground] = useState(false);
  const [animationStyle, setAnimationStyle] = useState('');
  const [smoothPoints, setSmoothPoints] = useState(true);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const chartSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartData) {
      const chartType = chartData.recommendedChartType as ChartType;
      const styles = ANIMATION_STYLES[chartType];
      if (styles) {
        const defaultStyle = Object.keys(styles)[0];
        setAnimationStyle(defaultStyle);
      }
      
      // Reset series index when new data arrives
      setCurrentSeriesIndex(0);
      
      // Scroll to chart section
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

  const getCurrentAnimationStyle = () => {
    if (!chartData) return null;
    const chartType = chartData.recommendedChartType as ChartType;
    const styles = ANIMATION_STYLES[chartType];
    return styles?.[animationStyle] || Object.values(styles)[0];
  };

  const handleSeriesChange = (index: number) => {
    setCurrentSeriesIndex(index);
    setAnimationKey(prev => prev + 1); // Trigger animation for new series
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-12">
            <img src="/chart-genie-logo2.png" alt="Chart Genie" className="h-32" />
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
            <p className="text-sm text-gray-500">Transform data stories into beautiful visualizations</p>
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
              <BarChart2 className="w-6 h-6 text-indigo-600" />
              <LineChart className="w-6 h-6 text-purple-600" />
              <PieChart className="w-6 h-6 text-pink-600" />
            </div>
          </div>

          {chartData && (
            <div ref={chartSectionRef} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
              <div className="mb-4">
                <p className="text-gray-600 mb-6">{chartData.chartTypeExplanation}</p>
                
                <ChartControls
                  chartType={chartData.recommendedChartType as ChartType}
                  colorPalette={colorPalette}
                  animationStyle={animationStyle}
                  smoothPoints={smoothPoints}
                  currentSeriesIndex={currentSeriesIndex}
                  totalSeries={chartData.dataSeries.length}
                  onChartTypeChange={(type) => setChartData({ ...chartData, recommendedChartType: type })}
                  onColorPaletteChange={setColorPalette}
                  onAnimationStyleChange={setAnimationStyle}
                  onSmoothPointsChange={setSmoothPoints}
                  onSeriesChange={handleSeriesChange}
                />
              </div>

              <ChartRenderer
                dataSeries={chartData.dataSeries}
                currentSeriesIndex={currentSeriesIndex}
                chartType={chartData.recommendedChartType}
                isRecording={isRecording}
                onRecordingComplete={handleRecordingComplete}
                animationKey={animationKey}
                colors={COLOR_PALETTES[colorPalette]}
                whiteBackground={whiteBackground}
                animationStyle={getCurrentAnimationStyle()}
                smoothPoints={smoothPoints}
              />

              <ChartActions
                isRecording={isRecording}
                whiteBackground={whiteBackground}
                onReplay={handleReplay}
                onExport={handleExport}
                onBackgroundChange={setWhiteBackground}
              />
            </div>
          )}

          <AuthorCredits />
        </div>
      </div>
    </div>
  );
}