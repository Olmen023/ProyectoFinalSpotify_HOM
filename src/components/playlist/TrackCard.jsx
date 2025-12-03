'use client';

import { Play, Heart, X, Music } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

/**
 * Tarjeta individual de canción en la playlist
 */
export default function TrackCard({
  track,
  onRemove,
  showRemove = true,
  index,
  addedAt,
  showAlbum = false
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(track.id);

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
        {/* Index */}
        <span className="text-gray-400 text-sm text-center">{index}</span>

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
        <div className="text-right">
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
        {/* Play button on hover */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
            <Play fill="white" size={14} className="text-white ml-0.5" />
          </button>
        </div>
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
