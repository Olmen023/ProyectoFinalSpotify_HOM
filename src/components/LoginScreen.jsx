'use client';

import { Music } from 'lucide-react';
import { useState } from 'react';

/**
 * Pantalla de Login con diseño minimalista
 * Este componente debe ser importado en src/app/page.js manualmente
 */
export default function LoginScreen({ onSpotifyLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Este es un login decorativo. El login real es con Spotify OAuth
    console.log('Login with:', email, password);
  };

  const handleSpotifyLogin = () => {
    // Redirigir al endpoint de autenticación de Spotify
    window.location.href = '/api/spotify-token';
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] flex flex-col justify-center">
        {/* Logo Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <Music size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            MusicStream
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">
              Email or username
            </label>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg px-4 py-3.5 border border-transparent focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <a
                href="#"
                className="text-sm font-medium text-blue-500 hover:text-blue-400"
              >
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg px-4 py-3.5 border border-transparent focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-full transition-colors mt-8 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Spotify Login Button */}
        <button
          onClick={handleSpotifyLogin}
          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-3.5 rounded-full transition-colors shadow-[0_0_15px_rgba(29,185,84,0.3)]"
        >
          Continue with Spotify
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don&apos;t have an account?{' '}
          <a href="#" className="text-blue-500 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}
