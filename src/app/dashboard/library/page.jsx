/**
 * PÁGINA: LIBRARY - BIBLIOTECA PERSONAL
 * ======================================
 * Página wrapper para la biblioteca personal del usuario.
 * Ruta: /dashboard/library
 *
 * FUNCIONALIDAD:
 * - Wrapper simple que renderiza LibraryClient
 * - Configurada con renderizado dinámico (force-dynamic)
 * - Acceso a playlists, artistas y álbumes guardados
 *
 * CONFIGURACIÓN:
 * - dynamic = 'force-dynamic': Fuerza renderizado en cada request
 * - Esencial para biblioteca que se actualiza constantemente
 *
 * REFERENCIAS:
 * - Importa LibraryClient desde ./LibraryClient (src/app/dashboard/library/LibraryClient.jsx)
 *
 * @returns {JSX.Element} - Componente LibraryClient
 */

import LibraryClient from './LibraryClient';

// Forzar renderizado dinámico para esta página
export const dynamic = 'force-dynamic';

export default function LibraryPage() {
  return <LibraryClient />;
}
