'use client';

import { useState, useEffect } from 'react';
import { Heart, Play, Clock, Music } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import TrackCard from '@/components/playlist/TrackCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AddToPlaylistModal from '@/components/modals/AddToPlaylistModal';
import { useSpotify } from '@/hooks/useSpotify';
import { useFavorites } from '@/hooks/useFavorites';

/**
 * Cliente de Liked Songs - Canciones favoritas del usuario
 */
export default function FavoritesClient() {
  const { getUserProfile, getUserSavedTracks } = useSpotify();
  const { favorites } = useFavorites();
  const [user, setUser] = useState(null);
  const [likedTracks, setLikedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const profile = await getUserProfile();
        setUser(profile);

        // Cargar canciones guardadas de Spotify
        const savedTracks = await getUserSavedTracks();
        setLikedTracks(savedTracks || []);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setLikedTracks([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [getUserProfile, getUserSavedTracks]);

  const handlePlayAll = () => {
    // Implementar reproducción de todas las canciones
    alert('Playing all liked songs...');
  };

  const sortedTracks = Array.isArray(likedTracks)
    ? [...likedTracks].sort((a, b) => {
        switch (sortBy) {
          case 'recent':
            return (b.added_at || 0) - (a.added_at || 0);
          case 'title':
            const aName = a?.track?.name || '';
            const bName = b?.track?.name || '';
            return aName.localeCompare(bName);
          case 'artist':
            const aArtist = a?.track?.artists?.[0]?.name || '';
            const bArtist = b?.track?.artists?.[0]?.name || '';
            return aArtist.localeCompare(bArtist);
          default:
            return 0;
        }
      })
    : [];

  const totalDuration = Array.isArray(likedTracks)
    ? likedTracks.reduce((acc, item) => acc + (item.track?.duration_ms || 0), 0)
    : 0;
  const hours = Math.floor(totalDuration / 3600000);
  const minutes = Math.floor((totalDuration % 3600000) / 60000);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative bg-black">
        <TopBar user={user} />

        {/* Hero Section */}
        <div className="bg-gradient-to-b from-purple-900/40 to-black px-6 pt-6 pb-8">
          <div className="flex items-end gap-6 max-w-7xl">
            {/* Playlist Cover */}
            <div className="flex-shrink-0 w-56 h-56 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-2xl flex items-center justify-center">
              <Heart size={96} className="text-white" fill="white" />
            </div>

            {/* Playlist Info */}
            <div className="flex-1 pb-4">
              <p className="text-sm font-semibold uppercase mb-2">Playlist</p>
              <h1 className="text-6xl font-bold mb-6">Liked Songs</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{user?.display_name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{likedTracks?.length || 0} songs</span>
                {totalDuration > 0 && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">
                      {hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-black/40 backdrop-blur-md px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlayAll}
                disabled={(likedTracks?.length || 0) === 0}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center"
              >
                <Play size={24} fill="black" className="text-black ml-1" />
              </Button>
              <Heart
                size={32}
                className="text-green-500 cursor-pointer"
                fill="currentColor"
              />
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#282828] text-white px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title</option>
                <option value="artist">Artist</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="px-6 pb-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (likedTracks?.length || 0) > 0 ? (
            <div className="space-y-1">
              {/* Table Header */}
              <div className="grid grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800 mb-2">
                <span>#</span>
                <span>Title</span>
                <span>Album</span>
                <span>Date Added</span>
                <Clock size={16} />
              </div>

              {/* Tracks */}
              {Array.isArray(sortedTracks) && sortedTracks.map((item, index) => (
                item && item.track && item.track.id ? (
                  <TrackCard
                    key={item.track.id}
                    track={item.track}
                    index={index + 1}
                    addedAt={item.added_at}
                    showAlbum={true}
                    showAddToPlaylist={true}
                    showRemove={false}
                    onAddToPlaylist={setSelectedTrackForPlaylist}
                  />
                ) : null
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Music size={64} className="mb-4 opacity-50" />
              <p className="text-lg mb-2">No liked songs yet</p>
              <p className="text-sm">
                Songs you like will appear here. Start exploring!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add to Playlist Modal */}
      {selectedTrackForPlaylist && (
        <AddToPlaylistModal
          track={selectedTrackForPlaylist}
          onClose={() => setSelectedTrackForPlaylist(null)}
          onSuccess={() => {
            console.log('Track added to playlist successfully!');
          }}
        />
      )}
    </div>
  );
}
