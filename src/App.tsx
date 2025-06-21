import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase, Celebration } from './lib/supabase';
import Header from './components/Header';
import CountdownTimer from './components/CountdownTimer';
import PersonalizedMessage from './components/PersonalizedMessage';
import CelebrationButton from './components/CelebrationButton';
import PhotoGallery from './components/PhotoGallery';
import Guestbook from './components/Guestbook';
import InteractiveQuiz from './components/InteractiveQuiz';
import SharingSection from './components/SharingSection';
import FloatingParticles from './components/FloatingParticles';
import NotificationSystem from './components/NotificationSystem';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Set ElaJa's birthday date - Update this to your actual birthday!
  const ELAJA_BIRTHDAY = '2025-12-25T00:00:00'; // Change this to your birthday date

  useEffect(() => {
    fetchCelebration();
  }, []);

  const fetchCelebration = async () => {
    try {
      // Get celebration ID from URL params or use default
      const urlParams = new URLSearchParams(window.location.search);
      const celebrationId = urlParams.get('celebration');
      
      let query = supabase
        .from('celebrations')
        .select('*')
        .eq('is_public', true);
        
      if (celebrationId) {
        query = query.eq('id', celebrationId);
      }
      
      const { data, error } = await query.single();

      if (error) {
        // If no specific celebration found, get the first public one
        const { data: defaultData, error: defaultError } = await supabase
          .from('celebrations')
          .select('*')
          .eq('is_public', true)
          .limit(1)
          .single();
          
        if (defaultError) throw defaultError;
        setCelebration(defaultData);
      } else {
        setCelebration(data);
      }
    } catch (error) {
      console.error('Error fetching celebration:', error);
      // Create a fallback celebration with ElaJa's birthday
      setCelebration({
        id: 'elaja-birthday',
        title: 'ElaJa\'s Amazing Birthday Celebration',
        description: 'Join us in celebrating ElaJa\'s special day with joy, laughter, and wonderful memories!',
        target_date: ELAJA_BIRTHDAY,
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading ElaJa's celebration...</div>
      </div>
    );
  }

  if (!celebration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Celebration not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      <FloatingParticles />
      
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
            ElaJa Celebrations
          </div>
          <div className="text-sm text-white/50 mt-1">Creating Amazing Birthday Memories</div>
        </div>
        <p>&copy; 2025 ElaJa Celebrations - Where Every Moment Becomes a Beautiful Memory</p>
      </footer>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
          },
        }}
      />
    </div>
  );
}

export default App;