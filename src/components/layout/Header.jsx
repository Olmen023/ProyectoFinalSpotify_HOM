'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Header con navegación back/forward (opcional)
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
