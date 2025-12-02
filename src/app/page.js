'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import LoginScreen from '@/components/LoginScreen';

/**
 * Página principal - Muestra login o redirige a dashboard
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  // Si no está autenticado, mostrar pantalla de login
  if (!isAuthenticated()) {
    return <LoginScreen />;
  }

  // Mientras redirige, mostrar loading
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Redirecting to dashboard...</div>
    </div>
  );
}
