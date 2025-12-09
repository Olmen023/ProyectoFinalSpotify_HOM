/**
 * PÁGINA: SHARED PLAYLIST - VISUALIZACIÓN DE PLAYLISTS COMPARTIDAS
 * ==================================================================
 * Página pública para visualizar playlists compartidas mediante URL.
 * Permite a usuarios (con o sin login) ver las canciones de una playlist compartida.
 *
 * FUNCIONALIDAD:
 * - Carga playlist desde parámetros URL (tracks IDs y nombre)
 * - Visualiza lista completa de canciones
 * - Muestra portada generada, nombre y estadísticas
 * - Botón para ir al dashboard
 * - Manejo de errores (playlist inválida, fallo de carga)
 * - Estados de carga con spinner
 *
 * ARQUITECTURA:
 * - Client Component con Suspense boundary
 * - Componente interno: SharedPlaylistContent (lógica principal)
 * - Componente exportado: SharedPlaylistPage (wrapper con Suspense)
 * - Estado local: playlist, playlistName, loading, error
 *
 * PARÁMETROS URL:
 * - tracks: String - IDs de tracks separados por comas (ej: "id1,id2,id3")
 * - name: String - Nombre codificado de la playlist
 *
 * EJEMPLO DE URL:
 * /shared-playlist?tracks=3n3Ppam7vgaVa1iaRUc9Lp,7qiZfU4dY1lWllzX7mPBI&name=My%20Awesome%20Playlist
 *
 * FLUJO DE CARGA:
 * 1. Página se monta, lee searchParams
 * 2. Extrae trackIds y nombre de los parámetros
 * 3. Llama a getTracksByIds() para obtener datos completos
 * 4. Renderiza playlist con TrackCards
 * 5. Si falla: muestra pantalla de error
 *
 * ESTADOS:
 * - Loading: Muestra spinner mientras carga datos
 * - Error: Muestra mensaje de error y botón al dashboard
 * - Success: Muestra playlist completa con todas las canciones
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Estado local del componente
 * - useEffect: Carga de datos desde URL
 * - Suspense: Boundary para loading states
 *
 * DEPENDENCIAS DE NEXT.JS:
 * - useSearchParams: Leer parámetros de query string
 * - useRouter: Navegación al dashboard
 *
 * DEPENDENCIAS DE LUCIDE:
 * - Music, Home, Heart: Iconos de la UI
 *
 * REFERENCIAS:
 * - Importa TrackCard desde @/components/playlist/TrackCard (src/components/playlist/TrackCard.jsx)
 * - Importa Button desde @/components/ui/Button (src/components/ui/Button.jsx)
 * - Importa LoadingSpinner desde @/components/ui/LoadingSpinner (src/components/ui/LoadingSpinner.jsx)
 * - Importa useSpotify desde @/hooks/useSpotify (src/hooks/useSpotify.jsx)
 *
 * GENERACIÓN DE URL:
 * - Esta URL se genera en: src/components/modals/SharePlaylistModal.jsx
 * - Función: generateShareUrl()
 *
 * UTILIZADO EN:
 * - Ruta: /shared-playlist?tracks=...&name=...
 * - Compartido por: SharePlaylistModal
 * - Accesible: Públicamente (requiere Spotify login para reproducir)
 *
 * CARACTERÍSTICAS VISUALES:
 * - Header con gradiente azul/morado
 * - Portada generada con icono de música
 * - Nombre de playlist y estadísticas
 * - Lista completa de tracks con formato tabla
 * - Diseño responsive
 *
 * @returns {JSX.Element} - Página de playlist compartida
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Music, Home, Heart } from 'lucide-react';
import TrackCard from '@/components/playlist/TrackCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSpotify } from '@/hooks/useSpotify';

/**
 * SharedPlaylistContent - Componente interno con lógica de playlist compartida
 *
 * RESPONSABILIDADES:
 * - Leer parámetros de URL
 * - Cargar datos de tracks desde Spotify API
 * - Renderizar UI de la playlist
 * - Manejar estados de loading y error
 */
function SharedPlaylistContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getTracksByIds } = useSpotify();

  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedPlaylist = async () => {
      try {
        const trackIds = searchParams.get('tracks');
        const name = searchParams.get('name');

        if (!trackIds) {
          setError('Invalid playlist link');
          setLoading(false);
          return;
        }

        const trackIdArray = trackIds.split(',');
        setPlaylistName(decodeURIComponent(name || 'Shared Playlist'));

        // Obtener información de las canciones
        const tracks = await getTracksByIds(trackIdArray);

        if (tracks && tracks.length > 0) {
          setPlaylist(tracks);
        } else {
          setError('Failed to load playlist');
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load playlist');
        setLoading(false);
      }
    };

    loadSharedPlaylist();
  }, [searchParams, getTracksByIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard')} variant="primary">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const totalDuration = playlist.reduce(
    (acc, track) => acc + (track?.duration_ms || 0),
    0
  );

  const formatTotalDuration = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-900 to-black pb-8">
        <div className="max-w-6xl mx-auto px-6 pt-20">
          <div className="flex items-end gap-6">
            {/* Playlist Cover */}
            <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-2xl">
              <Music size={80} className="text-white" />
            </div>

            {/* Playlist Info */}
            <div className="flex-1 pb-2">
              <p className="text-sm font-semibold text-white/80 mb-2">SHARED PLAYLIST</p>
              <h1 className="text-5xl font-bold text-white mb-4">{playlistName}</h1>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>{playlist.length} songs</span>
                <span>•</span>
                <span>{formatTotalDuration(totalDuration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Home size={18} />
            Go to Dashboard
          </Button>
        </div>

        {/* Track List */}
        <div className="bg-[#181818] rounded-xl p-6">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[16px_6fr_4fr_1fr] gap-4 px-4 py-2 border-b border-gray-700 text-sm text-gray-400 font-medium mb-2">
            <span className="text-center">#</span>
            <span>TITLE</span>
            <span>ALBUM</span>
            <span className="text-right">DURATION</span>
          </div>

          {/* Tracks */}
          <div className="space-y-1">
            {playlist.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                index={index + 1}
                showAlbum={true}
                showRemove={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SharedPlaylistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <SharedPlaylistContent />
    </Suspense>
  );
}
