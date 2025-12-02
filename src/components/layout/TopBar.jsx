'use client';

import { Search, User } from 'lucide-react';
import { useState } from 'react';

/**
 * Barra superior con buscador y avatar de usuario
 */
export default function TopBar({ onSearch, user }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md p-6 flex justify-between items-center">
      {/* Buscador */}
      <div className="relative w-full max-w-[480px] mx-auto">
        <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for artists, songs, or podcasts"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full bg-[#2a2a2a] rounded-full py-2.5 pl-12 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-[#333] transition-colors"
        />
      </div>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gray-600 border border-gray-800 ml-4 overflow-hidden flex items-center justify-center">
        {user?.images?.[0]?.url ? (
          <img
            src={user.images[0].url}
            alt={user.display_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={20} className="text-gray-300" />
        )}
      </div>
    </header>
  );
}
