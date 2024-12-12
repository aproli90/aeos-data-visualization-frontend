import React from 'react';
import type { ChartContainerProps } from './types';

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  chartType,
  animationStyleKey,
  containerRef
}) => {
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute('data-chart-type', chartType);
      containerRef.current.setAttribute('data-animation-style', animationStyleKey || 'default');
    }
  }, [chartType, animationStyleKey, containerRef]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
};