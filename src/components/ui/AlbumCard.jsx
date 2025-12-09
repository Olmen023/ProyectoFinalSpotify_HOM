'use client';

import { Play, Plus } from 'lucide-react';

/**
 * COMPONENTE: AlbumCard - Tarjeta visual de álbum/artista/track
 * ==============================================================
 * Componente de tarjeta genérico que muestra contenido musical (álbum, artista, o track)
 * con imagen, título, subtítulo y botones de acción que aparecen en hover.
 * Usado principalmente para mostrar resultados de búsqueda y recomendaciones.
 *
 * FUNCIONALIDAD:
 * - Muestra imagen cuadrada con efecto zoom en hover
 * - Título y subtítulo truncados si son muy largos
 * - Botones de Play y Add que aparecen en hover con animaciones
 * - Soporte para props antiguas y nuevas (retrocompatibilidad)
 * - Click en toda la card ejecuta acción principal (o añadir a playlist)
 * - Imagen placeholder si no hay cover disponible
 *
 * ARQUITECTURA:
 * - Componente presentacional sin estado
 * - Estilos con Tailwind y efectos CSS (hover, scale, opacity)
 * - Fallback de props para compatibilidad con código antiguo
 * - Card clickeable completa con stopPropagation en botones internos
 *
 * DEPENDENCIAS DE REACT:
 * - Ninguna (componente puramente presentacional)
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - lucide-react: Iconos (Play, Plus)
 *
 * REFERENCIAS:
 * - No importa otros componentes locales
 *
 * UTILIZADO EN:
 * - src/app/search/page.jsx (mostrar resultados de búsqueda)
 * - src/app/browse/page.jsx (mostrar álbumes y artistas)
 * - src/components/widgets/* (mostrar recomendaciones en widgets)
 * - Cualquier lugar que necesite mostrar contenido musical en formato card
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID del item (álbum, artista, o track)
 * @param {string} props.name - Nombre del item (nueva prop, recomendada)
 * @param {string} props.image - URL de la imagen del item (nueva prop)
 * @param {string} props.artist - Nombre del artista o info secundaria (nueva prop)
 * @param {string} props.type - Tipo de contenido: 'album', 'artist', 'track'
 * @param {string} props.title - Título del item (prop antigua, fallback)
 * @param {string} props.subtitle - Subtítulo del item (prop antigua, fallback)
 * @param {Function} props.onClick - Callback al hacer clic en la card
 * @param {Function} props.onPlayClick - Callback al hacer clic en botón Play
 * @param {Function} props.onAddToPlaylist - Callback al añadir a playlist
 * @param {boolean} props.showAddButton - Si muestra botón de añadir (default: false)
 * @param {Object} props.track - Objeto track completo (para pasar a onAddToPlaylist)
 *
 * @returns {JSX.Element} Card de álbum/artista con hover effects
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Determina qué props usar (nuevas con fallback a antiguas)
 * 2. Al hacer clic en la card:
 *    - Si showAddButton=true y hay track: llama a onAddToPlaylist(track)
 *    - Si no: llama a onClick() genérico
 * 3. Al hacer hover: muestra botones con animación (opacity y translate)
 * 4. Botón Play: ejecuta onPlayClick con stopPropagation
 * 5. Botón Add: ejecuta onAddToPlaylist(track) con stopPropagation
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

  // Si es un track con botón de añadir, hacer que toda la tarjeta sea clickeable
  const handleCardClick = () => {
    if (showAddButton && onAddToPlaylist && track) {
      onAddToPlaylist(track);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
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
