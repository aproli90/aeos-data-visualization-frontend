import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { DroppableWrapperProps } from './types';

export const DroppableWrapper: React.FC<DroppableWrapperProps> = ({ droppableId, children }) => {
  return (
    <Droppable droppableId={droppableId} direction="vertical">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`relative space-y-2 rounded-lg p-2 transition-colors transform-none ${
            snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-900/10 ring-2 ring-indigo-500/20' : ''
          }`}
          style={{ 
            minHeight: '50px',
            transform: 'none'
          }}
        >
          {children(provided, snapshot)}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};