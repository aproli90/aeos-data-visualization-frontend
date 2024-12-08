import React from 'react';
import { RotateCw } from 'lucide-react';

interface SelectWrapperProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  onRotate?: () => void;
  showRotateButton?: boolean;
}

export const SelectWrapper: React.FC<SelectWrapperProps> = ({ 
  icon, 
  label, 
  children, 
  onRotate,
  showRotateButton = false 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3">
        <div className="text-gray-500 dark:text-gray-400">{icon}</div>
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
        {showRotateButton && (
          <button
            onClick={onRotate}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Rotate colors"
          >
            <RotateCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};