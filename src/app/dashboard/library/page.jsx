'use client';

import { useState, useEffect } from 'react';
import { Library, Music, User, Disc, Clock } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import AlbumCard from '@/components/ui/AlbumCard';
import FilterChips from '@/components/ui/FilterChips';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSpotify } from '@/hooks/useSpotify';

// Forzar renderizado dinámico para esta página
export const dynamic = 'force-dynamic';

/**
 * Página de Your Library - Biblioteca personal del usuario
 */
export default function LibraryPage() {
  const { getUserProfile, getUserPlaylists, getUserTopArtists, getUserSavedAlbums } = useSpotify();
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('playlists');

  useEffect(() => {
    const loadLibraryData = async () => {
      setLoading(true);
      try {
        const profile = await getUserProfile();
        setUser(profile);

        // Cargar playlists
        const userPlaylists = await getUserPlaylists();
        setPlaylists(userPlaylists);

        // Cargar artistas favoritos
        const topArtists = await getUserTopArtists(20);
        setArtists(topArtists);

        // Cargar álbumes guardados
        const savedAlbums = await getUserSavedAlbums();
        setAlbums(savedAlbums);
      } finally {
        setLoading(false);
      }
    };

    loadLibraryData();
  }, [getUserProfile, getUserPlaylists, getUserTopArtists, getUserSavedAlbums]);

  const filters = [
    { id: 'playlists', label: 'Playlists', icon: Music },
    { id: 'artists', label: 'Artists', icon: User },
    { id: 'albums', label: 'Albums', icon: Disc },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      );
    }

    let items = [];
    let emptyMessage = '';

    switch (activeFilter) {
      case 'playlists':
        items = playlists;
        emptyMessage = 'No playlists found. Create your first playlist!';
        break;
      case 'artists':
        items = artists;
        emptyMessage = 'No artists found. Start listening to discover new artists!';
        break;
      case 'albums':
        items = albums;
        emptyMessage = 'No albums saved. Save your favorite albums!';
        break;
      default:
        items = [];
    }

    if ((items?.length || 0) === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Library size={64} className="mb-4 opacity-50" />
          <p className="text-lg">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items?.map((item) => (
          <AlbumCard
            key={item.id}
            id={item.id}
            name={item.name}
            image={
              item.images?.[0]?.url ||
              item.album?.images?.[0]?.url ||
              '/placeholder.png'
            }
            artist={
              item.owner?.display_name ||
              item.artists?.[0]?.name ||
              item.type ||
              'Unknown'
            }
            type={activeFilter === 'playlists' ? 'playlist' : item.type}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative bg-black">
        <TopBar user={user} />

        <div className="px-6 pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Library size={36} className="text-blue-600" />
              <h1 className="text-4xl font-bold text-white">Your Library</h1>
            </div>
            <p className="text-gray-400">
              Your playlists, artists, and albums all in one place
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <FilterChips
              categories={filters}
              activeCategory={activeFilter}
              onCategoryChange={setActiveFilter}
            />
          </div>

          {/* Stats */}
          {!loading && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#181818] p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Music className="text-blue-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-white">{playlists?.length || 0}</p>
                    <p className="text-sm text-gray-400">Playlists</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#181818] p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="text-green-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-white">{artists?.length || 0}</p>
                    <p className="text-sm text-gray-400">Artists</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#181818] p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Disc className="text-purple-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-white">{albums?.length || 0}</p>
                    <p className="text-sm text-gray-400">Albums</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 capitalize">
              {activeFilter}
            </h2>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
