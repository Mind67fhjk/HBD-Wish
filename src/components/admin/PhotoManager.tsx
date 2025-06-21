import React, { useState, useEffect } from 'react';
import { Image, Trash2, Download, Upload, Grid, List, Shield } from 'lucide-react';
import { supabase, Photo } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface PhotoManagerProps {
  celebrationId: string;
}

export default function PhotoManager({ celebrationId }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  useEffect(() => {
    fetchPhotos();
  }, [celebrationId]);

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
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('celebration-photos')
        .remove([photo.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;

      toast.success('Photo deleted successfully');
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const deleteSelectedPhotos = async () => {
    if (selectedPhotos.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedPhotos.length} photos?`)) return;

    try {
      const photosToDelete = photos.filter(p => selectedPhotos.includes(p.id));
      const filePaths = photosToDelete.map(p => p.file_path);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('celebration-photos')
        .remove(filePaths);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .in('id', selectedPhotos);

      if (dbError) throw dbError;

      toast.success(`${selectedPhotos.length} photos deleted successfully`);
      setSelectedPhotos([]);
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photos:', error);
      toast.error('Failed to delete photos');
    }
  };

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('celebration-photos')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const downloadPhoto = async (photo: Photo) => {
    try {
      const { data, error } = await supabase.storage
        .from('celebration-photos')
        .download(photo.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = photo.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Photo downloaded successfully');
    } catch (error) {
      console.error('Error downloading photo:', error);
      toast.error('Failed to download photo');
    }
  };

  const downloadAllPhotos = async () => {
    if (photos.length === 0) return;
    
    toast.success('Starting download of all photos...');
    
    for (const photo of photos) {
      try {
        await downloadPhoto(photo);
        // Small delay to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to download ${photo.file_name}:`, error);
      }
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const selectAllPhotos = () => {
    setSelectedPhotos(selectedPhotos.length === photos.length ? [] : photos.map(p => p.id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading photos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <Image className="text-green-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{photos.length}</h3>
              <p className="text-white/60">Total Photos</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <Upload className="text-blue-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">
                {Math.round(photos.reduce((acc, p) => acc + (p.file_size || 0), 0) / 1024 / 1024 * 100) / 100}MB
              </h3>
              <p className="text-white/60">Total Size</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <Grid className="text-purple-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{selectedPhotos.length}</h3>
              <p className="text-white/60">Selected</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <Shield className="text-yellow-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">Admin</h3>
              <p className="text-white/60">Only Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={selectAllPhotos}
              className="btn-secondary"
            >
              {selectedPhotos.length === photos.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedPhotos.length > 0 && (
              <button
                onClick={deleteSelectedPhotos}
                className="px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-200 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Selected ({selectedPhotos.length})
              </button>
            )}
            {photos.length > 0 && (
              <button
                onClick={downloadAllPhotos}
                className="px-4 py-2 bg-green-500/20 border border-green-400/30 text-green-300 rounded-xl hover:bg-green-500/30 transition-all duration-200 flex items-center gap-2"
              >
                <Download size={16} />
                Download All
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-yellow-400/20 text-yellow-400' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-yellow-400/20 text-yellow-400' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="glass-card p-6 bg-yellow-400/10 border-yellow-400/20">
        <div className="flex items-center gap-3">
          <Shield className="text-yellow-400" size={24} />
          <div>
            <h4 className="text-yellow-400 font-medium">Admin Photo Management</h4>
            <p className="text-white/70 text-sm">Only administrators can download photos. Visitors can view and upload, but cannot download media files.</p>
          </div>
        </div>
      </div>

      {/* Photos Display */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Photo Gallery Management</h2>
        
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <Image size={64} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/60">No photos uploaded yet</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden bg-white/5">
                  <img
                    src={getPhotoUrl(photo.file_path)}
                    alt={photo.file_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2">
                  <button
                    onClick={() => togglePhotoSelection(photo.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      selectedPhotos.includes(photo.id)
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => downloadPhoto(photo)}
                    className="p-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-200"
                    title="Download photo (Admin only)"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="text-white/80 text-sm truncate">{photo.file_name}</p>
                  <p className="text-white/60 text-xs">
                    {new Date(photo.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {photos.map((photo) => (
              <div key={photo.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <input
                  type="checkbox"
                  checked={selectedPhotos.includes(photo.id)}
                  onChange={() => togglePhotoSelection(photo.id)}
                  className="w-5 h-5 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400/20"
                />
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={getPhotoUrl(photo.file_path)}
                    alt={photo.file_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{photo.file_name}</h4>
                  <p className="text-white/60 text-sm">
                    {Math.round((photo.file_size || 0) / 1024)}KB • {new Date(photo.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadPhoto(photo)}
                    className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all duration-200"
                    title="Download photo (Admin only)"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}