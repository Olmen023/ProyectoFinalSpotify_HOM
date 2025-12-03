'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, Music2, Disc3 } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import AlbumCard from '@/components/ui/AlbumCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FilterChips from '@/components/ui/FilterChips';
import { useSpotify } from '@/hooks/useSpotify';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Cliente de Explore - Descubre nueva música
 */
export default function ExploreClient() {
  const { getUserProfile, searchTracks, searchArtists, getUserTopTracks } = useSpotify();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Cargar perfil y recomendaciones iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);

        const topTracks = await getUserTopTracks(20);
        setRecommendedTracks(topTracks || []);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setRecommendedTracks([]);
      }
    };
    loadInitialData();
  }, [getUserProfile, getUserTopTracks]);

  // Búsqueda automática en tiempo real
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch || debouncedSearch.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        if (activeCategory === 'all' || activeCategory === 'tracks') {
          const tracks = await searchTracks(debouncedSearch);
          setSearchResults(tracks || []);
        } else if (activeCategory === 'artists') {
          const artists = await searchArtists(debouncedSearch);
          setSearchResults(artists || []);
        }
      } catch (error) {
        console.error('Error performing search:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch, activeCategory, searchTracks, searchArtists]);

  const categories = [
    { id: 'all', label: 'All', icon: Music2 },
    { id: 'tracks', label: 'Tracks', icon: Disc3 },
    { id: 'artists', label: 'Artists', icon: TrendingUp },
  ];

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative bg-black">
        <TopBar user={user} />

        <div className="px-6 pb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Explore</h1>
            <p className="text-gray-400">
              Discover new music, artists, and albums
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for tracks, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181818] text-white pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8">
            <FilterChips
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Search Results
              </h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {searchResults.map((item) => (
                    item && item.id ? (
                      <AlbumCard
                        key={item.id}
                        id={item.id}
                        name={item.name || 'Unknown'}
                        image={
                          item.album?.images?.[0]?.url ||
                          item.images?.[0]?.url ||
                          '/placeholder.png'
                        }
                        artist={
                          item.artists?.[0]?.name ||
                          item.type ||
                          'Unknown'
                        }
                        type={item.type || 'track'}
                      />
                    ) : null
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No results found for "{searchQuery}"
                </p>
              )}
            </div>
          )}

          {/* Recommended for You */}
          {!searchQuery && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Recommended for You
              </h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : Array.isArray(recommendedTracks) && recommendedTracks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {recommendedTracks.map((track) => (
                    track && track.id ? (
                      <AlbumCard
                        key={track.id}
                        id={track.id}
                        name={track.name || 'Unknown'}
                        image={track.album?.images?.[0]?.url || '/placeholder.png'}
                        artist={track.artists?.[0]?.name || 'Unknown'}
                        type="track"
                      />
                    ) : null
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <p className="text-lg">No recommendations available</p>
                  <p className="text-sm mt-2">Start listening to music to get personalized recommendations</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
