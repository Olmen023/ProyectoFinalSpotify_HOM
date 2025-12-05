'use client';

import { useState } from 'react';
import { X, Copy, Check, Share2, Link as LinkIcon } from 'lucide-react';
import Button from '@/components/ui/Button';

/**
 * Modal para compartir playlist
 */
export default function SharePlaylistModal({ playlist, playlistName, onClose }) {
  const [copied, setCopied] = useState(false);

  // Generar URL compartible
  const generateShareUrl = () => {
    if (typeof window === 'undefined') return '';

    const trackIds = playlist.map(track => track.id).join(',');
    const encodedName = encodeURIComponent(playlistName || 'Shared Playlist');

    const shareUrl = new URL(window.location.origin);
    shareUrl.pathname = '/shared-playlist';
    shareUrl.searchParams.set('tracks', trackIds);
    shareUrl.searchParams.set('name', encodedName);

    return shareUrl.toString();
  };

  const shareUrl = generateShareUrl();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: playlistName || 'My Playlist',
          text: `Check out my playlist: ${playlistName}`,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#181818] rounded-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <Share2 size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Share Playlist</h2>
          <p className="text-gray-400">
            Share this playlist with your friends
          </p>
        </div>

        {/* Playlist Info */}
        <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-2">{playlistName}</h3>
          <p className="text-gray-400 text-sm">
            {playlist.length} {playlist.length === 1 ? 'song' : 'songs'}
          </p>
        </div>

        {/* Share URL */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Share Link</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-gray-300 truncate">
              {shareUrl}
            </div>
            <Button
              onClick={handleCopy}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2 flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleShare}
            variant="primary"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Close
          </Button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Anyone with this link can view your playlist
        </p>
      </div>
    </div>
  );
}
