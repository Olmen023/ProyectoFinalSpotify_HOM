'use client';

import { useState, useEffect } from 'react';
import { X, Music, Plus, Check } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Modal para añadir una canción a una playlist existente
 */
export default function AddToPlaylistModal({ track, onClose, onSuccess }) {
  const { getUserPlaylists, addTracksToPlaylist, createPlaylist } = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      try {
        const userPlaylists = await getUserPlaylists();
        setPlaylists(Array.isArray(userPlaylists) ? userPlaylists : []);
      } catch (error) {
        console.error('Error loading playlists:', error);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [getUserPlaylists]);

  const handleAddToPlaylist = async (playlistId) => {
    if (!track || !track.uri) {
      alert('Error: Track URI not available');
      return;
    }

    setAdding(playlistId);
    try {
      await addTracksToPlaylist(playlistId, [track.uri]);

      // Mostrar checkmark por 1 segundo
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      alert('Error al añadir la canción a la playlist');
      setAdding(null);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setCreating(true);
    try {
      const newPlaylist = await createPlaylist(newPlaylistName.trim(), '', true);

      if (newPlaylist && newPlaylist.id) {
        // Añadir la canción a la nueva playlist
        await addTracksToPlaylist(newPlaylist.id, [track.uri]);

        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1000);
      } else {
        throw new Error('Failed to create playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Error al crear la playlist');
    } finally {
      setCreating(false);
    }
  };

  if (!track) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#282828] rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Add to Playlist</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Track Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded overflow-hidden bg-gray-700 flex-shrink-0">
              {track.album?.images?.[0]?.url ? (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={20} className="text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{track.name}</p>
              <p className="text-gray-400 text-sm truncate">
                {Array.isArray(track.artists)
                  ? track.artists.map((a) => a.name).join(', ')
                  : 'Unknown Artist'}
              </p>
            </div>
          </div>
        </div>

        {/* Playlists List */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Create New Playlist */}
          <div className="mb-4">
            {!showCreateNew ? (
              <button
                onClick={() => setShowCreateNew(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
              >
                <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                  <Plus size={24} className="text-white" />
                </div>
                <span className="text-white font-medium">Create new playlist</span>
              </button>
            ) : (
              <form onSubmit={handleCreatePlaylist} className="space-y-2">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  autoFocus
                  className="w-full bg-[#181818] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={creating || !newPlaylistName.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create & Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateNew(false);
                      setNewPlaylistName('');
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Existing Playlists */}
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : playlists.length > 0 ? (
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium mb-2 px-2">Your Playlists</p>
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  disabled={adding === playlist.id}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                    {playlist.images?.[0]?.url ? (
                      <img
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music size={20} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{playlist.name}</p>
                    <p className="text-gray-400 text-sm truncate">
                      {playlist.tracks?.total || 0} songs
                    </p>
                  </div>
                  {adding === playlist.id && (
                    <Check size={24} className="text-green-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="mb-2">No playlists found</p>
              <p className="text-sm">Create your first playlist above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
