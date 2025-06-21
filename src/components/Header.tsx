import React from 'react';
import { Music, Music as MusicOff } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMusicToggle: () => void;
  isMusicPlaying: boolean;
}

export default function Header({ title, onMusicToggle, isMusicPlaying }: HeaderProps) {
  return (
    <header className="text-center py-16 px-8 relative">
      {/* ElaJa Logo */}
      <div className="absolute top-8 left-8 z-50">
        <div className="font-playfair text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
          ElaJa
        </div>
        <div className="text-xs text-white/60 font-light tracking-wider">
          CELEBRATIONS
        </div>
      </div>

      {/* Music Toggle Button */}
      <button
        onClick={onMusicToggle}
        className={`fixed top-8 right-8 w-15 h-15 rounded-full backdrop-blur-md border transition-all duration-300 z-50 flex items-center justify-center ${
          isMusicPlaying
            ? 'bg-yellow-500/20 border-yellow-400/40 text-yellow-400 animate-pulse'
            : 'bg-white/10 border-white/20 text-white hover:bg-yellow-500/20 hover:border-yellow-400/40'
        }`}
        title={isMusicPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isMusicPlaying ? <Music size={24} /> : <MusicOff size={24} />}
      </button>
      
      <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-white mb-8 tracking-wide">
        <span className="bg-gradient-to-r from-white via-gray-200 to-yellow-400 bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      
      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto opacity-60 animate-pulse"></div>
    </header>
  );
}