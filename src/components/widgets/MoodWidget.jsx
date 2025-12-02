'use client';

import { useState } from 'react';
import { Smile, Frown, Zap, Heart } from 'lucide-react';

/**
 * Widget para configurar mood/energía de la música
 * Sliders para Energy, Valence (felicidad), Danceability
 */
export default function MoodWidget({ mood = {}, onSelect }) {
  const [values, setValues] = useState({
    energy: mood.energy || 50,
    valence: mood.valence || 50,
    danceability: mood.danceability || 50,
  });

  const handleSliderChange = (key, value) => {
    const newValues = { ...values, [key]: parseInt(value) };
    setValues(newValues);
    onSelect(newValues);
  };

  const presets = [
    {
      name: 'Happy',
      icon: Smile,
      values: { energy: 70, valence: 80, danceability: 70 },
    },
    {
      name: 'Sad',
      icon: Frown,
      values: { energy: 30, valence: 20, danceability: 30 },
    },
    {
      name: 'Energetic',
      icon: Zap,
      values: { energy: 90, valence: 60, danceability: 80 },
    },
    {
      name: 'Chill',
      icon: Heart,
      values: { energy: 40, valence: 60, danceability: 40 },
    },
  ];

  const handlePreset = (preset) => {
    setValues(preset.values);
    onSelect(preset.values);
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Mood & Energy</h3>

      {/* Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-all flex flex-col items-center gap-1"
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{preset.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        {/* Energy */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">Energy</label>
            <span className="text-sm text-blue-500 font-bold">{values.energy}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={values.energy}
            onChange={(e) => handleSliderChange('energy', e.target.value)}
            className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>

        {/* Valence (Happiness) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Happiness
            </label>
            <span className="text-sm text-blue-500 font-bold">
              {values.valence}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={values.valence}
            onChange={(e) => handleSliderChange('valence', e.target.value)}
            className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>

        {/* Danceability */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Danceability
            </label>
            <span className="text-sm text-blue-500 font-bold">
              {values.danceability}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={values.danceability}
            onChange={(e) => handleSliderChange('danceability', e.target.value)}
            className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
