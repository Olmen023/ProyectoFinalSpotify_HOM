'use client';

import { useState, useEffect } from 'react';
import { Search, X, User } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Widget para buscar y seleccionar artistas
 * Máximo 5 artistas seleccionados
 */
export default function ArtistWidget({ selectedArtists = [], onSelect }) {
  const { searchArtists, loading } = useSpotify();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const MAX_ARTISTS = 5;

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length > 0) {
        const results = await searchArtists(debouncedQuery);
        setSearchResults(Array.isArray(results) ? results : []);
      } else {
        setSearchResults([]);
      }
    };

    performSearch();
  }, [debouncedQuery, searchArtists]);

  const handleSelectArtist = (artist) => {
    if (!selectedArtists.find((a) => a.id === artist.id)) {
      if (selectedArtists.length < MAX_ARTISTS) {
        onSelect([...selectedArtists, artist]);
        setSearchQuery('');
        setSearchResults([]);
      }
    }
  };

  const handleRemoveArtist = (artistId) => {
    onSelect(selectedArtists.filter((a) => a.id !== artistId));
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Artists</h3>
        <span className="text-sm text-gray-400">
          {selectedArtists.length}/{MAX_ARTISTS} selected
        </span>
      </div>

      {/* Selected Artists */}
      {Array.isArray(selectedArtists) && selectedArtists.length > 0 && (
        <div className="space-y-2 mb-4">
          {selectedArtists.map((artist) => (
            <div
              key={artist.id}
              className="flex items-center gap-3 bg-[#2a2a2a] rounded-lg p-3"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                {artist.images?.[0]?.url ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{artist.name}</p>
                <p className="text-gray-400 text-xs">
                  {artist.followers?.total
                    ? `${(artist.followers.total / 1000000).toFixed(1)}M followers`
                    : 'Artist'}
                </p>
              </div>
              <button
                onClick={() => handleRemoveArtist(artist.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search for artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={selectedArtists.length >= MAX_ARTISTS}
          className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Search Results */}
      {loading && <LoadingSpinner className="py-4" />}

      {!loading && Array.isArray(searchResults) && searchResults.length > 0 && (
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {searchResults.map((artist) => {
            const isSelected = selectedArtists.find((a) => a.id === artist.id);
            const isDisabled =
              !isSelected && selectedArtists.length >= MAX_ARTISTS;

            return (
              <button
                key={artist.id}
                onClick={() => handleSelectArtist(artist)}
                disabled={isDisabled || isSelected}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all
                  ${
                    isSelected
                      ? 'bg-blue-600/20 cursor-default'
                      : isDisabled
                      ? 'bg-[#2a2a2a] opacity-50 cursor-not-allowed'
                      : 'bg-[#2a2a2a] hover:bg-[#333]'
                  }
                `}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                  {artist.images?.[0]?.url ? (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-white font-medium truncate">
                    {artist.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {artist.followers?.total
                      ? `${(artist.followers.total / 1000000).toFixed(1)}M followers`
                      : 'Artist'}
                  </p>
                </div>
                {isSelected && (
                  <span className="text-blue-500 text-xs font-medium">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!loading && searchQuery && searchResults.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No artists found
        </p>
      )}
    </div>
  );
}
