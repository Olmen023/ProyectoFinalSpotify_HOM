'use client';

import { X } from 'lucide-react';

/**
 * COMPONENTE: DecadeWidget - Selector de décadas musicales
 * =========================================================
 * Widget para filtrar música por década de lanzamiento.
 * Grid visual de décadas con emojis temáticos (1950s - 2020s).
 *
 * FUNCIONALIDAD:
 * - Grid de 8 décadas desde 1950s hasta 2020s
 * - Cada década con emoji temático representativo
 * - Selección múltiple sin límite
 * - Chips de décadas seleccionadas mostradas arriba
 * - Toggle: click para seleccionar/deseleccionar
 * - Resaltado visual de décadas activas
 *
 * ARQUITECTURA:
 * - Componente sin estado propio (controlled component)
 * - Array estático de décadas con emojis predefinidos
 * - Grid responsive: 2 columnas en móvil, 4 en desktop
 * - Cada década tiene value (año inicio) y label (1950s, etc)
 * - Usado para filtrar tracks por año en recomendaciones
 *
 * DEPENDENCIAS DE REACT:
 * - Ninguna (componente presentacional)
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - lucide-react: Icono X para eliminar chips
 *
 * REFERENCIAS:
 * - No importa otros componentes
 *
 * UTILIZADO EN:
 * - src/app/generator/page.jsx (filtrar por década para playlist)
 * - src/app/page.jsx (página principal con generador)
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.selectedDecades - Array de values de décadas seleccionadas (ej: ['1980', '1990'])
 * @param {Function} props.onSelect - Callback con array actualizado de décadas
 *
 * @returns {JSX.Element} Widget de selección de décadas
 *
 * DÉCADAS DISPONIBLES:
 * - 1950s 🎷 (jazz/swing era)
 * - 1960s 🎸 (rock clásico)
 * - 1970s 🕺 (disco era)
 * - 1980s 🎹 (synth pop)
 * - 1990s 💿 (CD era)
 * - 2000s 💽 (digital era)
 * - 2010s 📱 (streaming era)
 * - 2020s 🎧 (moderna)
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Muestra grid de 8 décadas con emojis
 * 2. Al hacer clic en década:
 *    - Si está seleccionada: la elimina del array
 *    - Si no está seleccionada: la añade al array
 *    - Llama a onSelect con array actualizado
 * 3. Chips arriba muestran seleccionadas con opción de eliminar
 */
export default function DecadeWidget({ selectedDecades = [], onSelect }) {
  const decades = [
    { value: '1950', label: '1950s', emoji: '🎷' },
    { value: '1960', label: '1960s', emoji: '🎸' },
    { value: '1970', label: '1970s', emoji: '🕺' },
    { value: '1980', label: '1980s', emoji: '🎹' },
    { value: '1990', label: '1990s', emoji: '💿' },
    { value: '2000', label: '2000s', emoji: '💽' },
    { value: '2010', label: '2010s', emoji: '📱' },
    { value: '2020', label: '2020s', emoji: '🎧' },
  ];

  const handleToggleDecade = (decadeValue) => {
    if (selectedDecades.includes(decadeValue)) {
      onSelect(selectedDecades.filter((d) => d !== decadeValue));
    } else {
      onSelect([...selectedDecades, decadeValue]);
    }
  };

  const handleRemoveDecade = (decadeValue) => {
    onSelect(selectedDecades.filter((d) => d !== decadeValue));
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Decades</h3>
        <span className="text-sm text-gray-400">
          {selectedDecades.length} selected
        </span>
      </div>

      {/* Selected Decades */}
      {Array.isArray(selectedDecades) && selectedDecades.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedDecades.map((decadeValue) => {
            const decade = decades.find((d) => d.value === decadeValue);
            return (
              <div
                key={decadeValue}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm"
              >
                <span>
                  {decade?.emoji} {decade?.label}
                </span>
                <button
                  onClick={() => handleRemoveDecade(decadeValue)}
                  className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Decade Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {decades.map((decade) => {
          const isSelected = selectedDecades.includes(decade.value);

          return (
            <button
              key={decade.value}
              onClick={() => handleToggleDecade(decade.value)}
              className={`
                px-4 py-3 rounded-lg font-medium transition-all flex flex-col items-center gap-1
                ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333] hover:text-white'
                }
              `}
            >
              <span className="text-2xl">{decade.emoji}</span>
              <span className="text-sm">{decade.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
