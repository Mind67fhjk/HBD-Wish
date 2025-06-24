import React, { useState, useEffect } from 'react';
import { Camera, Play, X, ChevronLeft, ChevronRight, Pause } from 'lucide-react';
import { supabase, Photo } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PhotoGalleryProps {
  celebrationId: string;
}

export default function PhotoGallery({ celebrationId }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPhotos();
    
    // Subscribe to real-time photo updates
    const subscription = supabase
      .channel(`photos_${celebrationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'photos',
        filter: `celebration_id=eq.${celebrationId}`
      }, (payload) => {
        console.log('New photo added:', payload);
        const newPhoto = payload.new as Photo;
        setPhotos(prev => [newPhoto, ...prev]);
        toast.success('New photo added to gallery!', { icon: '📸' });
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'photos',
        filter: `celebration_id=eq.${celebrationId}`
      }, (payload) => {
        console.log('Photo deleted:', payload);
        const deletedPhoto = payload.old as Photo;
        setPhotos(prev => prev.filter(photo => photo.id !== deletedPhoto.id));
        toast.success('Photo removed from gallery', { icon: '🗑️' });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [celebrationId]);

  useEffect(() => {
    if (slideshowPlaying && showSlideshow) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % photos.length);
      }, 3000);
      setSlideshowInterval(interval);
    } else {
      if (slideshowInterval) {
        clearInterval(slideshowInterval);
        setSlideshowInterval(null);
      }
    }

    return () => {
      if (slideshowInterval) {
        clearInterval(slideshowInterval);
      }
    };
  }, [slideshowPlaying, showSlideshow, photos.length]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('celebration_id', celebrationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to load photos');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${celebrationId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('celebration-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save photo record to database - this will trigger real-time update
        const { error: dbError } = await supabase
          .from('photos')
          .insert({
            celebration_id: celebrationId,
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
          });

        if (dbError) throw dbError;
        
        return true;
      } catch (error) {
        console.error('Error uploading photo:', error);
        toast.error(`Failed to upload ${file.name}`);
        return false;
      }
    });

    await Promise.all(uploadPromises);
    setLoading(false);
    e.target.value = '';
  };

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('celebration-photos')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const openSlideshow = (index: number) => {
    setCurrentSlideIndex(index);
    setShowSlideshow(true);
    setSlideshowPlaying(true);
  };

  const closeSlideshow = () => {
    setShowSlideshow(false);
    setSlideshowPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="font-playfair text-3xl text-yellow-400 text-center mb-8">Memory Gallery</h2>
      
      <div className="mb-6">
        <div className="flex gap-4 justify-center flex-wrap">
          <label className="btn-primary cursor-pointer">
            <Camera size={20} />
            Add Photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
          
          {photos.length > 0 && (
            <button
              onClick={() => openSlideshow(0)}
              className="btn-secondary"
            >
              <Play size={20} />
              Start Slideshow
            </button>
          )}
        </div>
        
        <p className="text-center text-white/60 text-sm mt-4">
          📸 Upload and view photos • 👁️ Admin-only downloads for privacy
        </p>
      </div>

      {loading && (
        <div className="text-center text-white/60 mb-4">
          Uploading photos...
        </div>
      )}

      <div className="min-h-[300px] border-2 border-dashed border-white/20 rounded-2xl bg-white/5 p-8">
        {photos.length === 0 ? (
          <div className="text-center text-white/60 h-full flex flex-col items-center justify-center">
            <Camera size={64} className="mb-4 opacity-40" />
            <p className="text-lg mb-2">No photos yet</p>
            <p className="text-sm">Click "Add Photos" to start your memory gallery!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg group relative"
                onClick={() => openSlideshow(index)}
              >
                <img
                  src={getPhotoUrl(photo.file_path)}
                  alt={photo.file_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slideshow Modal */}
      {showSlideshow && photos.length > 0 && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={closeSlideshow}
              className="absolute top-4 right-4 text-white hover:text-yellow-400 z-10"
            >
              <X size={32} />
            </button>
            
            <img
              src={getPhotoUrl(photos[currentSlideIndex].file_path)}
              alt={photos[currentSlideIndex].file_name}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                onClick={prevSlide}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={() => setSlideshowPlaying(!slideshowPlaying)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white transition-all"
              >
                {slideshowPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button
                onClick={nextSlide}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="absolute bottom-4 right-4 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-lg">
              {currentSlideIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}