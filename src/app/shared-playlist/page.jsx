'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Music, Home, Heart } from 'lucide-react';
import TrackCard from '@/components/playlist/TrackCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSpotify } from '@/hooks/useSpotify';

function SharedPlaylistContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getTracksByIds } = useSpotify();

  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedPlaylist = async () => {
      try {
        const trackIds = searchParams.get('tracks');
        const name = searchParams.get('name');

        if (!trackIds) {
          setError('Invalid playlist link');
          setLoading(false);
          return;
        }

        const trackIdArray = trackIds.split(',');
        setPlaylistName(decodeURIComponent(name || 'Shared Playlist'));

        // Obtener información de las canciones
        const tracks = await getTracksByIds(trackIdArray);

        if (tracks && tracks.length > 0) {
          setPlaylist(tracks);
        } else {
          setError('Failed to load playlist');
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load playlist');
        setLoading(false);
      }
    };

    loadSharedPlaylist();
  }, [searchParams, getTracksByIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard')} variant="primary">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const totalDuration = playlist.reduce(
    (acc, track) => acc + (track?.duration_ms || 0),
    0
  );

  const formatTotalDuration = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-900 to-black pb-8">
        <div className="max-w-6xl mx-auto px-6 pt-20">
          <div className="flex items-end gap-6">
            {/* Playlist Cover */}
            <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-2xl">
              <Music size={80} className="text-white" />
            </div>

            {/* Playlist Info */}
            <div className="flex-1 pb-2">
              <p className="text-sm font-semibold text-white/80 mb-2">SHARED PLAYLIST</p>
              <h1 className="text-5xl font-bold text-white mb-4">{playlistName}</h1>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>{playlist.length} songs</span>
                <span>•</span>
                <span>{formatTotalDuration(totalDuration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Home size={18} />
            Go to Dashboard
          </Button>
        </div>

        {/* Track List */}
        <div className="bg-[#181818] rounded-xl p-6">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[16px_6fr_4fr_1fr] gap-4 px-4 py-2 border-b border-gray-700 text-sm text-gray-400 font-medium mb-2">
            <span className="text-center">#</span>
            <span>TITLE</span>
            <span>ALBUM</span>
            <span className="text-right">DURATION</span>
          </div>

          {/* Tracks */}
          <div className="space-y-1">
            {playlist.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                index={index + 1}
                showAlbum={true}
                showRemove={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SharedPlaylistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <SharedPlaylistContent />
    </Suspense>
  );
}
