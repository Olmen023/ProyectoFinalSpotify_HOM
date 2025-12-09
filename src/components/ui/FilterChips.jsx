'use client';

/**
 * COMPONENTE: FilterChips - Chips de filtro horizontales
 * =======================================================
 * Componente de filtros estilo chips horizontales con scroll.
 * Muestra categorías/filtros como pills clickeables, resaltando el activo.
 * Soporta dos conjuntos de props para retrocompatibilidad.
 *
 * FUNCIONALIDAD:
 * - Lista horizontal de chips con scroll oculto
 * - Chip activo resaltado con color azul
 * - Chips inactivos en gris con hover
 * - Soporta iconos opcionales en cada chip
 * - Retrocompatibilidad con props antiguas y nuevas
 * - No renderiza nada si no hay items
 *
 * ARQUITECTURA:
 * - Componente presentacional sin estado
 * - Scroll horizontal con scrollbar oculto (no-scrollbar)
 * - Soporta items como strings simples u objetos {id, label, icon}
 * - Props duales para compatibilidad: filters/categories
 *
 * DEPENDENCIAS DE REACT:
 * - Ninguna (componente puramente presentacional)
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - Ninguna (los iconos vienen de las props)
 *
 * REFERENCIAS:
 * - No importa otros componentes
 *
 * UTILIZADO EN:
 * - src/app/browse/page.jsx (filtrar por categorías de música)
 * - src/app/search/page.jsx (filtrar resultados de búsqueda)
 * - Cualquier página que necesite filtros horizontales
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.filters - Array de filtros (string[] o object[]) - prop antigua
 * @param {string} props.activeFilter - ID del filtro activo - prop antigua
 * @param {Function} props.onFilterChange - Callback al cambiar filtro - prop antigua
 * @param {Array} props.categories - Array de categorías (nueva prop, preferida)
 * @param {string} props.activeCategory - ID de categoría activa (nueva prop)
 * @param {Function} props.onCategoryChange - Callback al cambiar categoría (nueva prop)
 *
 * @returns {JSX.Element|null} Lista de chips o null si no hay items
 *
 * FORMATO DE ITEMS:
 * - String simple: "All", "Rock", "Jazz"
 * - Objeto completo: { id: 'rock', label: 'Rock', icon: IconComponent }
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Determina qué props usar (categories preferido, filters fallback)
 * 2. Si no hay items, retorna null
 * 3. Mapea items para renderizar chips
 * 4. Al hacer clic en chip: llama a onChange(id)
 * 5. Estilos dinámicos según si es el activo
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
