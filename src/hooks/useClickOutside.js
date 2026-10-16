import { useEffect, useRef } from 'react';

/**
 * Hook untuk mendeteksi klik di luar elemen target dan tombol Escape
 */
export function useClickOutside(callback, active = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, active]);

  return ref;
}
