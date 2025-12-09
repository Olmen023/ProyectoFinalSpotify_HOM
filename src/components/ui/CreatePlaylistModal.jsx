'use client';

import { useState } from 'react';
import { X, Music, Lock, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';

/**
 * COMPONENTE: CreatePlaylistModal - Modal de creación de playlists
 * =================================================================
 * Modal con formulario para crear una nueva playlist en Spotify.
 * Permite configurar nombre, descripción y privacidad antes de crear.
 *
 * FUNCIONALIDAD:
 * - Formulario con validación de nombre obligatorio
 * - Campo de descripción opcional (textarea)
 * - Toggle de privacidad: Public/Private con iconos
 * - Resetea el formulario al cerrar o después de crear
 * - Botón de crear deshabilitado durante loading
 * - Cierra automáticamente después de crear exitosamente
 *
 * ARQUITECTURA:
 * - Modal condicional (solo renderiza si isOpen=true)
 * - Estados locales para campos del formulario
 * - Backdrop con blur que cierra al hacer clic
 * - Formulario HTML con submit handler
 * - Limpieza de estado al cerrar
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Manejo de campos del formulario (name, description, isPublic)
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - lucide-react: Iconos (X, Music, Lock, Globe)
 *
 * REFERENCIAS:
 * - Importa Button desde @/components/ui/Button (src/components/ui/Button.jsx)
 *
 * UTILIZADO EN:
 * - src/app/playlists/page.jsx (crear nuevas playlists desde la página principal)
 * - src/app/generator/page.jsx (guardar playlist generada en Spotify)
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onCreatePlaylist - Callback al crear (recibe: name, description, isPublic)
 * @param {boolean} props.loading - Estado de carga durante creación
 *
 * @returns {JSX.Element|null} Modal de crear playlist o null si no está abierto
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Si isOpen=false, retorna null (no renderiza nada)
 * 2. Usuario llena formulario:
 *    - Nombre (obligatorio)
 *    - Descripción (opcional)
 *    - Privacidad (toggle Public/Private)
 * 3. Al hacer submit:
 *    - Valida que nombre no esté vacío
 *    - Llama a onCreatePlaylist(name, description, isPublic)
 *    - Llama a handleClose() que resetea campos
 * 4. Al cerrar (X o backdrop):
 *    - Resetea todos los campos a valores default
 *    - Llama a onClose()
 */
export default function CreatePlaylistModal({ isOpen, onClose, onCreatePlaylist, loading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreatePlaylist(name, description, isPublic);
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIsPublic(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-[#282828] rounded-lg w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create Playlist</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Playlist Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Playlist Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="w-full bg-[#3E3E3E] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description to your playlist..."
              rows={3}
              className="w-full bg-[#3E3E3E] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          {/* Privacy Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Privacy
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                  isPublic
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#3E3E3E] text-gray-400 hover:text-white'
                }`}
              >
                <Globe size={18} />
                <span className="font-medium">Public</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                  !isPublic
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#3E3E3E] text-gray-400 hover:text-white'
                }`}
              >
                <Lock size={18} />
                <span className="font-medium">Private</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-transparent border border-gray-600 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-700 disabled:text-gray-500"
            >
              {loading ? 'Creating...' : 'Create Playlist'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
