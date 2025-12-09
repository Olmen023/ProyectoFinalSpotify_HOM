/**
 * PÁGINA: EXPLORE - DESCUBRIMIENTO DE MÚSICA
 * ===========================================
 * Página wrapper para la funcionalidad de exploración y búsqueda de música.
 * Ruta: /dashboard/explore
 *
 * FUNCIONALIDAD:
 * - Wrapper simple que renderiza ExploreClient
 * - Configurada con renderizado dinámico (force-dynamic)
 * - Evita cache estático para contenido personalizado
 *
 * CONFIGURACIÓN:
 * - dynamic = 'force-dynamic': Fuerza renderizado en cada request
 * - Necesario para contenido personalizado del usuario
 *
 * REFERENCIAS:
 * - Importa ExploreClient desde ./ExploreClient (src/app/dashboard/explore/ExploreClient.jsx)
 *
 * @returns {JSX.Element} - Componente ExploreClient
 */

import ExploreClient from './ExploreClient';

// Forzar renderizado dinámico para esta página
export const dynamic = 'force-dynamic';

export default function ExplorePage() {
  return <ExploreClient />;
}
