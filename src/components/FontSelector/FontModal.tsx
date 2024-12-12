import React, { useState } from 'react';
import { Check, Plus, AlertCircle } from 'lucide-react';
import { Modal } from '../Modal';
import { CHART_FONTS, type ChartFont, validateFontFamily } from '../../constants/fonts';

interface FontModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFont: ChartFont;
  onFontChange: (font: ChartFont) => void;
}

export const FontModal: React.FC<FontModalProps> = ({
  isOpen,
  onClose,
  currentFont,
  onFontChange
}) => {
  const [customFont, setCustomFont] = useState('');
  const [error, setError] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomFontSubmit = () => {
    if (!customFont.trim()) {
      setError('Font family name is required');
      return;
    }

    if (!validateFontFamily(customFont)) {
      setError('Invalid font family name. Use only letters, numbers, spaces, and hyphens.');
      return;
    }

    onFontChange(customFont);
    onClose();
    setCustomFont('');
    setError('');
    setShowCustomInput(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Chart Font"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(CHART_FONTS) as ChartFont[]).map((fontName) => (
            <button
              key={fontName}
              onClick={() => {
                onFontChange(fontName);
                onClose();
              }}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                currentFont === fontName
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'
              }`}
              style={{ fontFamily: CHART_FONTS[fontName] }}
            >
              <span className="text-lg">{fontName}</span>
              {currentFont === fontName && (
                <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-4" />
              )}
            </button>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          {showCustomInput ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom Font Family
                </label>
                <input
                  type="text"
                  value={customFont}
                  onChange={(e) => {
                    setCustomFont(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., Arial, Helvetica Neue"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Note: The font must be installed on your system or loaded via a web font service.
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomFont('');
                    setError('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomFontSubmit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                  Add Font
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomInput(true)}
              className="flex items-center gap-2 w-full px-4 py-3 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Custom Font
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};