import React, { useState } from 'react';
import { Calendar, Save, RefreshCw, Clock } from 'lucide-react';
import { supabase, Celebration } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface CelebrationSettingsProps {
  celebration: Celebration;
  onRefresh: () => void;
}

export default function CelebrationSettings({ celebration, onRefresh }: CelebrationSettingsProps) {
  const [formData, setFormData] = useState({
    title: celebration.title,
    description: celebration.description || '',
    target_date: new Date(celebration.target_date).toISOString().slice(0, 16),
    is_public: celebration.is_public
  });
  
  // Countdown time controls
  const [countdownTime, setCountdownTime] = useState(() => {
    const now = new Date();
    const target = new Date(celebration.target_date);
    const diff = target.getTime() - now.getTime();
    
    return {
      days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
      minutes: Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))),
      seconds: Math.max(0, Math.floor((diff % (1000 * 60)) / 1000))
    };
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('celebrations')
        .update({
          title: formData.title,
          description: formData.description,
          target_date: new Date(formData.target_date).toISOString(),
          is_public: formData.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', celebration.id);

      if (error) throw error;

      toast.success('Celebration settings updated successfully!');
      onRefresh();
    } catch (error) {
      console.error('Error updating celebration:', error);
      toast.error('Failed to update celebration settings');
    } finally {
      setLoading(false);
    }
  };

  const updateCountdownTime = () => {
    const now = new Date();
    const newTargetTime = new Date(
      now.getTime() + 
      (countdownTime.days * 24 * 60 * 60 * 1000) +
      (countdownTime.hours * 60 * 60 * 1000) +
      (countdownTime.minutes * 60 * 1000) +
      (countdownTime.seconds * 1000)
    );
    
    setFormData({
      ...formData,
      target_date: newTargetTime.toISOString().slice(0, 16)
    });
    
    toast.success('Countdown time updated! Remember to save changes.');
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Calendar size={24} />
          Celebration Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Celebration Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
              placeholder="Enter celebration title"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 resize-none"
              placeholder="Enter celebration description"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Birthday Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="w-5 h-5 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400/20"
            />
            <label htmlFor="is_public" className="text-white/80">
              Make celebration public (visible to everyone)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={onRefresh}
              className="btn-secondary"
            >
              <RefreshCw size={20} />
              Refresh
            </button>
          </div>
        </form>
      </div>

      {/* Countdown Time Controls */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Clock size={24} />
          Countdown Timer Controls
        </h2>
        
        <div className="space-y-6">
          <p className="text-white/70">Set a custom countdown time from now:</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Days</label>
              <input
                type="number"
                min="0"
                max="365"
                value={countdownTime.days}
                onChange={(e) => setCountdownTime({ ...countdownTime, days: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Hours</label>
              <input
                type="number"
                min="0"
                max="23"
                value={countdownTime.hours}
                onChange={(e) => setCountdownTime({ ...countdownTime, hours: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={countdownTime.minutes}
                onChange={(e) => setCountdownTime({ ...countdownTime, minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={countdownTime.seconds}
                onChange={(e) => setCountdownTime({ ...countdownTime, seconds: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
              />
            </div>
          </div>
          
          <button
            onClick={updateCountdownTime}
            className="btn-primary"
          >
            <Clock size={20} />
            Set Countdown Time
          </button>
          
          <div className="p-4 bg-blue-400/10 border border-blue-400/20 rounded-xl">
            <p className="text-blue-400 text-sm">
              <strong>Preview:</strong> Countdown will show {countdownTime.days} days, {countdownTime.hours} hours, {countdownTime.minutes} minutes, and {countdownTime.seconds} seconds from now.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Advanced Settings</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-xl">
            <h3 className="text-yellow-400 font-medium mb-2">Celebration ID</h3>
            <p className="text-white/60 text-sm mb-2">Use this ID to share your specific celebration:</p>
            <code className="text-yellow-400 text-sm bg-black/20 px-2 py-1 rounded">
              {celebration.id}
            </code>
          </div>

          <div className="p-4 bg-blue-400/10 border border-blue-400/20 rounded-xl">
            <h3 className="text-blue-400 font-medium mb-2">Direct Link</h3>
            <p className="text-white/60 text-sm mb-2">Share this link directly:</p>
            <code className="text-blue-400 text-sm bg-black/20 px-2 py-1 rounded break-all">
              {window.location.origin}?celebration={celebration.id}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}