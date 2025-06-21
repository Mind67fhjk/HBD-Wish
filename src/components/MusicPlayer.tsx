import React, { useRef, useEffect, useState } from 'react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
}

export default function MusicPlayer({ isPlaying, onPlayStateChange }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasValidAudio, setHasValidAudio] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Create a simple beep sound using Web Audio API as fallback
  const createBeepSound = () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      return ctx;
    }
    return audioContext;
  };

  const playBeepSound = () => {
    const ctx = createBeepSound();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  };

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
    
    if (isPlaying) {
      if (hasValidAudio && audio) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          // Fallback to beep sound
          playBeepSound();
        });
      } else {
        // Play beep sound as fallback
        playBeepSound();
      }
    } else {
      if (audio) {
        audio.pause();
      }
    }
  }, [isPlaying, hasValidAudio]);

  const handleEnded = () => {
    if (audioRef.current && hasValidAudio) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        onPlayStateChange(false);
      });
    }
  };

  const handleError = () => {
    console.warn('Audio file not found - using fallback sound');
    setHasValidAudio(false);
  };

  return (
    <>
      {hasValidAudio && (
        <audio
          ref={audioRef}
          onEnded={handleEnded}
          onError={handleError}
          preload="metadata"
          loop
        >
          <source src="/birthday-music.mp3" type="audio/mpeg" />
          <source src="/birthday-music.ogg" type="audio/ogg" />
        </audio>
      )}
    </>
  );
}