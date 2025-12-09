/**
 * PÁGINA: FAVORITES - CANCIONES FAVORITAS
 * ========================================
 * Página wrapper para la visualización de canciones favoritas del usuario.
 * Ruta: /dashboard/favorites
 *
 * FUNCIONALIDAD:
 * - Wrapper simple que renderiza FavoritesClient
 * - Configurada con renderizado dinámico (force-dynamic)
 * - Muestra las canciones guardadas del usuario
 *
 * CONFIGURACIÓN:
 * - dynamic = 'force-dynamic': Fuerza renderizado en cada request
 * - Necesario para datos personalizados que cambian frecuentemente
 *
 * REFERENCIAS:
 * - Importa FavoritesClient desde ./FavoritesClient (src/app/dashboard/favorites/FavoritesClient.jsx)
 *
 * @returns {JSX.Element} - Componente FavoritesClient
 */

import FavoritesClient from './FavoritesClient';

// Forzar renderizado dinámico para esta página
export const dynamic = 'force-dynamic';

export default function FavoritesPage() {
  return <FavoritesClient />;
}
