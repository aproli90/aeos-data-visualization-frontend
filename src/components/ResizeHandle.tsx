import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface ResizeHandleProps {
  onResize: (width: number) => void;
  minWidth?: number;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onResize,
  minWidth = 300
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const startPosRef = useRef({ x: 0, width: 0 });

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosRef.current.x;
      const newWidth = Math.max(startPosRef.current.width + deltaX, minWidth);
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = (e.target as HTMLElement).closest('.relative') as HTMLElement;
    if (!container) return;

    setIsResizing(true);
    startPosRef.current = {
      x: e.clientX,
      width: container.offsetWidth
    };
  };

  return (
    <button
      className="absolute bottom-2 right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-ew-resize"
      onMouseDown={handleMouseDown}
      title="Adjust chart width"
    >
      <ArrowLeftRight className="w-4 h-4" />
    </button>
  );
};