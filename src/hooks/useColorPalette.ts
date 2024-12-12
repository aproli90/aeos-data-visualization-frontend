import { useState, useCallback, useEffect } from 'react';
import type { ColorPalette } from '../constants/colorPalettes';
import { COLOR_PALETTES } from '../constants/colorPalettes';
import { rotateColors } from '../utils/colorUtils';

const STORAGE_KEY = 'chartGenie_lastColorPalette';

interface StoredPaletteData {
  paletteId: string;
  colors: string[];
}

interface UseColorPaletteReturn {
  colorPalette: string;
  colors: string[];
  handleColorPaletteChange: (paletteId: string, newColors: string[]) => void;
  handleColorRotate: () => void;
}

const getStoredPalette = (defaultPalette: ColorPalette): StoredPaletteData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as StoredPaletteData;
      // Validate stored data
      if (data.paletteId && Array.isArray(data.colors) && data.colors.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.error('Error loading stored palette:', error);
  }
  
  // Return default palette if no valid stored data
  return {
    paletteId: defaultPalette,
    colors: [...COLOR_PALETTES[defaultPalette]]
  };
};

export const useColorPalette = (
  initialPalette: ColorPalette = 'modern',
  onPaletteChange?: () => void
): UseColorPaletteReturn => {
  // Initialize state from localStorage or default
  const [{ paletteId, colors }, setState] = useState<StoredPaletteData>(() => 
    getStoredPalette(initialPalette)
  );

  // Persist palette changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ paletteId, colors }));
    } catch (error) {
      console.error('Error saving palette:', error);
    }
  }, [paletteId, colors]);

  const handleColorPaletteChange = useCallback((newPaletteId: string, newColors: string[]) => {
    if (!newColors || newColors.length === 0) {
      console.error('Invalid colors provided for palette:', newPaletteId);
      return;
    }

    setState({
      paletteId: newPaletteId,
      colors: newColors
    });
    onPaletteChange?.();
  }, [onPaletteChange]);

  const handleColorRotate = useCallback(() => {
    setState(prev => ({
      ...prev,
      colors: rotateColors(prev.colors)
    }));
    onPaletteChange?.();
  }, [onPaletteChange]);

  return {
    colorPalette: paletteId,
    colors,
    handleColorPaletteChange,
    handleColorRotate
  };
};