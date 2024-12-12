import { useCallback } from 'react';
import type { RecordingRefs } from './types';

export const useMediaRecorder = (onComplete: (url: string | null) => void) => {
  const setupMediaRecorder = useCallback((stream: MediaStream, refs: RecordingRefs) => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8',
      videoBitsPerSecond: 8000000
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        refs.chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(refs.chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      onComplete(url);
    };

    return mediaRecorder;
  }, [onComplete]);

  return { setupMediaRecorder };
};