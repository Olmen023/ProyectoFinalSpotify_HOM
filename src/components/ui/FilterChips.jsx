'use client';

/**
 * Chips de filtro horizontal (All, Podcasts, Energy, etc.)
 */
export default function FilterChips({ filters, activeFilter, onFilterChange }) {
  return (
    <div className="flex gap-3 px-6 mb-8 overflow-x-auto no-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`
            px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${
              activeFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
            }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
