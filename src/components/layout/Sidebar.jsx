/**
 * COMPONENTE: SIDEBAR - BARRA LATERAL DE NAVEGACIÓN
 * ===================================================
 * Componente de barra lateral que contiene el logo de la aplicación, menú de navegación,
 * botón para crear playlists y lista de playlists del usuario.
 *
 * FUNCIONALIDAD:
 * - Logo y nombre de la aplicación (MusicStream)
 * - Navegación principal: Home, Generate Playlist, Explore, Library, Liked Songs
 * - Botón para crear nuevas playlists (abre modal)
 * - Lista de playlists (actualmente hardcodeada)
 * - Resaltado visual de la ruta activa
 *
 * ARQUITECTURA:
 * - Estado local: isModalOpen (control del modal), user (perfil del usuario)
 * - Navegación: pathname para detectar ruta activa, router para redirección
 * - API: Carga perfil de usuario y crea playlists usando useSpotify()
 *
 * DEPENDENCIAS DE REACT:
 * - useState, useEffect: Manejo de estado y efectos secundarios
 *
 * DEPENDENCIAS DE NEXT.JS:
 * - Link: Navegación declarativa entre rutas
 * - usePathname, useRouter: Hooks de navegación
 *
 * DEPENDENCIAS DE LUCIDE:
 * - Music, Home, Compass, Heart, PlusCircle, Library, Sparkles: Iconos del menú
 *
 * REFERENCIAS:
 * - Importa useSpotify desde @/hooks/useSpotify (src/hooks/useSpotify.jsx)
 * - Importa CreatePlaylistModal desde @/components/ui/CreatePlaylistModal (src/components/ui/CreatePlaylistModal.jsx)
 *
 * UTILIZADO EN:
 * - src/app/layout.js (layout principal de la aplicación)
 *
 * FLUJO DE CREACIÓN DE PLAYLIST:
 * 1. Usuario hace clic en "Create Playlist"
 * 2. Se abre el modal CreatePlaylistModal
 * 3. Usuario ingresa nombre, descripción y visibilidad
 * 4. handleCreatePlaylist() llama a createPlaylist() de useSpotify
 * 5. Si éxito: cierra modal y redirige a /dashboard/library
 * 6. Refresh de la página para mostrar la nueva playlist
 *
 * MEJORA FUTURA:
 * - La lista de playlists está hardcodeada. Debería cargar las playlists reales
 *   del usuario usando getUserPlaylists() de useSpotify.
 *
 * @returns {JSX.Element} - Barra lateral de navegación
 */

'use client';

import { useState, useEffect } from 'react';
import { Music, Home, Compass, Heart, PlusCircle, Library, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSpotify } from '@/hooks/useSpotify';
import CreatePlaylistModal from '@/components/ui/CreatePlaylistModal';
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getUserProfile, createPlaylist, loading } = useSpotify();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const profile = await getUserProfile();
      setUser(profile);
    };
    loadUser();
  }, [getUserProfile]);

  const handleCreatePlaylist = async (name, description, isPublic) => {
    const playlist = await createPlaylist(name, description, isPublic);
    if (playlist) {
      // Cerrar modal y redirigir a la biblioteca
      setIsModalOpen(false);
      router.push('/dashboard/library');
      // Refresh para ver la nueva playlist
      router.refresh();
    } else {
      alert('Failed to create playlist. Please try again.');
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Sparkles, label: 'Generate Playlist', href: '/dashboard/generate-playlist' },
    { icon: Compass, label: 'Explore', href: '/dashboard/explore' },
    { icon: Library, label: 'Your Library', href: '/dashboard/library' },
    { icon: Heart, label: 'Liked Songs', href: '/dashboard/favorites' },
  ];

  const playlists = [
    'Chill Vibes',
    'Late Night Coding',
    'Workout Beats',
    'Indie Discoveries',
    'Focus Flow',
    'Road Trip Anthems',
    'Throwback Jams',
    'Sunday Morning Coffee',
    'Global Top 50'
  ];

  return (
    <aside className="w-[260px] bg-[#121212] flex-shrink-0 flex flex-col hidden md:flex h-screen overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6">
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white">
          <Music size={18} />
        </div>
        <span className="text-lg font-bold text-white">MusicStream</span>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all
                ${
                  isActive
                    ? 'bg-blue-600/90 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Create Playlist */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-4 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-all w-full"
        >
          <PlusCircle size={22} />
          <span>Create Playlist</span>
        </button>
      </nav>

      {/* Sección Playlists */}
      <div className="px-6 mt-6 pb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Playlists
        </p>
        <div className="space-y-1">
          {playlists.map((playlist) => (
            <a
              key={playlist}
              href="#"
              className="block text-gray-400 hover:text-white py-1.5 text-sm transition-colors cursor-pointer"
            >
              {playlist}
            </a>
          ))}
        </div>
      </div>

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePlaylist={handleCreatePlaylist}
        loading={loading}
      />
    </aside>
  );
}
