import FavoritesClient from './FavoritesClient';

// Forzar renderizado dinámico para esta página
export const dynamic = 'force-dynamic';

/**
 * Página de Liked Songs - Canciones favoritas del usuario
 */
export default function FavoritesPage() {
  return <FavoritesClient />;
}
