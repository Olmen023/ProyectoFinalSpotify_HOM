'use client';

/**
 * COMPONENTE: LoadingSpinner - Spinner de carga animado
 * ======================================================
 * Indicador de carga visual con animación de rotación.
 * Incluye versión normal y versión full-page con overlay.
 *
 * FUNCIONALIDAD:
 * - Spinner circular con animación rotate infinita
 * - 3 tamaños configurables: sm, md, lg
 * - Clases CSS adicionales via prop className
 * - Variante full-page con backdrop y mensaje opcional
 *
 * ARQUITECTURA:
 * - Componente presentacional sin estado
 * - Animación CSS nativa (animate-spin de Tailwind)
 * - Border gradient para efecto de carga
 * - Centrado con flexbox
 *
 * DEPENDENCIAS DE REACT:
 * - Ninguna (componente puramente presentacional)
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - Ninguna (solo Tailwind CSS)
 *
 * REFERENCIAS:
 * - No importa otros componentes
 *
 * UTILIZADO EN:
 * - src/components/modals/AddToPlaylistModal.jsx (cargando playlists)
 * - src/components/modals/PlaylistModal.jsx (cargando tracks)
 * - src/components/playlist/PlaylistDisplay.jsx (generando playlist)
 * - src/components/widgets/ (todos los widgets, cargando datos de Spotify)
 * - src/app/ (múltiples páginas con estados de carga)
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.size - Tamaño: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} props.className - Clases CSS adicionales (default: '')
 *
 * @returns {JSX.Element} Spinner animado
 *
 * TAMAÑOS:
 * - sm: 16px (w-4 h-4, border-2)
 * - md: 32px (w-8 h-8, border-3)
 * - lg: 48px (w-12 h-12, border-4)
 */
export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]}
          border-blue-600
          border-t-transparent
          rounded-full
          animate-spin
        `}
      />
    </div>
  );
}

/**
 * COMPONENTE: FullPageSpinner - Spinner de página completa con overlay
 * =====================================================================
 * Variante del spinner que ocupa toda la pantalla con backdrop oscuro.
 * Usado para operaciones que bloquean toda la interfaz.
 *
 * FUNCIONALIDAD:
 * - Overlay full-screen con fondo oscuro y blur
 * - Spinner grande centrado
 * - Mensaje de carga personalizable
 * - Bloquea interacción con el resto de la página (z-50)
 *
 * @param {Object} props - Propiedades
 * @param {string} props.message - Mensaje a mostrar debajo del spinner (default: 'Loading...')
 *
 * @returns {JSX.Element} Spinner full-page con mensaje
 *
 * UTILIZADO EN:
 * - src/app/layout.jsx (carga inicial de la app)
 * - src/app/callback/page.jsx (procesando autenticación)
 * - Operaciones críticas que requieren espera
 */
export function FullPageSpinner({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        {message && <p className="text-gray-300 text-lg">{message}</p>}
      </div>
    </div>
  );
}
