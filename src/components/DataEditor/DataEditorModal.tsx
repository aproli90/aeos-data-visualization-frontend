import React from 'react';
import { Save } from 'lucide-react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Modal } from '../Modal';
import { SeriesEditor } from './SeriesEditor';
import { useDataEditor } from './hooks/useDataEditor';
import type { DataSeries } from '../../services/api';

interface DataEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSeries: DataSeries[];
  onDataUpdate: (newData: DataSeries[]) => void;
}

export const DataEditorModal: React.FC<DataEditorModalProps> = ({
  isOpen,
  onClose,
  dataSeries,
  onDataUpdate
}) => {
  const {
    editedData,
    handleSeriesNameChange,
    handlePointChange,
    handleAddPoint,
    handleRemovePoint,
    handleDragEnd,
    handleSave
  } = useDataEditor(dataSeries, onDataUpdate, onClose);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </DragDropContext>
    </Modal>
  );
};