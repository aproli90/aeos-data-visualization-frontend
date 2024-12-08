import React from 'react';
import { Loader2, Video, RefreshCw, Tag, Grid } from 'lucide-react';

interface ChartActionsProps {
  isRecording: boolean;
  showDataLabels: boolean;
  showGridlines: boolean;
  onReplay: () => void;
  onExport: () => void;
  onDataLabelsChange: (show: boolean) => void;
  onShowGridlinesChange: (show: boolean) => void;
  isPieOrDonut?: boolean;
}

export const ChartActions: React.FC<ChartActionsProps> = ({
  isRecording,
  showDataLabels,
  showGridlines,
  onReplay,
  onExport,
  onDataLabelsChange,
  onShowGridlinesChange,
  isPieOrDonut = false
}) => {
  const checkboxLabelClass = "flex items-center gap-2 px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors";
  const checkboxClass = "rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors";
  const labelTextClass = "text-sm text-gray-600 dark:text-gray-300";

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      <button
        onClick={onReplay}
        className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
      >
        <RefreshCw className="mr-2 w-5 h-5" />
        Replay Animation
      </button>

      <div className="flex items-center gap-4">
        <label className={checkboxLabelClass}>
          <Tag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input
            type="checkbox"
            checked={showDataLabels}
            onChange={(e) => onDataLabelsChange(e.target.checked)}
            className={checkboxClass}
          />
          <span className={labelTextClass}>Show Labels</span>
        </label>

        {!isPieOrDonut && (
          <label className={checkboxLabelClass}>
            <Grid className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="checkbox"
              checked={showGridlines}
              onChange={(e) => onShowGridlinesChange(e.target.checked)}
              className={checkboxClass}
            />
            <span className={labelTextClass}>Show Gridlines</span>
          </label>
        )}

        <button
          onClick={onExport}
          disabled={isRecording}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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