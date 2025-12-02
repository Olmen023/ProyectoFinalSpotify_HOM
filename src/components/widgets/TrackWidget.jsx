'use client';

import { useState, useEffect } from 'react';
import { Search, X, Music } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Widget para buscar y seleccionar canciones
 * Selección múltiple sin límite estricto (pero recomendado max 10)
 */
export default function TrackWidget({ selectedTracks = [], onSelect }) {
  const { searchTracks, loading } = useSpotify();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length > 0) {
        const results = await searchTracks(debouncedQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    performSearch();
  }, [debouncedQuery, searchTracks]);

  const handleSelectTrack = (track) => {
    if (!selectedTracks.find((t) => t.id === track.id)) {
      onSelect([...selectedTracks, track]);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleRemoveTrack = (trackId) => {
    onSelect(selectedTracks.filter((t) => t.id !== trackId));
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Tracks</h3>
        <span className="text-sm text-gray-400">
          {selectedTracks.length} selected
        </span>
      </div>

      {/* Selected Tracks */}
      {selectedTracks.length > 0 && (
        <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
          {selectedTracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 bg-[#2a2a2a] rounded-lg p-3"
            >
              <div className="w-10 h-10 rounded overflow-hidden bg-gray-700 flex-shrink-0">
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
                <p className="text-white font-medium truncate text-sm">
                  {track.name}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {track.artists?.map((a) => a.name).join(', ')}
                </p>
              </div>
              <button
                onClick={() => handleRemoveTrack(track.id)}
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
          placeholder="Search for tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Search Results */}
      {loading && <LoadingSpinner className="py-4" />}

      {!loading && searchResults.length > 0 && (
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {searchResults.map((track) => {
            const isSelected = selectedTracks.find((t) => t.id === track.id);

            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                disabled={isSelected}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all
                  ${
                    isSelected
                      ? 'bg-blue-600/20 cursor-default'
                      : 'bg-[#2a2a2a] hover:bg-[#333]'
                  }
                `}
              >
                <div className="w-10 h-10 rounded overflow-hidden bg-gray-700 flex-shrink-0">
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
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-white font-medium truncate text-sm">
                    {track.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {track.artists?.map((a) => a.name).join(', ')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-gray-400 text-xs">
                    {formatDuration(track.duration_ms)}
                  </p>
                  {isSelected && (
                    <span className="text-blue-500 text-xs font-medium">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {!loading && searchQuery && searchResults.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No tracks found
        </p>
      )}
    </div>
  );
}
