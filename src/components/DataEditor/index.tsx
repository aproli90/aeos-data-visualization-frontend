import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Modal } from '../Modal';
import { SeriesEditor } from './SeriesEditor';
import { useDataEditor } from './hooks/useDataEditor';
import type { DataEditorProps } from './types';

export const DataEditor: React.FC<DataEditorProps> = ({ dataSeries, onDataUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    editedData,
    handleSeriesNameChange,
    handlePointChange,
    handleAddPoint,
    handleRemovePoint,
    handleDragEnd,
    handleSave
  } = useDataEditor(dataSeries, onDataUpdate, () => setIsModalOpen(false));

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-all shadow-sm hover:shadow-md opacity-100 duration-200 z-20"
        title="Edit Data"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Chart Data"
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-6 custom-scrollbar">
            {editedData.map((series, seriesIndex) => (
              <SeriesEditor
                key={seriesIndex}
                series={series}
                seriesIndex={seriesIndex}
                onSeriesNameChange={handleSeriesNameChange}
                onPointChange={handlePointChange}
                onAddPoint={handleAddPoint}
                onRemovePoint={handleRemovePoint}
              />
            ))}

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </DragDropContext>
      </Modal>
    </>
  );
};