import React, { useState } from 'react';
import { Type } from 'lucide-react';
import { FontModal } from './FontModal';
import type { ChartFont } from '../../constants/fonts';

interface FontToggleProps {
  currentFont: ChartFont;
  onFontChange: (font: ChartFont) => void;
}

export const FontToggle: React.FC<FontToggleProps> = ({
  currentFont,
  onFontChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-16 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all dark:bg-gray-800/10 dark:border-gray-700"
        title="Change chart font"
      >
        <Type className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      <FontModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentFont={currentFont}
        onFontChange={onFontChange}
      />
    </>
  );
};