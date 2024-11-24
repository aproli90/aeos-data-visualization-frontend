import React from 'react';
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
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-indigo-600" />
          <label className="text-lg font-medium text-gray-700">
            Enter your text with data
          </label>
        </div>
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
          placeholder="Example: Sales increased from 100 units in January to 250 units in March, then peaked at 400 units in June..."
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onAnalyze}
          disabled={loading || !input.trim()}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-3 w-5 h-5" />
          ) : (
            <Brain className="mr-3 w-5 h-5" />
          )}
          {loading ? 'Analyzing...' : 'Analyze Text'}
        </button>
      </div>
    </div>
  );
};