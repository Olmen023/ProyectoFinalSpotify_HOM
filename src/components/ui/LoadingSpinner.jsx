'use client';

/**
 * Spinner de carga animado
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
 * Spinner de página completa con overlay
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
