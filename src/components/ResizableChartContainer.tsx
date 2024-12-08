import React, { useState, useRef } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizableChartContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResizableChartContainer: React.FC<ResizableChartContainerProps> = ({
  children,
  className = ''
}) => {
  const [size, setSize] = useState({ width: '100%', height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<{
    isResizing: boolean;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  }>({
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0
  });

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    
    resizingRef.current = {
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height
    };

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (!resizingRef.current.isResizing) return;

    const deltaX = e.clientX - resizingRef.current.startX;
    const deltaY = e.clientY - resizingRef.current.startY;

    const newWidth = Math.max(400, resizingRef.current.startWidth + deltaX);
    const newHeight = Math.max(300, resizingRef.current.startHeight + deltaY);

    setSize({
      width: `${newWidth}px`,
      height: newHeight
    });
  };

  const stopResize = () => {
    resizingRef.current.isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative group ${className}`}
      style={{ 
        width: size.width,
        height: size.height,
        transition: resizingRef.current.isResizing ? 'none' : 'all 0.2s ease'
      }}
    >
      {children}
      
      <div 
        className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:shadow-xl"
        onMouseDown={startResize}
      >
        <GripVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </div>
    </div>
  );
};