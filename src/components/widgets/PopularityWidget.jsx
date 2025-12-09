'use client';

import { useState } from 'react';
import { TrendingUp, Music, Radio } from 'lucide-react';

/**
 * COMPONENTE: PopularityWidget - Selector de popularidad de canciones
 * ====================================================================
 * Widget para filtrar canciones por su nivel de popularidad en Spotify.
 * Ofrece rangos predefinidos (Mainstream, Popular, Underground) y
 * opción de rango personalizado con sliders.
 *
 * FUNCIONALIDAD:
 * - 4 rangos predefinidos de popularidad (0-100):
 *   * All: sin filtro (0-100)
 *   * Mainstream: muy populares (80-100) - Chart-toppers
 *   * Popular: conocidas (50-80) - Well-known
 *   * Underground: nicho (0-50) - Hidden gems
 * - Sliders personalizados para min/max
 * - Solo uno puede estar activo a la vez
 * - Seleccionar preset o mover slider actualiza el rango
 * - Iconos descriptivos para cada nivel
 *
 * ARQUITECTURA:
 * - Estado local para rango seleccionado y valores custom
 * - Inicializa con valores de prop popularity o defaults
 * - Grid de botones para presets (2 columnas)
 * - Sección separada para sliders custom
 * - Al mover sliders, se selecciona automáticamente modo 'custom'
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Manejo de rango seleccionado y valores custom
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - lucide-react: Iconos (TrendingUp, Music, Radio)
 *
 * REFERENCIAS:
 * - No importa otros componentes
 *
 * UTILIZADO EN:
 * - src/app/generator/page.jsx (filtrar por popularidad)
 * - src/app/page.jsx (página principal con generador)
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.popularity - Objeto inicial {range, min, max}
 * @param {Function} props.onSelect - Callback con objeto actualizado {range, min, max}
 *
 * @returns {JSX.Element} Widget de selección de popularidad
 *
 * RANGOS PREDEFINIDOS:
 * - all: 0-100 (sin filtro)
 * - mainstream: 80-100 (muy popular)
 * - popular: 50-80 (conocido)
 * - underground: 0-50 (nicho/descubrir)
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Inicializa con values de prop o defaults
 * 2. Usuario puede:
 *    a) Click en preset: aplica min/max predefinidos
 *    b) Mover sliders: activa modo 'custom' con valores personalizados
 * 3. Cada cambio llama a onSelect({range, min, max})
 * 4. Valores se usan en Spotify API para filtrar por popularidad
 */
export default function PopularityWidget({ popularity = {}, onSelect }) {
  const [selectedRange, setSelectedRange] = useState(
    popularity.range || 'all'
  );
  const [customRange, setCustomRange] = useState({
    min: popularity.min || 0,
    max: popularity.max || 100,
  });

  const ranges = [
    {
      id: 'all',
      name: 'All',
      icon: Music,
      min: 0,
      max: 100,
      description: 'Any popularity',
    },
    {
      id: 'mainstream',
      name: 'Mainstream',
      icon: TrendingUp,
      min: 80,
      max: 100,
      description: 'Chart-toppers',
    },
    {
      id: 'popular',
      name: 'Popular',
      icon: Radio,
      min: 50,
      max: 80,
      description: 'Well-known',
    },
    {
      id: 'underground',
      name: 'Underground',
      icon: Music,
      min: 0,
      max: 50,
      description: 'Hidden gems',
    },
  ];

  const handleSelectRange = (range) => {
    setSelectedRange(range.id);
    onSelect({ range: range.id, min: range.min, max: range.max });
  };

  const handleCustomRange = (key, value) => {
    const newRange = { ...customRange, [key]: parseInt(value) };
    setCustomRange(newRange);
    setSelectedRange('custom');
    onSelect({ range: 'custom', min: newRange.min, max: newRange.max });
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Popularity</h3>

      {/* Preset Ranges */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {ranges.map((range) => {
          const Icon = range.icon;
          const isSelected = selectedRange === range.id;

          return (
            <button
              key={range.id}
              onClick={() => handleSelectRange(range)}
              className={`
                p-4 rounded-lg transition-all text-left
                ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333] hover:text-white'
                }
              `}
            >
              <Icon size={24} className="mb-2" />
              <div className="font-bold text-sm">{range.name}</div>
              <div className="text-xs opacity-80 mt-1">{range.description}</div>
            </button>
          );
        })}
      </div>

      {/* Custom Range Sliders */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <p className="text-sm font-medium text-gray-300">Custom Range</p>

        {/* Min Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-gray-400">Minimum</label>
            <span className="text-xs text-blue-500 font-bold">
              {customRange.min}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={customRange.min}
            onChange={(e) => handleCustomRange('min', e.target.value)}
            className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>

        {/* Max Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-gray-400">Maximum</label>
            <span className="text-xs text-blue-500 font-bold">
              {customRange.max}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={customRange.max}
            onChange={(e) => handleCustomRange('max', e.target.value)}
            className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider-thumb::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
