import React, { useRef, useEffect, useState } from 'react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
}

export default function MusicPlayer({ isPlaying, onPlayStateChange }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasValidAudio, setHasValidAudio] = useState(false);

  // Check if audio file exists and is valid
  useEffect(() => {
    const audio = new Audio();
    audio.addEventListener('canplaythrough', () => {
      setHasValidAudio(true);
    });
    audio.addEventListener('error', () => {
      setHasValidAudio(false);
    });
    
    // Test if the audio file exists
    audio.src = '/birthday-music.mp3';
    audio.load();
    
    return () => {
      audio.removeEventListener('canplaythrough', () => {});
      audio.removeEventListener('error', () => {});
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasValidAudio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        onPlayStateChange(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, onPlayStateChange, hasValidAudio]);

  const handleEnded = () => {
    // Loop the music or play next track
    if (audioRef.current && hasValidAudio) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        onPlayStateChange(false);
      });
    }
  };

  const handleError = () => {
    console.warn('Audio file not found or invalid - music player disabled');
    setHasValidAudio(false);
    onPlayStateChange(false);
  };

  const handleCanPlay = () => {
    setHasValidAudio(true);
  };

  // Don't render audio element if no valid audio file
  if (!hasValidAudio) {
    return null;
  }

  return (
    <audio
      ref={audioRef}
      onEnded={handleEnded}
      onError={handleError}
      onCanPlay={handleCanPlay}
      preload="metadata"
      loop
    >
      <source src="/birthday-music.mp3" type="audio/mpeg" />
      <source src="/birthday-music.ogg" type="audio/ogg" />
      Your browser does not support the audio element.
    </audio>
  );
}