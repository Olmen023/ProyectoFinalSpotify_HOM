/**
 * MÓDULO: GENERADOR DE PLAYLISTS DE SPOTIFY
 * ==========================================
 * Este módulo contiene funciones para generar playlists personalizadas basadas en
 * las preferencias del usuario utilizando la API de Spotify.
 *
 * REFERENCIAS:
 * - Importa getAccessToken() desde @/lib/auth (src/lib/auth.js)
 * - Utilizado por: src/app/dashboard/generate-playlist/page.jsx
 *
 * DEPENDENCIAS EXTERNAS:
 * - Spotify Web API (https://api.spotify.com/v1)
 */

/**
 * Genera una playlist personalizada basada en las preferencias del usuario
 *
 * DESCRIPCIÓN DETALLADA:
 * Esta función toma las preferencias musicales del usuario (artistas, géneros, décadas y rango de popularidad)
 * y genera una playlist de hasta 30 canciones que coincidan con estos criterios. El proceso incluye:
 * 1. Obtener las mejores canciones de los artistas seleccionados
 * 2. Buscar canciones por los géneros especificados
 * 3. Filtrar por década si se especifica
 * 4. Filtrar por rango de popularidad si se especifica
 * 5. Eliminar duplicados y limitar a 30 canciones
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Extrae preferencias del objeto (artists, genres, decades, popularity)
 * 2. Obtiene el token de acceso de Spotify usando getAccessToken()
 * 3. Por cada artista seleccionado: hace fetch a /artists/{id}/top-tracks para obtener sus mejores canciones
 * 4. Por cada género seleccionado: hace búsqueda de canciones con ese género (límite 20 por género)
 * 5. Si hay décadas seleccionadas: filtra las canciones por año de lanzamiento
 * 6. Si hay rango de popularidad: filtra las canciones que estén dentro del rango [min, max]
 * 7. Elimina duplicados usando Map con track.id como clave
 * 8. Limita el resultado final a 30 canciones
 *
 * @param {Object} preferences - Objeto con las preferencias del usuario
 * @param {Array<Object>} preferences.artists - Array de objetos artista con propiedades {id, name, ...}
 * @param {Array<string>} preferences.genres - Array de strings con nombres de géneros (ej: ['pop', 'rock'])
 * @param {Array<string>} preferences.decades - Array de strings con décadas (ej: ['1980', '1990'])
 * @param {Array<number>} preferences.popularity - Array de 2 elementos [min, max] con rango de popularidad (0-100)
 *
 * @returns {Promise<Array<Object>>} - Array de hasta 30 objetos track de Spotify con propiedades:
 *   - id: string - ID único de la canción
 *   - name: string - Nombre de la canción
 *   - artists: Array - Artistas de la canción
 *   - album: Object - Información del álbum (incluyendo release_date)
 *   - popularity: number - Puntuación de popularidad (0-100)
 *   - preview_url: string - URL de preview de 30 segundos
 *   - uri: string - URI de Spotify para reproducción
 *
 * ENDPOINTS DE SPOTIFY UTILIZADOS:
 * - GET /artists/{id}/top-tracks?market=US - Obtiene las mejores canciones de un artista
 * - GET /search?type=track&q=genre:{genre}&limit=20 - Busca canciones por género
 *
 * EJEMPLO DE USO:
 * const tracks = await generatePlaylist({
 *   artists: [{id: '06HL4z0CvFAxyc27GXpf02', name: 'Taylor Swift'}],
 *   genres: ['pop', 'indie'],
 *   decades: ['2010', '2020'],
 *   popularity: [50, 100]
 * });
 */
export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  // PASO 1: Obtener top tracks de artistas seleccionados
  // Para cada artista, obtiene sus 10 canciones más populares en el mercado de US
  for (const artist of artists) {
    const tracks = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await tracks.json();
    allTracks.push(...data.tracks);
  }

  // PASO 2: Buscar por géneros
  // Para cada género, busca hasta 20 canciones que coincidan con ese género
  for (const genre of genres) {
    const results = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await results.json();
    allTracks.push(...data.tracks.items);
  }

  // PASO 3: Filtrar por década
  // Si se especificaron décadas, filtra las canciones cuyo año de lanzamiento
  // esté dentro de alguna de las décadas seleccionadas (ej: 1980-1989, 1990-1999)
  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // PASO 4: Filtrar por popularidad
  // Si se especificó un rango de popularidad [min, max], filtra las canciones
  // que tengan una puntuación de popularidad dentro de ese rango (0-100)
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // PASO 5: Eliminar duplicados y limitar a 30 canciones
  // Usa un Map con track.id como clave para eliminar duplicados automáticamente
  // (si una canción aparece varias veces, solo se mantiene una copia)
  // Finalmente, limita el resultado a las primeras 30 canciones
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  return uniqueTracks;
}