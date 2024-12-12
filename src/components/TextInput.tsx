import React, { KeyboardEvent } from 'react';
import { Brain, Loader2, FileText, AlertCircle } from 'lucide-react';
import { DecorativeIcons } from './DecorativeIcons';

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
    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 transition-all duration-300">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-500/10">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Enter your text with data
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Press Ctrl+Enter to submit
          </span>
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-48 p-4 bg-white dark:bg-gray-900 
              border border-indigo-200 dark:border-gray-700 rounded-xl 
              focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-transparent 
              transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] 
              hover:border-indigo-300 dark:hover:border-indigo-500"
            placeholder="Example: Sales increased from 100 units in January to 250 units in March, then peaked at 400 units in June..."
          />
          <DecorativeIcons />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onAnalyze}
          disabled={loading || !input.trim()}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
            hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 
            dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white rounded-xl transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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