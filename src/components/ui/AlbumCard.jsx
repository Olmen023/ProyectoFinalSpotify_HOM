'use client';

import { Play, Plus } from 'lucide-react';

/**
 * Tarjeta de álbum/artista con efecto hover y botón play
 */
export default function AlbumCard({
  id,
  name,
  image,
  artist,
  type,
  // Props antiguas para compatibilidad
  title,
  subtitle,
  onClick,
  onPlayClick,
  onAddToPlaylist,
  showAddButton = false,
  track // Para poder añadir a playlist
}) {
  // Usar nuevas props con fallback a props antiguas
  const displayTitle = name || title || 'Unknown';
  const displaySubtitle = artist || subtitle || '';
  const displayImage = image || '/placeholder-album.png';

  return (
    <div
      onClick={onClick}
      className="group bg-[#181818] p-4 rounded-xl hover:bg-[#222] transition-colors cursor-pointer ease-in-out duration-200"
    >
      <div className="relative aspect-square rounded-md overflow-hidden mb-4 shadow-lg">
        <img
          src={displayImage}
          alt={displayTitle}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Botones (aparecen en hover) */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          {/* Botón Add to Playlist */}
          {showAddButton && onAddToPlaylist && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlaylist(track);
              }}
              className="bg-green-600 rounded-full p-3 shadow-xl hover:bg-green-500 hover:scale-105 transition-all"
            >
              <Plus size={20} className="text-white" />
            </div>
          )}
          {/* Botón Play */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPlayClick?.();
            }}
            className="bg-blue-600 rounded-full p-3 shadow-xl hover:bg-blue-500 hover:scale-105 transition-all"
          >
            <Play fill="white" size={20} className="text-white" />
          </div>
        </div>
      </div>
      <h3 className="font-bold text-white text-base truncate">{displayTitle}</h3>
      <p className="text-sm text-gray-400 mt-1 truncate">{displaySubtitle}</p>
    </div>
  );
}
