'use client';

/**
 * Componente Button reutilizable con variantes de estilo
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
