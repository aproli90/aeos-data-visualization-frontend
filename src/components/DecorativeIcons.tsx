import React from 'react';
import { BarChart2, LineChart, PieChart } from 'lucide-react';

interface IconProps {
  Icon: React.ComponentType<any>;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

const FloatingIcon: React.FC<IconProps> = ({ Icon, className = '', size = 24, strokeWidth = 1.5 }) => (
  <div className={`absolute transform transition-all duration-700 ease-in-out ${className}`}>
    <Icon 
      size={size}
      strokeWidth={strokeWidth}
      className="text-indigo-500/30 dark:text-indigo-400/30 animate-pulse"
      style={{ animationDuration: '3s' }}
    />
  </div>
);

export const DecorativeIcons: React.FC = () => {
  return (
    <div className="absolute -right-20 top-1/2 -translate-y-1/2 pointer-events-none h-48">
      <FloatingIcon 
        Icon={LineChart}
        className="absolute top-0 rotate-[10deg]"
        size={28}
        strokeWidth={2}
      />
      <FloatingIcon 
        Icon={BarChart2}
        className="absolute top-1/2 -translate-y-1/2"
        size={32}
        strokeWidth={2}
      />
      <FloatingIcon 
        Icon={PieChart}
        className="absolute bottom-0 rotate-[-10deg]"
        size={30}
        strokeWidth={2}
      />
    </div>
  );
};