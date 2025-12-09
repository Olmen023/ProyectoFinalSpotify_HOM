/**
 * COMPONENTE: TOPBAR - BARRA SUPERIOR CON BÚSQUEDA Y CONTROLES
 * ==============================================================
 * Componente de barra superior fija que contiene un buscador global,
 * botón para alternar tema claro/oscuro y avatar del usuario.
 *
 * FUNCIONALIDAD:
 * - Buscador global con icono de lupa
 * - Toggle de tema (dark/light mode) con iconos sol/luna
 * - Avatar del usuario (imagen o icono por defecto)
 * - Fondo con efecto blur (backdrop-blur)
 *
 * ESTADO INTERNO:
 * - searchQuery: string - Valor actual del campo de búsqueda
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Manejo del estado del campo de búsqueda
 *
 * DEPENDENCIAS DE LUCIDE:
 * - Search: Icono de búsqueda
 * - User: Icono de usuario por defecto
 * - Sun, Moon: Iconos para toggle de tema
 *
 * REFERENCIAS:
 * - Importa useTheme desde @/contexts/ThemeContext (src/contexts/ThemeContext.jsx)
 *
 * UTILIZADO EN:
 * - No se está usando actualmente en el layout principal
 * - Disponible para ser usado en páginas que necesiten barra superior
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} [props.onSearch] - Callback que se ejecuta cuando el usuario escribe en el buscador
 * @param {Object} [props.user] - Objeto de usuario de Spotify con propiedades:
 *   - images: Array de objetos imagen con url
 *   - display_name: string - Nombre del usuario
 *
 * @returns {JSX.Element} - Barra superior con búsqueda y controles
 *
 * FLUJO DE BÚSQUEDA:
 * 1. Usuario escribe en el input
 * 2. Se actualiza searchQuery en el estado local
 * 3. Se llama a onSearch?.(value) si se proporcionó el callback
 *
 * FLUJO DE TOGGLE DE TEMA:
 * 1. Usuario hace clic en el botón de sol/luna
 * 2. Se llama a toggleTheme() del ThemeContext
 * 3. El tema cambia globalmente en toda la aplicación
 */

'use client';

import { Search, User, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
export default function TopBar({ onSearch, user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="sticky top-0 z-20 bg-black/80 dark:bg-black/80 light:bg-white/80 backdrop-blur-md p-6 flex justify-between items-center">
      {/* Buscador */}
      <div className="relative w-full max-w-[480px] mx-auto">
        <Search className="absolute left-4 top-3 text-gray-400 dark:text-gray-400 light:text-gray-600 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for artists, songs, or podcasts"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full bg-[#2a2a2a] dark:bg-[#2a2a2a] light:bg-gray-100 rounded-full py-2.5 pl-12 pr-4 text-sm text-gray-200 dark:text-gray-200 light:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:bg-[#333] dark:focus:bg-[#333] light:focus:bg-gray-200 transition-colors"
        />
      </div>

      {/* Theme Toggle & Avatar */}
      <div className="flex items-center gap-3 ml-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-[#2a2a2a] dark:bg-[#2a2a2a] light:bg-gray-200 hover:bg-[#333] dark:hover:bg-[#333] light:hover:bg-gray-300 flex items-center justify-center transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-gray-700" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-600 dark:bg-gray-600 light:bg-gray-300 border border-gray-800 dark:border-gray-800 light:border-gray-400 overflow-hidden flex items-center justify-center">
          {user?.images?.[0]?.url ? (
            <img
              src={user.images[0].url}
              alt={user.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={20} className="text-gray-300 dark:text-gray-300 light:text-gray-600" />
          )}
        </div>
      </div>
    </header>
  );
}
