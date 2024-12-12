import React from 'react';
import { Plus } from 'lucide-react';
import { DataPointRow } from './DataPointRow';
import { DroppableWrapper } from './DroppableWrapper';
import type { SeriesEditorProps } from './types';

export const SeriesEditor: React.FC<SeriesEditorProps> = ({
  series,
  seriesIndex,
  onSeriesNameChange,
  onPointChange,
  onAddPoint,
  onRemovePoint
}) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={series.name}
          onChange={(e) => onSeriesNameChange(seriesIndex, e.target.value)}
          className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100"
          placeholder="Series Name"
        />
        <button
          onClick={() => onAddPoint(seriesIndex)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Point
        </button>
      </div>

      <DroppableWrapper droppableId={`series-${seriesIndex}`}>
        {(provided, snapshot) => (
          <>
            {series.dataPoints.map((point, pointIndex) => (
              <DataPointRow
                key={`${seriesIndex}-${pointIndex}`}
                point={point}
                pointIndex={pointIndex}
                seriesIndex={seriesIndex}
                onPointChange={onPointChange}
                onAddPoint={onAddPoint}
                onRemovePoint={onRemovePoint}
              />
            ))}
            {provided.placeholder}
          </>
        )}
      </DroppableWrapper>
    </div>
  );
};