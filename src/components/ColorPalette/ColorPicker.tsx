import React, { useEffect } from 'react';
import { ColorPicker as Picker, useColor, Color } from 'react-color-palette';
import "react-color-palette/css";
import { hexToRgb } from '../../utils/colorUtils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose }) => {
  // Initialize with proper RGB values from hex
  const rgb = hexToRgb(color);
  const [pickerColor, setPickerColor] = useColor("hex", color, {
    r: rgb.r,
    g: rgb.g,
    b: rgb.b
  });

  // Update picker color when prop changes
  useEffect(() => {
    const rgb = hexToRgb(color);
    setPickerColor({
      hex: color,
      rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
      hsv: pickerColor.hsv // Keep current HSV
    });
  }, [color]);

  const handleChange = (newColor: Color) => {
    setPickerColor(newColor);
    onChange(newColor.hex);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4"
        onClick={e => e.stopPropagation()}
      >
        <Picker
          color={pickerColor}
          onChange={handleChange}
          hideAlpha
          hideInput={["rgb", "hsv"]}
          height={200}
          width={260}
        />
      </div>
    </div>
  );
};