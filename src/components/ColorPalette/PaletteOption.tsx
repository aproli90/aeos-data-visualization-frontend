import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import { ColorPalettePreview } from '../ColorPalettePreview';

interface PaletteOptionProps {
  name: string;
  colors: string[];
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  isCustom?: boolean;
}

export const PaletteOption: React.FC<PaletteOptionProps> = ({
  name,
  colors,
  isSelected,
  onSelect,
  onEdit,
  onRemove,
  isCustom = false
}) => {
  return (
    <div 
      className={`group relative flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
      }`}
    >
      <button
        onClick={onSelect}
        className="flex-1 flex items-center justify-between"
      >
        <span className="capitalize text-gray-700 dark:text-gray-200">
          {name}
        </span>
        <div className={`transition-opacity duration-200 ${isCustom ? 'group-hover:opacity-0' : ''}`}>
          <ColorPalettePreview colors={colors} />
        </div>
      </button>
      
      {isCustom && (
        <div className="absolute right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1.5 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit palette"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Remove palette"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};