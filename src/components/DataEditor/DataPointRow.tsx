import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import type { DataPointRowProps } from './types';

export const DataPointRow: React.FC<DataPointRowProps> = ({
  point,
  pointIndex,
  seriesIndex,
  onPointChange,
  onAddPoint,
  onRemovePoint
}) => {
  const draggableId = `point-${seriesIndex}-${pointIndex}`;

  return (
    <Draggable draggableId={draggableId} index={pointIndex}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`grid grid-cols-[auto,1fr,1fr,auto,auto] gap-3 items-center p-2 rounded-lg transition-colors ${
            snapshot.isDragging
              ? 'bg-indigo-50 dark:bg-indigo-900/30 shadow-lg ring-1 ring-indigo-500/20'
              : 'bg-white dark:bg-gray-800'
          }`}
          style={{
            ...provided.draggableProps.style,
            left: 'auto',
            top: provided.draggableProps.style?.top,
            transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'none'
          }}
        >
          <div
            {...provided.dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-2 text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors shadow-sm"
          >
            <GripVertical className="w-4 h-4 stroke-[2.5]" />
          </div>
          <input
            type="text"
            value={point.name}
            onChange={(e) => onPointChange(seriesIndex, pointIndex, 'name', e.target.value)}
            placeholder="Label"
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100"
          />
          <input
            type="number"
            value={point.value}
            onChange={(e) => onPointChange(seriesIndex, pointIndex, 'value', e.target.value)}
            placeholder="Value"
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={() => onAddPoint(seriesIndex, pointIndex + 1)}
            className="p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            title="Insert row below"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => onRemovePoint(seriesIndex, pointIndex)}
            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </Draggable>
  );
};