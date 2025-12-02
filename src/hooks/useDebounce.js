import { useState, useEffect } from 'react';

/**
 * Hook para implementar debouncing en inputs
 * @param {*} value - Valor a debounce
 * @param {number} delay - Delay en milisegundos (default: 300ms)
 * @returns {*} Valor debounced
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
