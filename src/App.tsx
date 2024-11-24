import React, { useState, useEffect, useRef } from 'react';
import { ChartRenderer } from './components/ChartRenderer';
import { TextInput } from './components/TextInput';
import { ChartControls } from './components/ChartControls';
import { ChartActions } from './components/ChartActions';
import { analyzeText, type ChartData } from './services/api';
import { COLOR_PALETTES, type ColorPalette } from './constants/colorPalettes';
import { ANIMATION_STYLES, type ChartType } from './constants/animationStyles';
import { LineChart, BarChartIcon, PieChart, Wand2, Sparkles, Users } from 'lucide-react';

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
      
      // Scroll to chart section with a small delay to ensure rendering is complete
      setTimeout(() => {
        chartSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <LineChart className="w-8 h-8 text-indigo-600" />
              <BarChartIcon className="w-8 h-8 text-purple-600" />
              <PieChart className="w-8 h-8 text-pink-600" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Text to Chart Animator
            </h1>
            <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
              <Wand2 className="w-5 h-5" />
              <p>Transform your data stories into beautiful animated visualizations</p>
              <Sparkles className="w-5 h-5" />
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
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-gray-600 leading-relaxed">{chartData.chartTypeExplanation}</p>
                </div>
                
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

          <footer className="text-center py-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-700">Team Brainy Bots</h3>
            </div>
            <p className="text-gray-500">
              Created by Sonjil, Sachin, Karthik, and Ashhar
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}