'use client';

/**
 * COMPONENTE: Button - Botón reutilizable con variantes
 * ======================================================
 * Componente de botón personalizado con múltiples variantes de estilo,
 * tamaños, y estados. Centraliza todos los estilos de botones de la app.
 *
 * FUNCIONALIDAD:
 * - 4 variantes de estilo: primary, secondary, outline, ghost
 * - 3 tamaños: sm, md, lg
 * - Soporte para botones de ancho completo (fullWidth)
 * - Estados disabled con estilos apropiados
 * - Puede contener cualquier contenido (text, icons, etc)
 * - Tipos de botón: button, submit, reset
 *
 * ARQUITECTURA:
 * - Componente presentacional configurado por props
 * - Estilos con Tailwind CSS organizados por variante/tamaño
 * - Clases dinámicas combinadas según configuración
 * - Soporte para clases custom adicionales via className prop
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
 * - src/components/modals/CreatePlaylistModal.jsx (botones de crear/cancelar)
 * - src/components/modals/SharePlaylistModal.jsx (botones de compartir/cerrar)
 * - src/components/playlist/PlaylistDisplay.jsx (botones de acción)
 * - src/app/generator/page.jsx (botón de generar playlist)
 * - Prácticamente todos los componentes que necesitan botones
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} props.variant - Variante de estilo: 'primary' | 'secondary' | 'outline' | 'ghost' (default: 'primary')
 * @param {string} props.size - Tamaño del botón: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} props.fullWidth - Si ocupa todo el ancho disponible (default: false)
 * @param {boolean} props.disabled - Si el botón está deshabilitado (default: false)
 * @param {Function} props.onClick - Callback al hacer clic
 * @param {string} props.type - Tipo de botón HTML: 'button' | 'submit' | 'reset' (default: 'button')
 * @param {string} props.className - Clases CSS adicionales
 *
 * @returns {JSX.Element} Botón estilizado
 *
 * VARIANTES DE ESTILO:
 * - primary: Azul brillante con sombra, para acciones principales
 * - secondary: Gris oscuro, para acciones secundarias
 * - outline: Transparente con borde, para acciones terciarias
 * - ghost: Transparente, para acciones sutiles
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) {
  const baseStyles = 'font-bold rounded-full transition-all duration-200 flex items-center justify-center';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:bg-blue-800 disabled:cursor-not-allowed',
    secondary: 'bg-[#2a2a2a] hover:bg-[#333] text-white disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'bg-transparent border border-gray-600 hover:border-white text-white disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
