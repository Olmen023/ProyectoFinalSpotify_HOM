'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Widget para seleccionar géneros musicales
 * Máximo 5 géneros seleccionados
 */
export default function GenreWidget({ selectedGenres = [], onSelect }) {
  const { getGenres, loading } = useSpotify();
  const [allGenres, setAllGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGenres, setFilteredGenres] = useState([]);

  const MAX_GENRES = 5;

  useEffect(() => {
    const fetchGenres = async () => {
      const genres = await getGenres();
      const genreArray = Array.isArray(genres) ? genres : [];
      setAllGenres(genreArray);
      setFilteredGenres(genreArray);
    };
    fetchGenres();
  }, [getGenres]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGenres(allGenres);
    } else {
      const filtered = Array.isArray(allGenres)
        ? allGenres.filter((genre) =>
            genre.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];
      setFilteredGenres(filtered);
    }
  }, [searchQuery, allGenres]);

  const handleToggleGenre = (genre) => {
    const genres = Array.isArray(selectedGenres) ? selectedGenres : [];
    if (genres.includes(genre)) {
      onSelect(genres.filter((g) => g !== genre));
    } else {
      if (genres.length < MAX_GENRES) {
        onSelect([...genres, genre]);
      }
    }
  };

  const handleRemoveGenre = (genre) => {
    const genres = Array.isArray(selectedGenres) ? selectedGenres : [];
    onSelect(genres.filter((g) => g !== genre));
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Genres</h3>
        <span className="text-sm text-gray-400">
          {Array.isArray(selectedGenres) ? selectedGenres.length : 0}/{MAX_GENRES} selected
        </span>
      </div>

      {/* Selected Genres */}
      {Array.isArray(selectedGenres) && selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedGenres.map((genre) => (
            <div
              key={genre}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm"
            >
              <span className="capitalize">{genre}</span>
              <button
                onClick={() => handleRemoveGenre(genre)}
                className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
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
          placeholder="Search genres..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Genre Grid */}
      {loading ? (
        <LoadingSpinner className="py-8" />
      ) : Array.isArray(filteredGenres) && filteredGenres.length > 0 ? (
        <div className="max-h-[300px] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredGenres.map((genre) => {
              const genres = Array.isArray(selectedGenres) ? selectedGenres : [];
              const isSelected = genres.includes(genre);
              const isDisabled = !isSelected && genres.length >= MAX_GENRES;

              return (
                <button
                  key={genre}
                  onClick={() => handleToggleGenre(genre)}
                  disabled={isDisabled}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all
                    ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isDisabled
                        ? 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'
                        : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333] hover:text-white'
                    }
                  `}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm text-center py-8">
          No genres available
        </p>
      )}
    </div>
  );
}
