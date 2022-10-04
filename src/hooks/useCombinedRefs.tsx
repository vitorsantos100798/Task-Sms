import { useRef, useEffect } from 'react';
import { TextInputProps } from 'react-native';

export const useCombinedRefs = (...refs: Array<React.ForwardedRef<TextInputProps | TextInputProps>>) => {
  const targetRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refs.forEach((ref: React.ForwardedRef<TextInputProps | TextInputProps>) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
