/**
 * COMPONENTE: TOPBAR - BARRA SUPERIOR CON BÚSQUEDA Y CONTROLES
 * ==============================================================
 * Componente de barra superior fija que contiene un buscador global funcional,
 * botón para alternar tema claro/oscuro y avatar del usuario.
 *
 * FUNCIONALIDAD:
 * - Buscador global con búsqueda en tiempo real (debounced)
 * - Dropdown de resultados que muestra hasta 5 canciones
 * - Botón de favoritos (corazón) en cada resultado
 * - Toggle de tema (dark/light mode) con iconos sol/luna
 * - Avatar del usuario (imagen o icono por defecto)
 * - Fondo con efecto blur (backdrop-blur)
 * - Click fuera del dropdown para cerrar
 *
 * ESTADO INTERNO:
 * - searchQuery: string - Valor actual del campo de búsqueda
 * - searchResults: Array<Track> - Resultados de búsqueda (máx 5)
 * - showDropdown: boolean - Controla visibilidad del dropdown
 * - loading: boolean - Estado de carga mientras busca
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Manejo del estado del componente
 * - useEffect: Búsqueda automática y manejo de clicks
 * - useRef: Referencia al contenedor para detectar clicks fuera
 *
 * DEPENDENCIAS DE LUCIDE:
 * - Search: Icono de búsqueda
 * - User: Icono de usuario por defecto
 * - Sun, Moon: Iconos para toggle de tema
 * - Heart: Icono de favoritos
 * - Music: Icono placeholder de canción
 *
 * REFERENCIAS:
 * - Importa useTheme desde @/contexts/ThemeContext (src/contexts/ThemeContext.jsx)
 * - Importa useSpotify desde @/hooks/useSpotify (src/hooks/useSpotify.jsx)
 * - Importa useDebounce desde @/hooks/useDebounce (src/hooks/useDebounce.jsx)
 * - Importa useFavorites desde @/hooks/useFavorites (src/hooks/useFavorites.jsx)
 * - Importa useAudioPlayerContext desde @/contexts/AudioPlayerContext (src/contexts/AudioPlayerContext.jsx)
 *
 * UTILIZADO EN:
 * - src/app/dashboard/page.jsx
 * - src/app/dashboard/explore/ExploreClient.jsx
 * - src/app/dashboard/favorites/FavoritesClient.jsx
 * - src/app/dashboard/library/LibraryClient.jsx
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} [props.user] - Objeto de usuario de Spotify con propiedades:
 *   - images: Array de objetos imagen con url
 *   - display_name: string - Nombre del usuario
 *
 * @returns {JSX.Element} - Barra superior con búsqueda funcional y controles
 *
 * FLUJO DE BÚSQUEDA:
 * 1. Usuario escribe en el input
 * 2. Se actualiza searchQuery en el estado local
 * 3. useDebounce espera 500ms después del último cambio
 * 4. Se ejecuta búsqueda con searchTracks() de useSpotify
 * 5. Se muestran hasta 5 resultados en dropdown
 * 6. Usuario puede hacer clic en canción para reproducir
 * 7. Usuario puede dar like/unlike con el botón de corazón
 * 8. Click fuera del dropdown o ESC lo cierra
 *
 * FLUJO DE FAVORITOS:
 * 1. Usuario hace clic en el corazón de una canción
 * 2. Se llama a toggleFavorite() de useFavorites
 * 3. El icono cambia de vacío a lleno (y viceversa)
 * 4. La canción se guarda/elimina de favoritos localmente y en Spotify
 *
 * FLUJO DE TOGGLE DE TEMA:
 * 1. Usuario hace clic en el botón de sol/luna
 * 2. Se llama a toggleTheme() del ThemeContext
 * 3. El tema cambia globalmente en toda la aplicación
 */

'use client';

import { Search, User, Sun, Moon, Heart, Music } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSpotify } from '@/hooks/useSpotify';
import { useDebounce } from '@/hooks/useDebounce';
import { useFavorites } from '@/hooks/useFavorites';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

export default function TopBar({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const { searchTracks } = useSpotify();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { play } = useAudioPlayerContext();
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Búsqueda automática con debounce
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch || debouncedSearch.trim().length === 0) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        const tracks = await searchTracks(debouncedSearch);
        const limitedResults = Array.isArray(tracks) ? tracks.slice(0, 5) : [];
        setSearchResults(limitedResults);
        setShowDropdown(limitedResults.length > 0);
      } catch (error) {
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch, searchTracks]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTrackClick = (track) => {
    if (track.preview_url) {
      play(track);
    }
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleFavoriteClick = (e, track) => {
    e.stopPropagation(); // Evitar que se reproduzca la canción
    toggleFavorite(track);
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-20 bg-black/80 dark:bg-black/80 light:bg-white/80 backdrop-blur-md p-6 flex justify-between items-center">
      {/* Buscador con Dropdown */}
      <div ref={dropdownRef} className="relative w-full max-w-[480px] mx-auto">
        <Search className="absolute left-4 top-3 text-gray-400 dark:text-gray-400 light:text-gray-600 w-5 h-5 z-10" />
        <input
          type="text"
          placeholder="Search for songs..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          className="w-full bg-[#2a2a2a] dark:bg-[#2a2a2a] light:bg-gray-100 rounded-full py-2.5 pl-12 pr-4 text-sm text-gray-200 dark:text-gray-200 light:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:bg-[#333] dark:focus:bg-[#333] light:focus:bg-gray-200 transition-colors"
        />

        {/* Dropdown de Resultados */}
        {showDropdown && (
          <div className="absolute top-full mt-2 w-full bg-[#282828] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {loading ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto">
                {searchResults.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handleTrackClick(track)}
                    className="flex items-center gap-3 p-3 hover:bg-[#3a3a3a] transition-colors cursor-pointer group"
                  >
                    {/* Album Cover */}
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                      {track.album?.images?.[0]?.url ? (
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music size={20} className="text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {track.name}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {Array.isArray(track.artists)
                          ? track.artists.map((a) => a.name).join(', ')
                          : 'Unknown Artist'}
                      </p>
                    </div>

                    {/* Duration */}
                    <span className="text-gray-400 text-xs mr-2">
                      {formatDuration(track.duration_ms || 0)}
                    </span>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleFavoriteClick(e, track)}
                      className="p-2 rounded-full hover:bg-[#4a4a4a] transition-colors opacity-0 group-hover:opacity-100"
                      title={isFavorite(track.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        size={18}
                        className={
                          isFavorite(track.id)
                            ? 'text-green-500 fill-green-500'
                            : 'text-gray-400 hover:text-green-500'
                        }
                      />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
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
