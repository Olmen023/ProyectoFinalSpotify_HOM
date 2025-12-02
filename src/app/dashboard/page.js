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
 * Dashboard principal de MusicStream
 * Permite configurar preferencias mediante widgets y generar playlists personalizadas
 */
export default function DashboardPage() {
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
    const existingIds = new Set(playlist.map((t) => t.id));
    const uniqueNewTracks = newTracks.filter((t) => !existingIds.has(t.id));
    setPlaylist([...playlist, ...uniqueNewTracks]);
  };

  // Eliminar canción de la playlist
  const handleRemoveTrack = (trackId) => {
    setPlaylist(playlist.filter((track) => track.id !== trackId));
  };

  // Guardar en Spotify (opcional - requiere permisos adicionales)
  const handleSaveToSpotify = async () => {
    alert('Save to Spotify feature coming soon!');
    // Aquí implementarías la llamada a la API para crear playlist
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
              Welcome back{user?.display_name ? `, ${user.display_name}` : ''}!
            </h1>
            <p className="text-gray-400">
              Create your perfect playlist by customizing your preferences below
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
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
