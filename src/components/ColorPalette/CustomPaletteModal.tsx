import React from 'react';
import { Modal } from '../Modal';
import { CustomPaletteForm } from './CustomPaletteForm';
import type { CustomPalette } from '../../hooks/useCustomPalettes';

interface CustomPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (palette: CustomPalette) => void;
  initialPalette?: CustomPalette;
  mode?: 'create' | 'edit';
}

export const CustomPaletteModal: React.FC<CustomPaletteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPalette,
  mode = 'create'
}) => {
  const handleSubmit = (name: string, colors: string[]) => {
    onSave({
      id: initialPalette?.id || `custom-${Date.now()}`,
      name,
      colors
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Custom Color Palette' : 'Edit Color Palette'}
    >
      <CustomPaletteForm
        initialName={initialPalette?.name}
        initialColors={initialPalette?.colors}
        onSubmit={handleSubmit}
        submitLabel={mode === 'create' ? 'Create Palette' : 'Save Changes'}
      />
    </Modal>
  );
};