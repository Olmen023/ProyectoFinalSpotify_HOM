'use client';

import { useState, useEffect } from 'react';
import { Search, X, User } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * COMPONENTE: ArtistWidget - Selector de artistas para recomendaciones
 * =====================================================================
 * Widget de búsqueda y selección de artistas desde Spotify.
 * Permite al usuario seleccionar hasta 5 artistas para usarlos como
 * semillas en el algoritmo de recomendaciones de playlists.
 *
 * FUNCIONALIDAD:
 * - Búsqueda de artistas en tiempo real con debounce (300ms)
 * - Muestra resultados con foto, nombre y número de followers
 * - Permite seleccionar hasta 5 artistas máximo
 * - Lista de artistas seleccionados con opción de eliminar
 * - Deshabilita búsqueda cuando alcanza el límite
 * - Validación para no añadir duplicados
 *
 * ARQUITECTURA:
 * - Estado local para query y resultados de búsqueda
 * - useDebounce para optimizar llamadas a la API
 * - useEffect que ejecuta búsqueda cuando cambia query debounced
 * - Input deshabilitado cuando se alcanza MAX_ARTISTS
 * - Resultados con estados: normal, selected, disabled
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Manejo de query y resultados de búsqueda
 * - useEffect: Trigger de búsqueda cuando cambia query debounced
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - lucide-react: Iconos (Search, X, User)
 *
 * REFERENCIAS:
 * - Importa useSpotify desde @/hooks/useSpotify (src/hooks/useSpotify.jsx)
 * - Importa useDebounce desde @/hooks/useDebounce (src/hooks/useDebounce.jsx)
 * - Importa LoadingSpinner desde @/components/ui/LoadingSpinner (src/components/ui/LoadingSpinner.jsx)
 *
 * UTILIZADO EN:
 * - src/app/generator/page.jsx (selector de artistas para generar playlist)
 * - src/app/page.jsx (página principal con generador)
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.selectedArtists - Array de artistas ya seleccionados
 * @param {Function} props.onSelect - Callback con array actualizado de artistas
 *
 * @returns {JSX.Element} Widget de selección de artistas
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Usuario escribe en input de búsqueda
 * 2. useDebounce espera 300ms sin cambios
 * 3. useEffect detecta cambio en debouncedQuery
 * 4. Llama a searchArtists(query) del hook useSpotify
 * 5. Muestra resultados con foto y stats
 * 6. Al hacer clic en artista:
 *    - Valida que no esté ya seleccionado
 *    - Valida que no exceda MAX_ARTISTS (5)
 *    - Añade a selectedArtists y llama a onSelect
 *    - Limpia búsqueda
 * 7. Al eliminar artista: filtra array y llama a onSelect
 */
export default function ArtistWidget({ selectedArtists = [], onSelect }) {
  const { searchArtists, loading } = useSpotify();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const MAX_ARTISTS = 5;

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length > 0) {
        const results = await searchArtists(debouncedQuery);
        setSearchResults(Array.isArray(results) ? results : []);
      } else {
        setSearchResults([]);
      }
    };

    performSearch();
  }, [debouncedQuery, searchArtists]);

  const handleSelectArtist = (artist) => {
    if (!selectedArtists.find((a) => a.id === artist.id)) {
      if (selectedArtists.length < MAX_ARTISTS) {
        onSelect([...selectedArtists, artist]);
        setSearchQuery('');
        setSearchResults([]);
      }
    }
  };

  const handleRemoveArtist = (artistId) => {
    onSelect(selectedArtists.filter((a) => a.id !== artistId));
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Artists</h3>
        <span className="text-sm text-gray-400">
          {selectedArtists.length}/{MAX_ARTISTS} selected
        </span>
      </div>

      {/* Selected Artists */}
      {Array.isArray(selectedArtists) && selectedArtists.length > 0 && (
        <div className="space-y-2 mb-4">
          {selectedArtists.map((artist) => (
            <div
              key={artist.id}
              className="flex items-center gap-3 bg-[#2a2a2a] rounded-lg p-3"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                {artist.images?.[0]?.url ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{artist.name}</p>
                <p className="text-gray-400 text-xs">
                  {artist.followers?.total
                    ? `${(artist.followers.total / 1000000).toFixed(1)}M followers`
                    : 'Artist'}
                </p>
              </div>
              <button
                onClick={() => handleRemoveArtist(artist.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search for artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={selectedArtists.length >= MAX_ARTISTS}
          className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Search Results */}
      {loading && <LoadingSpinner className="py-4" />}

      {!loading && Array.isArray(searchResults) && searchResults.length > 0 && (
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {searchResults.map((artist) => {
            const isSelected = selectedArtists.find((a) => a.id === artist.id);
            const isDisabled =
              !isSelected && selectedArtists.length >= MAX_ARTISTS;

            return (
              <button
                key={artist.id}
                onClick={() => handleSelectArtist(artist)}
                disabled={isDisabled || isSelected}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all
                  ${
                    isSelected
                      ? 'bg-blue-600/20 cursor-default'
                      : isDisabled
                      ? 'bg-[#2a2a2a] opacity-50 cursor-not-allowed'
                      : 'bg-[#2a2a2a] hover:bg-[#333]'
                  }
                `}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                  {artist.images?.[0]?.url ? (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-white font-medium truncate">
                    {artist.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {artist.followers?.total
                      ? `${(artist.followers.total / 1000000).toFixed(1)}M followers`
                      : 'Artist'}
                  </p>
                </div>
                {isSelected && (
                  <span className="text-blue-500 text-xs font-medium">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!loading && searchQuery && searchResults.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No artists found
        </p>
      )}
    </div>
  );
}
