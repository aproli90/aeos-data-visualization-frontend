import React, { useState } from 'react';
import { Edit2, Save, Plus, Trash2 } from 'lucide-react';
import type { DataSeries } from '../services/api';
import { Modal } from './Modal';

interface DataEditorProps {
  dataSeries: DataSeries[];
  onDataUpdate: (newData: DataSeries[]) => void;
}

export const DataEditor: React.FC<DataEditorProps> = ({ dataSeries, onDataUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState<DataSeries[]>(dataSeries);

  const handleSeriesNameChange = (index: number, newName: string) => {
    const newData = [...editedData];
    newData[index] = { ...newData[index], name: newName };
    setEditedData(newData);
  };

  const handlePointChange = (seriesIndex: number, pointIndex: number, field: 'name' | 'value', newValue: string) => {
    const newData = [...editedData];
    const point = { ...newData[seriesIndex].dataPoints[pointIndex] };
    
    if (field === 'name') {
      point.name = newValue;
    } else {
      point.value = parseFloat(newValue) || 0;
    }
    
    newData[seriesIndex].dataPoints[pointIndex] = point;
    setEditedData(newData);
  };

  const handleAddPoint = (seriesIndex: number) => {
    const newData = [...editedData];
    newData[seriesIndex].dataPoints.push({ name: 'New Point', value: 0 });
    setEditedData(newData);
  };

  const handleRemovePoint = (seriesIndex: number, pointIndex: number) => {
    const newData = [...editedData];
    newData[seriesIndex].dataPoints.splice(pointIndex, 1);
    setEditedData(newData);
  };

  const handleSave = () => {
    onDataUpdate(editedData);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setEditedData(dataSeries);
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
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
        <div className="space-y-6 custom-scrollbar">
          {editedData.map((series, seriesIndex) => (
            <div key={seriesIndex} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={series.name}
                  onChange={(e) => handleSeriesNameChange(seriesIndex, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                  placeholder="Series Name"
                />
                <button
                  onClick={() => handleAddPoint(seriesIndex)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Point
                </button>
              </div>

              <div className="grid grid-cols-[1fr,1fr,auto] gap-3">
                {series.dataPoints.map((point, pointIndex) => (
                  <React.Fragment key={pointIndex}>
                    <input
                      type="text"
                      value={point.name}
                      onChange={(e) => handlePointChange(seriesIndex, pointIndex, 'name', e.target.value)}
                      placeholder="Label"
                      className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                    />
                    <input
                      type="number"
                      value={point.value}
                      onChange={(e) => handlePointChange(seriesIndex, pointIndex, 'value', e.target.value)}
                      placeholder="Value"
                      className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={() => handleRemovePoint(seriesIndex, pointIndex)}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
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
      </Modal>
    </>
  );
};