'use client';

import { useState, useEffect } from 'react';
import { X, Play, Pause, Clock, Music, Plus, Trash2, GripVertical, Share2 } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AddToPlaylistModal from './AddToPlaylistModal';
import SharePlaylistModal from './SharePlaylistModal';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
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
 * Componente de track sortable
 */
function SortableTrack({ track, index, addedAt, onRemove, onAddToPlaylist }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const { currentTrack, isPlaying, play } = useAudioPlayerContext();
  const isCurrentTrack = currentTrack?.id === track.id;
  const showPlayButton = track.preview_url;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[20px_16px_6fr_4fr_3fr_1fr_60px] gap-4 px-4 py-2 rounded hover:bg-[#2a2a2a] transition-colors group items-center"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors"
      >
        <GripVertical size={16} />
      </div>

      {/* Index / Play Button */}
      <div className="text-center">
        {showPlayButton ? (
          <button
            onClick={() => play(track)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isCurrentTrack && isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
          </button>
        ) : (
          <span className="text-gray-400 text-sm">{index + 1}</span>
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
          <p className="text-white font-medium truncate">{track.name}</p>
          <p className="text-gray-400 text-sm truncate">
            {Array.isArray(track.artists)
              ? track.artists.map((a) => a.name).join(', ')
              : 'Unknown Artist'}
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
          {addedAt ? new Date(addedAt).toLocaleDateString() : '-'}
        </p>
      </div>

      {/* Duration */}
      <div className="text-right">
        <span className="text-gray-400 text-sm">
          {formatDuration(track.duration_ms || 0)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onAddToPlaylist(track)}
          className="text-gray-400 hover:text-green-500 transition-colors opacity-0 group-hover:opacity-100"
          title="Add to another playlist"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => onRemove(track.uri)}
          className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          title="Remove from playlist"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * Modal para ver detalles de una playlist y gestionar canciones
 */
export default function PlaylistModal({ playlistId, onClose }) {
  const { getPlaylistDetails, getPlaylistTracks, removeTrackFromPlaylist, deletePlaylist } = useSpotify();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!playlistId) return;

    const loadPlaylistData = async () => {
      setLoading(true);
      try {
        const [playlistData, playlistTracks] = await Promise.all([
          getPlaylistDetails(playlistId),
          getPlaylistTracks(playlistId)
        ]);

        setPlaylist(playlistData);
        setTracks(Array.isArray(playlistTracks) ? playlistTracks : []);
      } catch (error) {
        console.error('Error loading playlist:', error);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylistData();
  }, [playlistId, getPlaylistDetails, getPlaylistTracks]);

  const handleRemoveTrack = async (trackUri) => {
    if (!confirm('¿Eliminar esta canción de la playlist?')) return;

    try {
      await removeTrackFromPlaylist(playlistId, trackUri);
      // Actualizar la lista localmente
      setTracks(tracks.filter(item => item.track?.uri !== trackUri));
    } catch (error) {
      console.error('Error removing track:', error);
      alert('Error al eliminar la canción');
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTracks((items) => {
        const oldIndex = items.findIndex((item) => item.track?.id === active.id);
        const newIndex = items.findIndex((item) => item.track?.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta playlist? Esta acción no se puede deshacer.')) return;

    try {
      const success = await deletePlaylist(playlistId);
      if (success) {
        alert('Playlist eliminada correctamente');
        onClose();
        // Recargar la página para actualizar la lista de playlists
        window.location.reload();
      } else {
        throw new Error('Failed to delete playlist');
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      alert('Error al eliminar la playlist');
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = Array.isArray(tracks)
    ? tracks.reduce((acc, item) => acc + (item.track?.duration_ms || 0), 0)
    : 0;
  const hours = Math.floor(totalDuration / 3600000);
  const minutes = Math.floor((totalDuration % 3600000) / 60000);

  if (!playlistId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121212] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-b from-blue-900/40 to-[#121212] p-6 flex items-end gap-6">
          {/* Playlist Cover */}
          <div className="w-48 h-48 rounded-lg shadow-2xl overflow-hidden bg-gray-800 flex-shrink-0">
            {playlist?.images?.[0]?.url ? (
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music size={64} className="text-gray-600" />
              </div>
            )}
          </div>

          {/* Playlist Info */}
          <div className="flex-1 pb-2">
            <p className="text-sm font-semibold uppercase mb-2 text-gray-300">Playlist</p>
            <h2 className="text-4xl font-bold mb-4 text-white">{playlist?.name || 'Loading...'}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="font-semibold">{playlist?.owner?.display_name}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">{tracks.length} songs</span>
              {totalDuration > 0 && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">
                    {hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`}
                  </span>
                </>
              )}
            </div>
            {playlist?.description && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">{playlist.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="w-10 h-10 rounded-full bg-blue-600/80 hover:bg-blue-600 flex items-center justify-center transition-colors"
              title="Share playlist"
            >
              <Share2 size={20} className="text-white" />
            </button>
            {/* Delete Button */}
            <button
              onClick={handleDeletePlaylist}
              className="w-10 h-10 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition-colors"
              title="Delete playlist"
            >
              <Trash2 size={20} className="text-white" />
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : tracks.length > 0 ? (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-[20px_16px_6fr_4fr_3fr_1fr_60px] gap-4 px-4 py-3 text-sm text-gray-400 border-b border-gray-800 mb-2 sticky top-0 bg-[#121212]">
                <span></span>
                <span>#</span>
                <span>Title</span>
                <span>Album</span>
                <span>Date Added</span>
                <Clock size={16} />
                <span></span>
              </div>

              {/* Tracks with Drag & Drop */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={tracks.map(item => item.track?.id).filter(Boolean)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {tracks.map((item, index) => {
                      const track = item?.track;
                      if (!track || !track.id) return null;

                      return (
                        <SortableTrack
                          key={track.id}
                          track={track}
                          index={index}
                          addedAt={item.added_at}
                          onRemove={handleRemoveTrack}
                          onAddToPlaylist={setSelectedTrackForPlaylist}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Music size={64} className="mb-4 opacity-50" />
              <p className="text-lg">No tracks in this playlist</p>
            </div>
          )}
        </div>
      </div>

      {/* Add to Playlist Modal */}
      {selectedTrackForPlaylist && (
        <AddToPlaylistModal
          track={selectedTrackForPlaylist}
          onClose={() => setSelectedTrackForPlaylist(null)}
          onSuccess={() => {
            console.log('Track added to another playlist!');
          }}
        />
      )}

      {/* Share Playlist Modal */}
      {showShareModal && playlist && (
        <SharePlaylistModal
          playlist={tracks.map(item => item.track).filter(Boolean)}
          playlistName={playlist.name}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
