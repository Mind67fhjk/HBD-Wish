import React, { useRef, useEffect } from 'react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
}

export default function MusicPlayer({ isPlaying, onPlayStateChange }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Birthday celebration music URLs (you can replace these with your preferred tracks)
  const musicTracks = [
    'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder - replace with actual music
    // Add more tracks as needed
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        onPlayStateChange(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, onPlayStateChange]);

  const handleEnded = () => {
    // Loop the music or play next track
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        onPlayStateChange(false);
      });
    }
  };

  const handleError = () => {
    console.error('Error loading audio');
    onPlayStateChange(false);
  };

  return (
    <audio
      ref={audioRef}
      onEnded={handleEnded}
      onError={handleError}
      preload="metadata"
      loop
    >
      {/* You can add multiple source elements for different audio formats */}
      <source src="/birthday-music.mp3" type="audio/mpeg" />
      <source src="/birthday-music.ogg" type="audio/ogg" />
      {/* Fallback for browsers that don't support HTML5 audio */}
      Your browser does not support the audio element.
    </audio>
  );
}