import { useCallback } from 'react';

const FRAME_RATE = 60;
export const FRAME_INTERVAL = 1000 / FRAME_RATE;

export const useFrameCapture = () => {
  const captureFrame = useCallback((canvas: HTMLCanvasElement, targetElement: HTMLDivElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgElement = targetElement.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  return { captureFrame, FRAME_RATE, FRAME_INTERVAL };
};