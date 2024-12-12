import type { DataSeries } from '../../services/api';
import type { DraggableProvided, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';

export interface DataPoint {
  name: string;
  value: number;
}

export interface DataEditorProps {
  dataSeries: DataSeries[];
  onDataUpdate: (newData: DataSeries[]) => void;
}

export interface SeriesEditorProps {
  series: DataSeries;
  seriesIndex: number;
  onSeriesNameChange: (index: number, name: string) => void;
  onPointChange: (seriesIndex: number, pointIndex: number, field: 'name' | 'value', value: string) => void;
  onAddPoint: (seriesIndex: number, insertIndex?: number) => void;
  onRemovePoint: (seriesIndex: number, pointIndex: number) => void;
}

export interface DataPointRowProps {
  point: DataPoint;
  pointIndex: number;
  seriesIndex: number;
  onPointChange: (seriesIndex: number, pointIndex: number, field: 'name' | 'value', value: string) => void;
  onAddPoint: (seriesIndex: number, insertIndex?: number) => void;
  onRemovePoint: (seriesIndex: number, pointIndex: number) => void;
}

export interface DroppableWrapperProps {
  droppableId: string;
  children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
}