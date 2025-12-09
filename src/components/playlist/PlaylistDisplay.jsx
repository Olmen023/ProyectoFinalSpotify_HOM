'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Plus, Save, Download, GripVertical, Share2 } from 'lucide-react';
import TrackCard from './TrackCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AddToPlaylistModal from '@/components/modals/AddToPlaylistModal';
import SharePlaylistModal from '@/components/modals/SharePlaylistModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * COMPONENTE AUXILIAR: SortableTrackItem
 * =======================================
 * Wrapper que hace un TrackCard draggable con @dnd-kit.
 * Agrega el icono de drag handle y el número de track.
 *
 * @param {Object} props
 * @param {Object} props.track - Objeto de canción
 * @param {number} props.index - Posición en la playlist
 * @param {Function} props.onRemove - Callback para eliminar
 * @param {Function} props.onAddToPlaylist - Callback para añadir a otra playlist
 */
function SortableTrackItem({ track, index, onRemove, onAddToPlaylist }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors"
      >
        <GripVertical size={20} />
      </div>

      {/* Track Number */}
      <span className="text-gray-400 text-sm w-6 text-center hidden md:block">
        {index + 1}
      </span>

      {/* Track Card */}
      <div className="flex-1">
        <TrackCard
          track={track}
          onRemove={onRemove}
          showAddToPlaylist={true}
          onAddToPlaylist={onAddToPlaylist}
        />
      </div>
    </div>
  );
}

/**
 * COMPONENTE: PlaylistDisplay - Visualizador de playlist generada
 * ================================================================
 * Componente principal para mostrar y gestionar una playlist generada
 * por el sistema de recomendaciones. Permite editar el nombre, reordenar
 * canciones, eliminar tracks, compartir, y guardar a Spotify.
 *
 * FUNCIONALIDAD:
 * - Muestra lista completa de canciones generadas con información visual
 * - Editor inline del nombre de la playlist
 * - Estadísticas: número de canciones y duración total
 * - Botones de acción: Refresh, Add More, Share, Save to Spotify
 * - Drag & Drop para reordenar canciones
 * - Eliminar canciones individuales
 * - Añadir canciones a playlists de Spotify (abre modal)
 * - Compartir playlist completa (abre modal)
 * - Estados de carga y vacío con mensajes informativos
 *
 * ARQUITECTURA:
 * - Componente stateful con estados locales para nombre y modales
 * - Sincroniza playlist local con prop externa mediante useEffect
 * - Sistema de drag & drop con @dnd-kit
 * - Header con tabla estilo Spotify (desktop) y cards (mobile)
 * - Sub-componentes: SortableTrackItem, TrackCard, modales
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Manejo de nombre, modales, y playlist local
 * - useEffect: Sincronización de playlist prop con estado local
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - lucide-react: Iconos (RefreshCw, Plus, Save, Download, GripVertical, Share2)
 * - @dnd-kit/core: Sistema de drag & drop
 * - @dnd-kit/sortable: Componentes sortables y utilidades
 *
 * REFERENCIAS:
 * - Importa TrackCard desde ./TrackCard (src/components/playlist/TrackCard.jsx)
 * - Importa Button desde @/components/ui/Button (src/components/ui/Button.jsx)
 * - Importa LoadingSpinner desde @/components/ui/LoadingSpinner (src/components/ui/LoadingSpinner.jsx)
 * - Importa AddToPlaylistModal desde @/components/modals/AddToPlaylistModal (src/components/modals/AddToPlaylistModal.jsx)
 * - Importa SharePlaylistModal desde @/components/modals/SharePlaylistModal (src/components/modals/SharePlaylistModal.jsx)
 *
 * UTILIZADO EN:
 * - src/app/generator/page.jsx (muestra playlist generada por recomendaciones)
 * - src/app/page.jsx (página principal con generador de playlists)
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.playlist - Array de objetos track generados
 * @param {Function} props.onRemoveTrack - Callback al eliminar track (recibe trackId)
 * @param {Function} props.onRefresh - Callback para regenerar playlist completa
 * @param {Function} props.onAddMore - Callback para añadir más canciones similares
 * @param {Function} props.onSaveToSpotify - Callback para guardar en Spotify
 * @param {Function} props.onReorderTracks - Callback con nuevo orden de tracks
 * @param {boolean} props.loading - Estado de carga durante generación
 *
 * @returns {JSX.Element} Display de playlist con controles
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Recibe playlist como prop y la sincroniza con estado local
 * 2. Si loading=true, muestra LoadingSpinner
 * 3. Si playlist vacía, muestra mensaje "No playlist generated yet"
 * 4. Si tiene canciones:
 *    - Muestra input editable para nombre de playlist
 *    - Calcula y muestra estadísticas (canciones, duración)
 *    - Renderiza botones de acción
 *    - Muestra lista de tracks con drag & drop habilitado
 * 5. Al reordenar:
 *    - handleDragEnd actualiza orden local con arrayMove
 *    - Llama a onReorderTracks con nuevo orden
 * 6. Modales se abren/cierran según estado local
 */
export default function PlaylistDisplay({
  playlist = [],
  onRemoveTrack,
  onRefresh,
  onAddMore,
  onSaveToSpotify,
  onReorderTracks,
  loading = false,
}) {
  const [playlistName, setPlaylistName] = useState('My Custom Playlist');
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [localPlaylist, setLocalPlaylist] = useState(playlist);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Actualizar playlist local cuando cambia la prop
  useEffect(() => {
    setLocalPlaylist(playlist);
  }, [playlist]);

  const handleRemoveTrack = (trackId) => {
    onRemoveTrack?.(trackId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLocalPlaylist((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Notificar al componente padre del nuevo orden
        if (onReorderTracks) {
          onReorderTracks(newOrder);
        }

        return newOrder;
      });
    }
  };

  const playlistArray = Array.isArray(localPlaylist) ? localPlaylist : [];
  const totalDuration = playlistArray.reduce(
    (acc, track) => acc + (track?.duration_ms || 0),
    0
  );
  const formatTotalDuration = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="bg-[#181818] rounded-xl p-8">
        <LoadingSpinner className="py-12" size="lg" />
        <p className="text-center text-gray-400 mt-4">
          Generating your playlist...
        </p>
      </div>
    );
  }

  if (playlistArray.length === 0) {
    return (
      <div className="bg-[#181818] rounded-xl p-8 text-center">
        <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
          <Download size={32} className="text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          No playlist generated yet
        </h3>
        <p className="text-gray-400 mb-6">
          Select your preferences from the widgets above and click &quot;Generate
          Playlist&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] rounded-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="text-2xl font-bold text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1 -ml-2 mb-2"
        />
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{playlistArray.length} songs</span>
          <span>•</span>
          <span>{formatTotalDuration(totalDuration)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={onRefresh}
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh Playlist
        </Button>

        <Button
          onClick={onAddMore}
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add More Songs
        </Button>

        <Button
          onClick={() => setShowShareModal(true)}
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
        >
          <Share2 size={16} />
          Share
        </Button>

        {onSaveToSpotify && (
          <Button
            onClick={onSaveToSpotify}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Save size={16} />
            Save to Spotify
          </Button>
        )}
      </div>

      {/* Track List Header (Desktop) */}
      <div className="hidden md:flex items-center gap-4 px-3 py-2 border-b border-gray-700 text-sm text-gray-400 font-medium mb-2">
        <div className="w-14">#</div>
        <div className="flex-1">TITLE</div>
        <div className="flex-1">ALBUM</div>
        <div className="w-32 text-right">DURATION</div>
      </div>

      {/* Track List with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={playlistArray.map(track => track.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {playlistArray.map((track, index) => (
              <SortableTrackItem
                key={track.id}
                track={track}
                index={index}
                onRemove={handleRemoveTrack}
                onAddToPlaylist={setSelectedTrackForPlaylist}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add to Playlist Modal */}
      {selectedTrackForPlaylist && (
        <AddToPlaylistModal
          track={selectedTrackForPlaylist}
          onClose={() => setSelectedTrackForPlaylist(null)}
        />
      )}

      {/* Share Playlist Modal */}
      {showShareModal && (
        <SharePlaylistModal
          playlist={playlistArray}
          playlistName={playlistName}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
