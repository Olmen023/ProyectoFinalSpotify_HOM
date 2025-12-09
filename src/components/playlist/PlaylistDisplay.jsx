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
 * Componente de item sortable
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
 * Componente principal para visualizar y gestionar playlist generada
 * Incluye funcionalidades: eliminar tracks, favoritos, refrescar, añadir más, drag & drop
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
