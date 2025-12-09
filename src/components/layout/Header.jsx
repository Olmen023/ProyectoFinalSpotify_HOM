'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * COMPONENTE: HEADER - ENCABEZADO CON NAVEGACIÓN
 * ================================================
 * Componente de encabezado que proporciona botones de navegación hacia atrás y adelante
 * en el historial del navegador, similar a la interfaz de Spotify.
 *
 * CARACTERÍSTICAS:
 * - Botones de navegación back/forward usando next/navigation router
 * - Título opcional del encabezado
 * - Área de acciones personalizables (botones, iconos, etc.)
 *
 * DEPENDENCIAS DE NEXT.JS:
 * - useRouter: Hook para navegación programática del router de Next.js
 *
 * DEPENDENCIAS DE LUCIDE:
 * - ChevronLeft, ChevronRight: Iconos de navegación
 *
 * UTILIZADO EN:
 * - Actualmente no se está usando directamente en ningún componente
 * - Disponible para ser usado en páginas que necesiten navegación
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.title] - Título opcional a mostrar en el header
 * @param {React.ReactNode} [props.actions] - Elementos JSX de acciones adicionales (botones, etc.)
 *
 * @returns {JSX.Element} - Encabezado con navegación y acciones
 *
 * EJEMPLO DE USO:
 * <Header
 *   title="Mi Página"
 *   actions={<button>Acción</button>}
 * />
 */
export default function Header({ title, actions }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Navegación */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 bg-[#181818] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => router.forward()}
          className="w-9 h-9 bg-[#181818] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronRight size={22} />
        </button>
        {title && <h1 className="text-2xl font-bold text-white ml-4">{title}</h1>}
      </div>

      {/* Acciones Adicionales */}
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
