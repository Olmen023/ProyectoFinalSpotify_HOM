'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Music, Heart, Library, TrendingUp } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { useSpotify } from '@/hooks/useSpotify';

/**
 * PÁGINA: DASHBOARD PRINCIPAL - HOME DE LA APLICACIÓN
 * =====================================================
 * Página principal del dashboard que sirve como punto de entrada después del login.
 * Muestra un resumen personalizado del usuario con acceso rápido a las funciones principales.
 *
 * FUNCIONALIDAD:
 * - Mensaje de bienvenida personalizado con nombre del usuario
 * - 4 tarjetas de acceso rápido a secciones principales
 * - Top 5 canciones del usuario con imágenes y artistas
 * - Top 5 artistas del usuario con fotos y géneros
 * - Diseño responsive con grid adaptativo
 *
 * ARQUITECTURA:
 * - Client Component (usa hooks de React y Next.js)
 * - Estado local para: user, topTracks, topArtists
 * - Carga de datos inicial con useEffect
 * - Navegación programática con useRouter
 *
 * SECCIONES DE ACCESO RÁPIDO:
 * 1. Generate Playlist - Crear playlists personalizadas
 * 2. Explore - Descubrir nueva música
 * 3. Favorites - Canciones y álbumes favoritos
 * 4. Library - Biblioteca personal (playlists, artistas, álbumes)
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Estado local del componente
 * - useEffect: Carga de datos al montar
 *
 * DEPENDENCIAS DE NEXT.JS:
 * - useRouter: Navegación entre páginas
 *
 * DEPENDENCIAS DE LUCIDE:
 * - Sparkles, Music, Heart, Library, TrendingUp: Iconos de la UI
 *
 * REFERENCIAS:
 * - Importa Sidebar desde @/components/layout/Sidebar (src/components/layout/Sidebar.jsx)
 * - Importa TopBar desde @/components/layout/TopBar (src/components/layout/TopBar.jsx)
 * - Importa useSpotify desde @/hooks/useSpotify (src/hooks/useSpotify.jsx)
 *
 * UTILIZADO EN:
 * - Ruta: /dashboard
 * - Primera página después del login exitoso
 *
 * FLUJO DE CARGA:
 * 1. Usuario accede a /dashboard
 * 2. useEffect se ejecuta al montar
 * 3. Carga perfil del usuario (getUserProfile)
 * 4. Carga top 5 tracks (getUserTopTracks)
 * 5. Carga top 5 artists (getUserTopArtists)
 * 6. Renderiza UI con datos cargados
 *
 * DATOS MOSTRADOS:
 * - Top Tracks: Ranking 1-5 con imagen, nombre y artistas
 * - Top Artists: Ranking 1-5 con foto, nombre y género principal
 *
 * @returns {JSX.Element} - Página de dashboard con acceso rápido y estadísticas
 */
export default function DashboardPage() {
  const router = useRouter();
  const { getUserProfile, getUserTopTracks, getUserTopArtists } = useSpotify();
  const [user, setUser] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  // Cargar perfil y datos del usuario
  useEffect(() => {
    const loadData = async () => {
      const profile = await getUserProfile();
      setUser(profile);

      const tracks = await getUserTopTracks(5);
      setTopTracks(tracks || []);

      const artists = await getUserTopArtists(5);
      setTopArtists(artists || []);
    };
    loadData();
  }, [getUserProfile, getUserTopTracks, getUserTopArtists]);

  const quickActions = [
    {
      title: 'Generate Playlist',
      description: 'Create a personalized playlist with custom preferences',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      path: '/dashboard/generate-playlist'
    },
    {
      title: 'Explore',
      description: 'Discover new music and trending artists',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      path: '/dashboard/explore'
    },
    {
      title: 'Favorites',
      description: 'Your liked songs and saved albums',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      path: '/dashboard/favorites'
    },
    {
      title: 'Library',
      description: 'Browse your playlists and albums',
      icon: Library,
      color: 'from-green-500 to-emerald-500',
      path: '/dashboard/library'
    }
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar Fija */}
      <Sidebar />

      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto relative bg-black">
        {/* Top Bar */}
        <TopBar user={user} />

        {/* Content */}
        <div className="px-6 pb-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back{user?.display_name ? `, ${user.display_name}` : ''}!
            </h1>
            <p className="text-gray-400">
              Ready to discover and create amazing playlists?
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.path}
                    onClick={() => router.push(action.path)}
                    className={`
                      relative overflow-hidden rounded-xl p-6 text-left
                      bg-gradient-to-br ${action.color}
                      hover:scale-105 transition-transform duration-200
                      group
                    `}
                  >
                    <div className="relative z-10">
                      <Icon className="w-10 h-10 mb-4" />
                      <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Tracks */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-bold text-white">Your Top Tracks</h2>
              </div>
              <div className="space-y-3">
                {topTracks.length > 0 ? (
                  topTracks.map((track, index) => (
                    <div key={track.id} className="flex items-center gap-3">
                      <span className="text-gray-400 w-6">{index + 1}</span>
                      {track.album?.images?.[2]?.url && (
                        <img
                          src={track.album.images[2].url}
                          alt={track.name}
                          className="w-12 h-12 rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{track.name}</p>
                        <p className="text-gray-400 text-sm truncate">
                          {track.artists?.map(a => a.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Loading your top tracks...</p>
                )}
              </div>
            </div>

            {/* Top Artists */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-bold text-white">Your Top Artists</h2>
              </div>
              <div className="space-y-3">
                {topArtists.length > 0 ? (
                  topArtists.map((artist, index) => (
                    <div key={artist.id} className="flex items-center gap-3">
                      <span className="text-gray-400 w-6">{index + 1}</span>
                      {artist.images?.[2]?.url && (
                        <img
                          src={artist.images[2].url}
                          alt={artist.name}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{artist.name}</p>
                        <p className="text-gray-400 text-sm capitalize truncate">
                          {artist.genres?.[0] || 'Artist'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Loading your top artists...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
