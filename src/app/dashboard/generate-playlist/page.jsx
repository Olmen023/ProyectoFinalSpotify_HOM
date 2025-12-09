'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Button from '@/components/ui/Button';
import { useSpotify } from '@/hooks/useSpotify';

// Widgets
import ArtistWidget from '@/components/widgets/ArtistWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';

// Playlist
import PlaylistDisplay from '@/components/playlist/PlaylistDisplay';

/**
 * PÁGINA: GENERATE PLAYLIST - GENERADOR DE PLAYLISTS PERSONALIZADAS
 * ==================================================================
 * Página principal para crear playlists personalizadas basadas en múltiples criterios musicales.
 * Utiliza 6 widgets especializados para configurar preferencias y genera playlists de hasta 30 canciones.
 *
 * FUNCIONALIDAD:
 * - Selección de hasta 5 artistas favoritos (ArtistWidget)
 * - Selección de canciones específicas (TrackWidget)
 * - Selección de hasta 5 géneros musicales (GenreWidget)
 * - Selección de décadas musicales 1960-2020 (DecadeWidget)
 * - Control de mood: energía, valencia, bailabilidad, acusticidad (MoodWidget)
 * - Control de popularidad: rango min/max 0-100 (PopularityWidget)
 * - Generación de playlist con algoritmo de Spotify Recommendations API
 * - Visualización de playlist generada con drag & drop
 * - Refresh de playlist (regenerar con mismas preferencias)
 * - Añadir más canciones manteniendo las existentes
 * - Eliminar canciones individualmente
 * - Reordenar canciones con drag & drop
 * - Guardar playlist en cuenta de Spotify (próximamente)
 *
 * ARQUITECTURA:
 * - Client Component con estado local complejo
 * - 6 widgets independientes que actualizan preferencias
 * - Estado centralizado en objeto preferences
 * - Cada widget tiene su propio handler
 * - PlaylistDisplay maneja la visualización y manipulación de resultados
 *
 * ESTADO LOCAL:
 * - user: Object - Perfil del usuario de Spotify
 * - playlist: Array<Track> - Canciones generadas
 * - preferences: Object - Configuración completa:
 *   - artists: Array<Artist> - Hasta 5 artistas
 *   - tracks: Array<Track> - Canciones específicas
 *   - genres: Array<string> - Hasta 5 géneros
 *   - decades: Array<string> - Décadas seleccionadas
 *   - mood: Object - Parámetros de audio (energy, valence, danceability, acousticness)
 *   - popularity: Object - {min: number, max: number}
 *
 * WIDGETS UTILIZADOS:
 * 1. ArtistWidget - Búsqueda y selección de artistas
 * 2. TrackWidget - Búsqueda y selección de canciones
 * 3. GenreWidget - Grid de géneros con búsqueda
 * 4. DecadeWidget - Selector visual de décadas
 * 5. MoodWidget - Sliders de parámetros de audio + presets
 * 6. PopularityWidget - Selector de rango con chips predefinidos
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Gestión de estado local (user, playlist, preferences)
 * - useEffect: Carga de perfil de usuario al montar
 *
 * DEPENDENCIAS DE LUCIDE:
 * - Sparkles: Icono del botón de generar
 *
 * REFERENCIAS:
 * - Importa Sidebar desde @/components/layout/Sidebar (src/components/layout/Sidebar.jsx)
 * - Importa TopBar desde @/components/layout/TopBar (src/components/layout/TopBar.jsx)
 * - Importa Button desde @/components/ui/Button (src/components/ui/Button.jsx)
 * - Importa useSpotify desde @/hooks/useSpotify (src/hooks/useSpotify.jsx)
 * - Importa ArtistWidget desde @/components/widgets/ArtistWidget (src/components/widgets/ArtistWidget.jsx)
 * - Importa TrackWidget desde @/components/widgets/TrackWidget (src/components/widgets/TrackWidget.jsx)
 * - Importa GenreWidget desde @/components/widgets/GenreWidget (src/components/widgets/GenreWidget.jsx)
 * - Importa DecadeWidget desde @/components/widgets/DecadeWidget (src/components/widgets/DecadeWidget.jsx)
 * - Importa MoodWidget desde @/components/widgets/MoodWidget (src/components/widgets/MoodWidget.jsx)
 * - Importa PopularityWidget desde @/components/widgets/PopularityWidget (src/components/widgets/PopularityWidget.jsx)
 * - Importa PlaylistDisplay desde @/components/playlist/PlaylistDisplay (src/components/playlist/PlaylistDisplay.jsx)
 *
 * UTILIZADO EN:
 * - Ruta: /dashboard/generate-playlist
 * - Accesible desde: Dashboard home, sidebar
 *
 * FLUJO DE GENERACIÓN:
 * 1. Usuario configura preferencias en widgets
 * 2. Cada widget actualiza su parte del estado preferences
 * 3. Usuario hace clic en "Generate Playlist"
 * 4. handleGeneratePlaylist() llama a generatePlaylist(preferences)
 * 5. Hook useSpotify ejecuta algoritmo de generación:
 *    a. Llama a Recommendations API con diferentes combinaciones de seeds
 *    b. Combina resultados de múltiples llamadas
 *    c. Elimina duplicados
 *    d. Filtra por criterios adicionales (mood, popularidad)
 *    e. Retorna hasta 30 tracks únicos
 * 6. Playlist generada se muestra en PlaylistDisplay
 * 7. Usuario puede: refrescar, añadir más, eliminar, reordenar, guardar
 *
 * HANDLERS:
 * - handleArtistsChange: Actualiza artists en preferences
 * - handleTracksChange: Actualiza tracks en preferences
 * - handleGenresChange: Actualiza genres en preferences
 * - handleDecadesChange: Actualiza decades en preferences
 * - handleMoodChange: Actualiza mood en preferences
 * - handlePopularityChange: Actualiza popularity en preferences
 * - handleGeneratePlaylist: Genera nueva playlist desde cero
 * - handleRefreshPlaylist: Regenera playlist con mismas preferencias
 * - handleAddMoreSongs: Añade canciones nuevas sin eliminar existentes
 * - handleRemoveTrack: Elimina una canción por ID
 * - handleReorderTracks: Actualiza orden de canciones (drag & drop)
 * - handleSaveToSpotify: Guarda playlist en cuenta de Spotify (TODO)
 *
 * LAYOUT:
 * - Grid responsive 1 columna móvil, 2 columnas desktop
 * - Widgets organizados en pares relacionados
 * - Botón de generar en header de widgets
 * - Playlist display debajo de widgets
 *
 * @returns {JSX.Element} - Página completa de generación de playlists
 */
export default function GeneratePlaylistPage() {
  const { getUserProfile, generatePlaylist, loading } = useSpotify();
  const [user, setUser] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [preferences, setPreferences] = useState({
    artists: [],
    tracks: [],
    genres: [],
    decades: [],
    mood: {},
    popularity: { min: 0, max: 100 },
  });

  // Cargar perfil del usuario
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getUserProfile();
      setUser(profile);
    };
    loadProfile();
  }, [getUserProfile]);

  // Handlers para cada widget
  const handleArtistsChange = (artists) => {
    setPreferences((prev) => ({ ...prev, artists }));
  };

  const handleTracksChange = (tracks) => {
    setPreferences((prev) => ({ ...prev, tracks }));
  };

  const handleGenresChange = (genres) => {
    setPreferences((prev) => ({ ...prev, genres }));
  };

  const handleDecadesChange = (decades) => {
    setPreferences((prev) => ({ ...prev, decades }));
  };

  const handleMoodChange = (mood) => {
    setPreferences((prev) => ({ ...prev, mood }));
  };

  const handlePopularityChange = (popularity) => {
    setPreferences((prev) => ({ ...prev, popularity }));
  };

  // Generar playlist
  const handleGeneratePlaylist = async () => {
    const generatedPlaylist = await generatePlaylist(preferences);
    setPlaylist(generatedPlaylist);
  };

  // Refrescar playlist (regenerar con mismas preferencias)
  const handleRefreshPlaylist = async () => {
    const generatedPlaylist = await generatePlaylist(preferences);
    setPlaylist(generatedPlaylist);
  };

  // Añadir más canciones a la playlist existente
  const handleAddMoreSongs = async () => {
    const newTracks = await generatePlaylist(preferences);
    // Filtrar duplicados
    const currentPlaylist = Array.isArray(playlist) ? playlist : [];
    const existingIds = new Set(currentPlaylist.map((t) => t.id));
    const uniqueNewTracks = Array.isArray(newTracks) ? newTracks.filter((t) => !existingIds.has(t.id)) : [];
    setPlaylist([...currentPlaylist, ...uniqueNewTracks]);
  };

  // Eliminar canción de la playlist
  const handleRemoveTrack = (trackId) => {
    const currentPlaylist = Array.isArray(playlist) ? playlist : [];
    setPlaylist(currentPlaylist.filter((track) => track.id !== trackId));
  };

  // Guardar en Spotify (opcional - requiere permisos adicionales)
  const handleSaveToSpotify = async () => {
    alert('Save to Spotify feature coming soon!');
    // Aquí implementarías la llamada a la API para crear playlist
  };

  // Reordenar tracks
  const handleReorderTracks = (newOrder) => {
    setPlaylist(newOrder);
  };

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
              Generate Your Perfect Playlist
            </h1>
            <p className="text-gray-400">
              Customize your preferences below and create a personalized playlist
            </p>
          </div>

          {/* Widgets Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Customize Your Preferences
              </h2>
              <Button
                onClick={handleGeneratePlaylist}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Sparkles size={18} />
                {loading ? 'Generating...' : 'Generate Playlist'}
              </Button>
            </div>

            {/* Widget Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Artist Widget */}
              <ArtistWidget
                selectedArtists={preferences.artists}
                onSelect={handleArtistsChange}
              />

              {/* Track Widget */}
              <TrackWidget
                selectedTracks={preferences.tracks}
                onSelect={handleTracksChange}
              />

              {/* Genre Widget */}
              <GenreWidget
                selectedGenres={preferences.genres}
                onSelect={handleGenresChange}
              />

              {/* Decade Widget */}
              <DecadeWidget
                selectedDecades={preferences.decades}
                onSelect={handleDecadesChange}
              />

              {/* Mood Widget */}
              <MoodWidget mood={preferences.mood} onSelect={handleMoodChange} />

              {/* Popularity Widget */}
              <PopularityWidget
                popularity={preferences.popularity}
                onSelect={handlePopularityChange}
              />
            </div>
          </div>

          {/* Playlist Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Your Generated Playlist
            </h2>
            <PlaylistDisplay
              playlist={playlist}
              onRemoveTrack={handleRemoveTrack}
              onRefresh={handleRefreshPlaylist}
              onAddMore={handleAddMoreSongs}
              onSaveToSpotify={handleSaveToSpotify}
              onReorderTracks={handleReorderTracks}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
