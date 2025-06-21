import React, { useState } from 'react';
import { Celebration } from '../lib/supabase';
import Header from './Header';
import CountdownTimer from './CountdownTimer';
import PersonalizedMessage from './PersonalizedMessage';
import CelebrationButton from './CelebrationButton';
import PhotoGallery from './PhotoGallery';
import Guestbook from './Guestbook';
import InteractiveQuiz from './InteractiveQuiz';
import SharingSection from './SharingSection';
import NotificationSystem from './NotificationSystem';
import MusicPlayer from './MusicPlayer';

interface PublicAppProps {
  celebration: Celebration;
}

export default function PublicApp({ celebration }: PublicAppProps) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <>
      <Header
        title={celebration.title}
        onMusicToggle={toggleMusic}
        isMusicPlaying={isMusicPlaying}
      />
      
      <NotificationSystem celebrationId={celebration.id} />
      
      <MusicPlayer 
        isPlaying={isMusicPlaying} 
        onPlayStateChange={setIsMusicPlaying}
      />
      
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <CountdownTimer targetDate={celebration.target_date} />
        
        <PersonalizedMessage />
        
        <CelebrationButton />
        
        <PhotoGallery celebrationId={celebration.id} />
        
        <Guestbook celebrationId={celebration.id} />
        
        <InteractiveQuiz celebrationId={celebration.id} />
        
        <SharingSection 
          celebrationId={celebration.id} 
          title={celebration.title} 
        />
      </main>
      
      <footer className="text-center py-12 text-white/70 font-light relative z-10">
        <div className="w-16 h-px bg-white/30 mx-auto mb-8"></div>
        <div className="mb-4">
          <div className="font-playfair text-lg font-semibold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            ElaJa
          </div>
          <div className="text-sm text-white/50 mt-1">Celebrations</div>
        </div>
        <p>&copy; 2025 ElaJa - Creating Amazing Birthday Memories</p>
      </footer>
    </>
  );
}