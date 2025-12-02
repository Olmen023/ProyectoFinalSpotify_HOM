'use client';

import { Play } from 'lucide-react';

/**
 * Tarjeta de álbum/artista con efecto hover y botón play
 */
export default function AlbumCard({
  image,
  title,
  subtitle,
  onClick,
  onPlayClick
}) {
  return (
    <div
      onClick={onClick}
      className="group bg-[#181818] p-4 rounded-xl hover:bg-[#222] transition-colors cursor-pointer ease-in-out duration-200"
    >
      <div className="relative aspect-square rounded-md overflow-hidden mb-4 shadow-lg">
        <img
          src={image || '/placeholder-album.png'}
          alt={title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Botón Play (aparece en hover) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPlayClick?.();
          }}
          className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl hover:bg-blue-500 hover:scale-105"
        >
          <Play fill="white" size={20} className="text-white" />
        </div>
      </div>
      <h3 className="font-bold text-white text-base truncate">{title}</h3>
      <p className="text-sm text-gray-400 mt-1 truncate">{subtitle}</p>
    </div>
  );
}
