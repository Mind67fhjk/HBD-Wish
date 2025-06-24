import React, { useRef, useEffect, useState } from 'react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
}

export default function MusicPlayer({ isPlaying, onPlayStateChange }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasValidAudio, setHasValidAudio] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [musicSettings, setMusicSettings] = useState(() => {
    const saved = localStorage.getItem('elaja_music_settings');
    return saved ? JSON.parse(saved) : {
      autoPlay: false,
      loop: true,
      volume: 50,
      fadeIn: true,
      fadeOut: true,
      showControls: true,
      customAudioUrl: null
    };
  });

  // Listen for music settings changes from admin
  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent) => {
      setMusicSettings(event.detail);
    };

    window.addEventListener('musicSettingsChanged', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('musicSettingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

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
    
    gainNode.gain.setValueAtTime(musicSettings.volume / 100 * 0.3, ctx.currentTime);
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
    
    // Test custom audio URL first, then fallback to default
    const audioUrl = musicSettings.customAudioUrl || '/birthday-music.mp3';
    audio.src = audioUrl;
    audio.load();
    
    return () => {
      audio.removeEventListener('canplaythrough', () => {});
      audio.removeEventListener('error', () => {});
    };
  }, [musicSettings.customAudioUrl]);

  // Apply music settings to audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && hasValidAudio) {
      audio.volume = musicSettings.volume / 100;
      audio.loop = musicSettings.loop;
      
      // Set the audio source
      const audioUrl = musicSettings.customAudioUrl || '/birthday-music.mp3';
      if (audio.src !== audioUrl) {
        audio.src = audioUrl;
        audio.load();
      }
    }
  }, [musicSettings, hasValidAudio]);

  // Auto-play functionality
  useEffect(() => {
    if (musicSettings.autoPlay && hasValidAudio && audioRef.current) {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        onPlayStateChange(true);
      }, 1000);
    }
  }, [musicSettings.autoPlay, hasValidAudio, onPlayStateChange]);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      if (hasValidAudio && audio) {
        // Apply fade in effect
        if (musicSettings.fadeIn) {
          audio.volume = 0;
          audio.play().then(() => {
            const fadeInInterval = setInterval(() => {
              if (audio.volume < musicSettings.volume / 100) {
                audio.volume = Math.min(audio.volume + 0.05, musicSettings.volume / 100);
              } else {
                clearInterval(fadeInInterval);
              }
            }, 100);
          }).catch(error => {
            console.error('Error playing audio:', error);
            playBeepSound();
          });
        } else {
          audio.volume = musicSettings.volume / 100;
          audio.play().catch(error => {
            console.error('Error playing audio:', error);
            playBeepSound();
          });
        }
      } else {
        // Play beep sound as fallback
        playBeepSound();
      }
    } else {
      if (audio) {
        // Apply fade out effect
        if (musicSettings.fadeOut && !audio.paused) {
          const fadeOutInterval = setInterval(() => {
            if (audio.volume > 0.05) {
              audio.volume = Math.max(audio.volume - 0.05, 0);
            } else {
              audio.pause();
              audio.volume = musicSettings.volume / 100;
              clearInterval(fadeOutInterval);
            }
          }, 100);
        } else {
          audio.pause();
        }
      }
    }
  }, [isPlaying, hasValidAudio, musicSettings]);

  const handleEnded = () => {
    if (audioRef.current && hasValidAudio && musicSettings.loop) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        onPlayStateChange(false);
      });
    } else {
      onPlayStateChange(false);
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
          loop={musicSettings.loop}
        >
          <source src={musicSettings.customAudioUrl || '/birthday-music.mp3'} type="audio/mpeg" />
          <source src="/birthday-music.ogg" type="audio/ogg" />
        </audio>
      )}
    </>
  );
}