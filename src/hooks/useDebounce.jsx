/**
 * HOOK: USE DEBOUNCE - RETARDO EN ACTUALIZACIÓN DE VALORES
 * ==========================================================
 * Hook personalizado que implementa la técnica de "debouncing" para retrasar
 * la actualización de un valor hasta que el usuario deje de escribir/cambiar.
 *
 * CONCEPTO DE DEBOUNCING:
 * Es una técnica de optimización que retrasa la ejecución de una función
 * hasta que haya pasado un tiempo determinado desde la última llamada.
 * Útil para reducir llamadas a APIs mientras el usuario escribe.
 *
 * EJEMPLO DE USO:
 * ```jsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // Esta llamada solo se ejecuta 500ms después de que el usuario deje de escribir
 *   if (debouncedSearchTerm) {
 *     searchAPI(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 *
 * BENEFICIOS:
 * - Reduce el número de llamadas a APIs (ahorro de costos y mejor rendimiento)
 * - Mejora la experiencia de usuario (menos requests mientras escribe)
 * - Previene race conditions en búsquedas
 *
 * UTILIZADO EN:
 * - src/components/widgets/ArtistWidget.jsx (búsqueda de artistas)
 * - src/components/widgets/TrackWidget.jsx (búsqueda de canciones)
 * - Cualquier componente con búsqueda en tiempo real
 *
 * DEPENDENCIAS:
 * - useState: Para mantener el valor debounced
 * - useEffect: Para configurar y limpiar el timer
 */

import { useState, useEffect } from 'react';

/**
 * useDebounce - Hook para retrasar la actualización de un valor
 *
 * FUNCIONAMIENTO INTERNO:
 * 1. Guarda el valor inicial en debouncedValue
 * 2. Cuando cambia el valor, inicia un timer de X milisegundos
 * 3. Si el valor cambia de nuevo antes de que expire el timer, cancela el timer anterior
 * 4. Solo cuando pasa el tiempo completo sin cambios, actualiza debouncedValue
 *
 * FLUJO DE EJECUCIÓN:
 * Usuario escribe "H" -> Timer de 300ms
 * Usuario escribe "e" (antes de 300ms) -> Cancela timer anterior, nuevo timer de 300ms
 * Usuario escribe "l" (antes de 300ms) -> Cancela timer anterior, nuevo timer de 300ms
 * Usuario escribe "lo" (antes de 300ms) -> Cancela timer anterior, nuevo timer de 300ms
 * Usuario para de escribir -> Después de 300ms, debouncedValue se actualiza a "Hello"
 *
 * CLEANUP:
 * El useEffect retorna una función de limpieza que cancela el timer cuando:
 * - El valor cambia (para iniciar un nuevo timer)
 * - El componente se desmonta
 *
 * @param {*} value - Valor que se quiere debounce (puede ser string, number, object, etc.)
 * @param {number} delay - Tiempo de espera en milisegundos antes de actualizar (default: 300ms)
 *
 * @returns {*} - Valor debounced (mismo tipo que el valor de entrada)
 *                Solo se actualiza después de que pase el delay sin cambios
 *
 * EJEMPLO COMPARATIVO:
 * // Sin debounce (10 llamadas API mientras escribes "Hello World")
 * onChange={(e) => searchAPI(e.target.value)}
 *
 * // Con debounce (1 sola llamada API 300ms después de terminar de escribir)
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * useEffect(() => searchAPI(debouncedSearch), [debouncedSearch]);
 */
export function useDebounce(value, delay = 300) {
  // Estado que mantiene el valor debounced (actualizado con retraso)
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configurar un timer que actualizará debouncedValue después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Función de limpieza: cancela el timer si value cambia antes de que expire
    // o si el componente se desmonta
    return () => clearTimeout(timer);
  }, [value, delay]); // Re-ejecuta cuando cambia value o delay

  return debouncedValue;
}
