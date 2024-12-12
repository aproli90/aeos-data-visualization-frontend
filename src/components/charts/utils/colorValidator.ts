import { ChartError } from '../../../utils/errors/ChartError';
import { ChartErrorCode } from '../../../utils/errors/chartErrorCodes';

const DEFAULT_COLORS = ['#5470c6', '#91cc75', '#fac858', '#ee6666'];

export const validateAndGetColors = (colors: string[] | undefined): string[] => {
  if (!colors || colors.length === 0) {
    console.warn('No colors provided, using default color palette');
    return [...DEFAULT_COLORS];
  }

  // Validate each color is a valid hex
  const validColors = colors.filter(color => {
    const isValid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    if (!isValid) {
      console.warn(`Invalid color format: ${color}, skipping`);
    }
    return isValid;
  });

  if (validColors.length === 0) {
    console.warn('No valid colors found, using default color palette');
    return [...DEFAULT_COLORS];
  }

  return validColors;
};

export const ensureValidColors = (colors: string[] | undefined): string[] => {
  try {
    return validateAndGetColors(colors);
  } catch (error) {
    console.error('Error validating colors:', error);
    return [...DEFAULT_COLORS];
  }
};