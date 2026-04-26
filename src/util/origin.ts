import { Dimensions, type View } from 'react-native';
import { useRef } from 'react';

// Returns the screen-relative center of a View as percentages 0..1.
export function useButtonOrigin() {
  const ref = useRef<View>(null);
  const measure = (): Promise<{ x: number; y: number }> =>
    new Promise((resolve) => {
      const node = ref.current;
      if (!node) return resolve({ x: 0.5, y: 0.88 });
      node.measureInWindow((x, y, w, h) => {
        const { width, height } = Dimensions.get('window');
        resolve({
          x: (x + w / 2) / width,
          y: (y + h / 2) / height,
        });
      });
    });
  return { ref, measure };
}
