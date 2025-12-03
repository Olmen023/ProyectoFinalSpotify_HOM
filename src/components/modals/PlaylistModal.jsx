'use client';

import { useState, useEffect } from 'react';
import { X, Play, Clock, Music } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Modal para ver detalles de una playlist y gestionar canciones
 */
export default function PlaylistModal({ playlistId, onClose }) {
  const { getPlaylistDetails, getPlaylistTracks, removeTrackFromPlaylist } = useSpotify();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : tracks.length > 0 ? (
            <div className="space-y-1">
              {/* Table Header */}
              <div className="grid grid-cols-[16px_6fr_4fr_3fr_1fr_40px] gap-4 px-4 py-3 text-sm text-gray-400 border-b border-gray-800 mb-2 sticky top-0 bg-[#121212]">
                <span>#</span>
                <span>Title</span>
                <span>Album</span>
                <span>Date Added</span>
                <Clock size={16} />
                <span></span>
              </div>

              {/* Tracks */}
              {tracks.map((item, index) => {
                const track = item?.track;
                if (!track || !track.id) return null;

                return (
                  <div
                    key={`${track.id}-${index}`}
                    className="grid grid-cols-[16px_6fr_4fr_3fr_1fr_40px] gap-4 px-4 py-2 rounded hover:bg-[#2a2a2a] transition-colors group items-center"
                  >
                    {/* Index */}
                    <span className="text-gray-400 text-sm text-center">{index + 1}</span>

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
                        {item.added_at ? new Date(item.added_at).toLocaleDateString() : '-'}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="text-right">
                      <span className="text-gray-400 text-sm">
                        {formatDuration(track.duration_ms || 0)}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleRemoveTrack(track.uri)}
                        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from playlist"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Music size={64} className="mb-4 opacity-50" />
              <p className="text-lg">No tracks in this playlist</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
