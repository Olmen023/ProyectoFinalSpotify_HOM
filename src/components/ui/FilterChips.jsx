'use client';

/**
 * Chips de filtro horizontal (All, Podcasts, Energy, etc.)
 * Soporta dos variantes de props para compatibilidad:
 * - filters/activeFilter/onFilterChange
 * - categories/activeCategory/onCategoryChange
 */
export default function FilterChips({
  filters = [],
  activeFilter,
  onFilterChange,
  categories,
  activeCategory,
  onCategoryChange
}) {
  // Usar categories si está disponible, sino filters
  const items = Array.isArray(categories) ? categories : (Array.isArray(filters) ? filters : []);
  const activeItem = activeCategory !== undefined ? activeCategory : activeFilter;
  const onChange = onCategoryChange || onFilterChange;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 px-6 mb-8 overflow-x-auto no-scrollbar">
      {items.map((item) => {
        // Soportar tanto objetos {id, label, icon} como strings simples
        const key = item.id || item;
        const label = item.label || item;
        const Icon = item.icon;

        return (
          <button
            key={key}
            onClick={() => onChange?.(key)}
            className={`
              px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2
              ${
                activeItem === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
              }
            `}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
