import { useState, useEffect } from 'react';

export interface CustomPalette {
  id: string;
  name: string;
  colors: string[];
}

export const useCustomPalettes = () => {
  const [customPalettes, setCustomPalettes] = useState<CustomPalette[]>(() => {
    try {
      const saved = localStorage.getItem('customPalettes');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading custom palettes:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('customPalettes', JSON.stringify(customPalettes));
    } catch (error) {
      console.error('Error saving custom palettes:', error);
    }
  }, [customPalettes]);

  const addPalette = (palette: CustomPalette) => {
    setCustomPalettes(prev => [...prev, palette]);
  };

  const updatePalette = (updatedPalette: CustomPalette) => {
    setCustomPalettes(prev => 
      prev.map(p => p.id === updatedPalette.id ? updatedPalette : p)
    );
  };

  const removePalette = (id: string) => {
    setCustomPalettes(prev => prev.filter(p => p.id !== id));
  };

  return { 
    customPalettes, 
    addPalette, 
    updatePalette, 
    removePalette 
  };
};