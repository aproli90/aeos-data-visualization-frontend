import React, { KeyboardEvent } from 'react';
import { Brain, Loader2, FileText, AlertCircle } from 'lucide-react';

interface TextInputProps {
  input: string;
  loading: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onAnalyze: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  input,
  loading,
  error,
  onInputChange,
  onAnalyze
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !loading && input.trim()) {
      e.preventDefault();
      onAnalyze();
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 transition-colors duration-300">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <label className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Enter your text with data
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">Press Ctrl+Enter to analyze</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-48 p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Example: Sales increased from 100 units in January to 250 units in March, then peaked at 400 units in June..."
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onAnalyze}
          disabled={loading || !input.trim()}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-3 w-5 h-5" />
          ) : (
            <Brain className="mr-3 w-5 h-5" />
          )}
          {loading ? 'Visualizing...' : 'Visualize Text'}
        </button>
      </div>
    </div>
  );
};