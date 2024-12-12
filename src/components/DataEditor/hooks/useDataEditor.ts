import { useState, useEffect } from 'react';
import type { DataSeries } from '../../../services/api';
import type { DropResult } from '@hello-pangea/dnd';

export const useDataEditor = (
  initialData: DataSeries[],
  onUpdate: (data: DataSeries[]) => void,
  onClose: () => void
) => {
  const [editedData, setEditedData] = useState<DataSeries[]>(initialData);

  useEffect(() => {
    setEditedData(initialData);
  }, [initialData]);

  const handleSeriesNameChange = (index: number, newName: string) => {
    console.log('Changing series name:', { index, newName });
    setEditedData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], name: newName };
      return newData;
    });
  };

  const handlePointChange = (seriesIndex: number, pointIndex: number, field: 'name' | 'value', newValue: string) => {
    console.log('Changing point:', { seriesIndex, pointIndex, field, newValue });
    setEditedData(prev => {
      const newData = [...prev];
      const point = { ...newData[seriesIndex].dataPoints[pointIndex] };
      
      if (field === 'name') {
        point.name = newValue;
      } else {
        point.value = parseFloat(newValue) || 0;
      }
      
      newData[seriesIndex].dataPoints[pointIndex] = point;
      return newData;
    });
  };

  const handleAddPoint = (seriesIndex: number, insertIndex?: number) => {
    console.log('Adding point:', { seriesIndex, insertIndex });
    setEditedData(prev => {
      const newData = [...prev];
      const newPoint = { name: 'New Point', value: 0 };
      
      if (typeof insertIndex === 'number') {
        newData[seriesIndex].dataPoints.splice(insertIndex, 0, newPoint);
      } else {
        newData[seriesIndex].dataPoints.push(newPoint);
      }
      
      return newData;
    });
  };

  const handleRemovePoint = (seriesIndex: number, pointIndex: number) => {
    console.log('Removing point:', { seriesIndex, pointIndex });
    setEditedData(prev => {
      const newData = [...prev];
      newData[seriesIndex].dataPoints.splice(pointIndex, 1);
      return newData;
    });
  };

  const handleDragEnd = (result: DropResult) => {
    console.log('Drag end:', result);
    if (!result.destination) {
      console.log('No destination, skipping update');
      return;
    }

    const { source, destination } = result;
    console.log('Processing drag:', { source, destination });

    setEditedData(prev => {
      const newData = [...prev];
      const [, seriesId] = source.droppableId.split('-');
      const seriesIndex = parseInt(seriesId);
      
      console.log('Reordering points for series:', seriesIndex);
      const points = [...newData[seriesIndex].dataPoints];
      const [removed] = points.splice(source.index, 1);
      points.splice(destination.index, 0, removed);
      
      newData[seriesIndex].dataPoints = points;
      return newData;
    });
  };

  const handleSave = () => {
    console.log('Saving data:', editedData);
    onUpdate(editedData);
    onClose();
  };

  return {
    editedData,
    handleSeriesNameChange,
    handlePointChange,
    handleAddPoint,
    handleRemovePoint,
    handleDragEnd,
    handleSave
  };
};