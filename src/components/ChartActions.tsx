import React from 'react';
import { Loader2, Video, RefreshCw, Image } from 'lucide-react';

interface ChartActionsProps {
  isRecording: boolean;
  whiteBackground: boolean;
  onReplay: () => void;
  onExport: () => void;
  onBackgroundChange: (white: boolean) => void;
}

export const ChartActions: React.FC<ChartActionsProps> = ({
  isRecording,
  whiteBackground,
  onReplay,
  onExport,
  onBackgroundChange
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      <button
        onClick={onReplay}
        className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
      >
        <RefreshCw className="mr-2 w-5 h-5" />
        Replay Animation
      </button>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
          <Image className="w-5 h-5 text-gray-500" />
          <input
            type="checkbox"
            checked={whiteBackground}
            onChange={(e) => onBackgroundChange(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
          />
          <span className="text-sm text-gray-600">White Background</span>
        </label>

        <button
          onClick={onExport}
          disabled={isRecording}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecording ? (
            <Loader2 className="animate-spin mr-2 w-5 h-5" />
          ) : (
            <Video className="mr-2 w-5 h-5" />
          )}
          {isRecording ? 'Processing...' : 'Export Video'}
        </button>
      </div>
    </div>
  );
};