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
  const chartSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartData) {
      const chartType = chartData.recommendedChartType as ChartType;
      const styles = ANIMATION_STYLES[chartType];
      if (styles) {
        const defaultStyle = Object.keys(styles)[0];
        setAnimationStyle(defaultStyle);
      }
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-12">
            <img src="/chart-genie-logo2.png" alt="Chart Genie" className="h-28" />
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
            <p className="text-base text-gray-600">Transform data stories into beautiful visualizations</p>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <div className="w-14 h-14 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-2xl">
              <BarChart2 className="w-8 h-8 text-indigo-600/70" />
            </div>
            <div className="w-14 h-14 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-2xl">
              <LineChart className="w-8 h-8 text-purple-600/70" />
            </div>
            <div className="w-14 h-14 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-2xl">
              <PieChart className="w-8 h-8 text-pink-600/70" />
            </div>
          </div>

          <TextInput
            input={input}
            loading={loading}
            error={error}
            onInputChange={setInput}
            onAnalyze={handleAnalyze}
          />

          {chartData && (
            <div ref={chartSectionRef} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
              <div className="mb-4">
                <p className="text-gray-600 mb-6">{chartData.chartTypeExplanation}</p>
                
                <ChartControls
                  chartType={chartData.recommendedChartType as ChartType}
                  colorPalette={colorPalette}
                  animationStyle={animationStyle}
                  smoothPoints={smoothPoints}
                  onChartTypeChange={(type) => setChartData({ ...chartData, recommendedChartType: type })}
                  onColorPaletteChange={setColorPalette}
                  onAnimationStyleChange={setAnimationStyle}
                  onSmoothPointsChange={setSmoothPoints}
                />
              </div>

              <ChartRenderer
                data={chartData.dataPoints}
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