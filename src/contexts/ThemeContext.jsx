/**
 * CONTEXTO: THEME CONTEXT - GESTIÓN DE TEMA DE LA APLICACIÓN
 * ===========================================================
 * Este contexto maneja el tema de la aplicación (dark/light mode) usando React Context API.
 * Proporciona persistencia del tema en localStorage y sincronización con el DOM.
 *
 * CARACTERÍSTICAS:
 * - Tema persistente en localStorage
 * - Sincronización automática con clases CSS del documento
 * - Prevención de flash de tema incorrecto con mounted state
 * - Toggle entre modo oscuro y claro
 *
 * DEPENDENCIAS DE REACT:
 * - createContext, useContext: API de contexto de React
 * - useState: Manejo de estado local
 * - useEffect: Efectos secundarios (localStorage, DOM)
 *
 * UTILIZADO POR:
 * - src/app/layout.js (envuelve toda la aplicación)
 * - src/components/layout/TopBar.jsx (botón de toggle de tema)
 * - Cualquier componente que importe useTheme()
 *
 * FLUJO DE DATOS:
 * 1. Al montar: lee tema de localStorage (default: 'dark')
 * 2. Actualiza state y marca como mounted
 * 3. Aplica clase CSS al document.documentElement
 * 4. Cuando cambia el tema: actualiza DOM y localStorage simultáneamente
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Creación del contexto (inicialmente undefined hasta que se provea)
const ThemeContext = createContext();

/**
 * ThemeProvider - Componente proveedor del contexto de tema
 *
 * DESCRIPCIÓN:
 * Componente que envuelve la aplicación y proporciona acceso al tema actual
 * y funciones para cambiarlo. Maneja la persistencia y sincronización del tema.
 *
 * ESTADOS INTERNOS:
 * - theme: 'dark' | 'light' - Tema actual de la aplicación
 * - mounted: boolean - Indica si el componente ya se montó en el cliente
 *   (necesario para evitar hidratación incorrecta en SSR de Next.js)
 *
 * EFECTOS:
 * 1. useEffect inicial: Carga tema desde localStorage al montar
 * 2. useEffect de sincronización: Aplica tema al DOM cuando cambia
 *
 * FLUJO DE RENDERIZADO:
 * - Si no está mounted: retorna null (evita flash de tema incorrecto en SSR)
 * - Si está mounted: renderiza children con el contexto disponible
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 *
 * @returns {JSX.Element|null} - Provider con children o null si no está montado
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // EFECTO 1: Cargar tema desde localStorage al montar el componente
  // Se ejecuta solo una vez cuando el componente se monta
  // Lee el tema guardado o usa 'dark' como default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    setMounted(true); // Marca el componente como montado
  }, []);

  // EFECTO 2: Aplicar tema al documento HTML
  // Se ejecuta cada vez que cambia el tema o el estado mounted
  // Actualiza las clases CSS del documento y guarda en localStorage
  useEffect(() => {
    if (mounted) {
      // Remover ambas clases posibles para limpiar
      document.documentElement.classList.remove('light', 'dark');
      // Agregar la clase del tema actual
      document.documentElement.classList.add(theme);
      // Persistir en localStorage para próximas visitas
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  /**
   * toggleTheme - Alterna entre tema oscuro y claro
   *
   * DESCRIPCIÓN:
   * Función que cambia el tema actual entre 'dark' y 'light'.
   * Usa la forma funcional de setState para garantizar que siempre
   * obtenga el valor más reciente del tema.
   *
   * EFECTO:
   * Al cambiar el tema, se dispara el useEffect que actualiza el DOM y localStorage
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Prevención de flash de tema incorrecto en SSR
  // Si aún no está montado, no renderiza nada (evita mismatch entre servidor y cliente)
  if (!mounted) {
    return null;
  }

  // Proveer el contexto con el tema actual y la función para cambiarlo
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme - Hook personalizado para acceder al contexto de tema
 *
 * DESCRIPCIÓN:
 * Hook que permite a cualquier componente hijo acceder al tema actual
 * y a la función toggleTheme. Incluye validación para asegurar que
 * se usa dentro de un ThemeProvider.
 *
 * USO:
 * const { theme, toggleTheme } = useTheme();
 *
 * RETORNO:
 * @returns {Object} - Objeto con propiedades:
 *   - theme: 'dark' | 'light' - Tema actual
 *   - toggleTheme: Function - Función para alternar el tema
 *
 * ERRORES:
 * - Lanza error si se usa fuera de un ThemeProvider
 *
 * UTILIZADO EN:
 * - src/components/layout/TopBar.jsx (botón de toggle)
 * - Cualquier componente que necesite saber el tema actual
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
