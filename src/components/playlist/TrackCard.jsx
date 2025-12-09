'use client';

import { Play, Pause, Heart, X, Music, Plus } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

/**
 * COMPONENTE: TrackCard - Tarjeta de canción individual
 * ======================================================
 * Componente reutilizable que muestra la información de una canción
 * con controles de reproducción, favoritos, y acciones adicionales.
 * Soporta dos formatos de visualización: card tradicional y formato tabla.
 *
 * FUNCIONALIDAD:
 * - Muestra información completa de la canción (cover, título, artista, álbum)
 * - Botón de reproducción de preview (30 segundos) integrado con AudioPlayer
 * - Sistema de favoritos con persistencia en localStorage
 * - Indicador visual cuando es la canción actual reproduciéndose
 * - Botón para añadir a otra playlist (opcional)
 * - Botón para eliminar de la playlist actual (opcional)
 * - Muestra duración de la canción formateada
 * - Dos modos de visualización: card o tabla (para páginas como Liked Songs)
 * - Estados disabled si no hay preview_url disponible
 *
 * ARQUITECTURA:
 * - Componente altamente configurable mediante props booleanas
 * - Dos renders condicionales según props (tabla vs card)
 * - Integración con múltiples contextos (AudioPlayer, Favorites)
 * - Efectos hover para mostrar/ocultar botones de acción
 * - Formateo de duración y fechas relativas
 *
 * DEPENDENCIAS DE REACT:
 * - No usa hooks propios, solo hooks importados
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - lucide-react: Iconos (Play, Pause, Heart, X, Music, Plus)
 *
 * REFERENCIAS:
 * - Importa useFavorites desde @/hooks/useFavorites (src/hooks/useFavorites.jsx)
 * - Importa useAudioPlayerContext desde @/contexts/AudioPlayerContext (src/contexts/AudioPlayerContext.jsx)
 *
 * UTILIZADO EN:
 * - src/components/playlist/PlaylistDisplay.jsx (lista de canciones generadas)
 * - src/components/modals/PlaylistModal.jsx (dentro de SortableTrack)
 * - src/app/liked-songs/page.jsx (formato tabla con showAlbum=true)
 * - Cualquier lista de canciones que necesite mostrar tracks
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.track - Objeto completo de canción de Spotify
 * @param {string} props.track.id - ID único de la canción
 * @param {string} props.track.name - Nombre de la canción
 * @param {Array} props.track.artists - Array de artistas
 * @param {Object} props.track.album - Información del álbum
 * @param {number} props.track.duration_ms - Duración en milisegundos
 * @param {string} props.track.preview_url - URL del preview de 30seg (puede ser null)
 * @param {Function} props.onRemove - Callback al eliminar (recibe track.id)
 * @param {boolean} props.showRemove - Si muestra botón de eliminar (default: true)
 * @param {boolean} props.showAddToPlaylist - Si muestra botón de añadir a playlist (default: false)
 * @param {Function} props.onAddToPlaylist - Callback al añadir a playlist (recibe track)
 * @param {number} props.index - Índice en lista (para formato tabla)
 * @param {string} props.addedAt - Fecha ISO cuando se añadió (para formato tabla)
 * @param {boolean} props.showAlbum - Si usa formato tabla con columna de álbum (default: false)
 *
 * @returns {JSX.Element} Tarjeta de canción en formato card o tabla
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Verifica si index y showAlbum están definidos para decidir formato
 * 2. Obtiene estado de favorito desde useFavorites hook
 * 3. Obtiene estado de reproducción desde AudioPlayerContext
 * 4. Si es formato tabla (index !== undefined && showAlbum):
 *    - Renderiza row de tabla con columnas: #/Play, Título+Artista, Álbum, Fecha, Duración
 *    - Botón play visible solo en hover o si es track actual
 * 5. Si es formato card (default):
 *    - Renderiza card con cover, info, y botones de acción
 *    - Botones de añadir/eliminar visibles solo en hover
 * 6. Al hacer clic en play:
 *    - Si hay preview_url, llama a play(track) del AudioPlayer
 *    - Si no hay preview_url, botón está disabled
 * 7. Botón de corazón:
 *    - Llama a toggleFavorite(track) para añadir/quitar de favoritos
 *    - Cambia color según estado isFavorite
 */
export default function TrackCard({
  track,
  onRemove,
  showRemove = true,
  showAddToPlaylist = false,
  onAddToPlaylist,
  index,
  addedAt,
  showAlbum = false
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { currentTrack, isPlaying, play } = useAudioPlayerContext();
  const isFav = isFavorite(track.id);
  const isCurrentTrack = currentTrack?.id === track.id;
  const showPlayButton = track.preview_url;

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Formato de tabla para páginas como Liked Songs
  if (index !== undefined && showAlbum) {
    return (
      <div className="grid grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 py-2 rounded hover:bg-[#2a2a2a] transition-colors group items-center">
        {/* Index / Play Button */}
        <div className="text-center">
          {showPlayButton ? (
            <button
              onClick={() => play(track)}
              className="text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              {isCurrentTrack && isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" />
              )}
            </button>
          ) : (
            <span className="text-gray-400 text-sm">{index}</span>
          )}
        </div>

        {/* Title + Artist */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-700 flex-shrink-0">
            {track.album?.images?.[0]?.url ? (
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music size={16} className="text-gray-500" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{track.name || 'Unknown Track'}</p>
            <p className="text-gray-400 text-sm truncate">
              {Array.isArray(track.artists) ? track.artists.map((a) => a.name).join(', ') : 'Unknown Artist'}
            </p>
          </div>
        </div>

        {/* Album */}
        <div className="min-w-0">
          <p className="text-gray-400 text-sm truncate">
            {track.album?.name || 'Unknown Album'}
          </p>
        </div>

        {/* Date Added */}
        <div className="min-w-0">
          <p className="text-gray-400 text-sm truncate">
            {formatDate(addedAt)}
          </p>
        </div>

        {/* Duration */}
        <div className="text-right flex items-center justify-end gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={() => showPlayButton && play(track)}
            disabled={!showPlayButton}
            className={`transition-colors ${
              !showPlayButton
                ? 'text-gray-600 cursor-not-allowed'
                : isCurrentTrack && isPlaying
                ? 'text-blue-500 hover:text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
            title={
              !showPlayButton
                ? 'No preview available'
                : isCurrentTrack && isPlaying
                ? 'Pause preview'
                : 'Play preview'
            }
          >
            {isCurrentTrack && isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
          </button>

          <span className="text-gray-400 text-sm">
            {formatDuration(track.duration_ms)}
          </span>
        </div>
      </div>
    );
  }

  // Formato de card tradicional
  return (
    <div className="group flex items-center gap-4 p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors">
      {/* Album Cover */}
      <div className="relative w-14 h-14 rounded overflow-hidden bg-gray-700 flex-shrink-0">
        {track.album?.images?.[0]?.url ? (
          <img
            src={track.album.images[0].url}
            alt={track.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music size={24} className="text-gray-500" />
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{track.name || 'Unknown Track'}</p>
        <p className="text-gray-400 text-sm truncate">
          {Array.isArray(track.artists) ? track.artists.map((a) => a.name).join(', ') : 'Unknown Artist'}
        </p>
      </div>

      {/* Album Name */}
      <div className="hidden md:block flex-1 min-w-0">
        <p className="text-gray-400 text-sm truncate">
          {track.album?.name || 'Unknown Album'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Add to Playlist Button */}
        {showAddToPlaylist && (
          <button
            onClick={() => onAddToPlaylist?.(track)}
            className="text-gray-400 hover:text-green-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Add to playlist"
          >
            <Plus size={18} />
          </button>
        )}

        {/* Play/Pause Button - Always visible */}
        <button
          onClick={() => showPlayButton && play(track)}
          disabled={!showPlayButton}
          className={`transition-colors ${
            !showPlayButton
              ? 'text-gray-600 cursor-not-allowed'
              : isCurrentTrack && isPlaying
              ? 'text-blue-500 hover:text-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
          title={
            !showPlayButton
              ? 'No preview available'
              : isCurrentTrack && isPlaying
              ? 'Pause preview'
              : 'Play preview'
          }
        >
          {isCurrentTrack && isPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" />
          )}
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(track)}
          className={`transition-colors ${
            isFav
              ? 'text-blue-500 hover:text-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {/* Duration */}
        <span className="text-gray-400 text-sm w-12 text-right">
          {formatDuration(track.duration_ms)}
        </span>

        {/* Remove Button */}
        {showRemove && (
          <button
            onClick={() => onRemove?.(track.id)}
            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
