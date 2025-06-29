import React, { useState } from 'react';
import { Music, Upload, Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MusicManager() {
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

  const [currentTrack, setCurrentTrack] = useState(musicSettings.customAudioUrl || '');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        setCurrentTrack(url);
        
        // Save the custom audio URL to settings
        const newSettings = { ...musicSettings, customAudioUrl: url };
        setMusicSettings(newSettings);
        localStorage.setItem('elaja_music_settings', JSON.stringify(newSettings));
        
        toast.success(`Uploaded: ${file.name}`);
        
        // Create a test audio element to verify the file works
        const audio = new Audio(url);
        audio.addEventListener('canplaythrough', () => {
          toast.success('Audio file is ready to play!');
        });
        audio.addEventListener('error', () => {
          toast.error('Error loading audio file');
        });
      } else {
        toast.error('Please upload an audio file');
      }
    }
  };

  const testAudioPlayback = () => {
    if (!currentTrack) {
      // Test with Web Audio API beep
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      toast.success('Test sound played! (Upload an audio file for custom music)');
      return;
    }

    const audio = new Audio(currentTrack);
    audio.volume = musicSettings.volume / 100;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        toast.success('Playing audio!');
      }).catch(() => {
        toast.error('Failed to play audio');
      });
    }
  };

  const saveSettings = () => {
    localStorage.setItem('elaja_music_settings', JSON.stringify(musicSettings));
    toast.success('Music settings saved!');
    
    // Trigger a custom event to notify the music player of changes
    window.dispatchEvent(new CustomEvent('musicSettingsChanged', { 
      detail: musicSettings 
    }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      autoPlay: false,
      loop: true,
      volume: 50,
      fadeIn: true,
      fadeOut: true,
      showControls: true,
      customAudioUrl: null
    };
    setMusicSettings(defaultSettings);
    setCurrentTrack('');
    localStorage.setItem('elaja_music_settings', JSON.stringify(defaultSettings));
    toast.success('Settings reset to default');
    
    // Trigger event to notify music player
    window.dispatchEvent(new CustomEvent('musicSettingsChanged', { 
      detail: defaultSettings 
    }));
  };

  return (
    <div className="space-y-6">
      {/* Music Upload */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Music size={24} />
          Music & Audio Manager
        </h2>

        <div className="space-y-6">
          {/* Upload Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Upload Custom Music</h3>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors">
              <Upload size={48} className="mx-auto mb-4 text-white/40" />
              <p className="text-white/70 mb-4">Drag and drop your audio file here, or click to browse</p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="music-upload"
              />
              <label htmlFor="music-upload" className="btn-primary cursor-pointer">
                <Upload size={20} />
                Choose Audio File
              </label>
              <p className="text-white/50 text-sm mt-2">Supported formats: MP3, WAV, OGG, M4A</p>
            </div>
          </div>

          {/* Current Track */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Audio Test</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={testAudioPlayback}
                className="w-12 h-12 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center text-yellow-400 hover:bg-yellow-400/30 transition-all duration-200"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="flex-1">
                <p className="text-white font-medium">
                  {currentTrack ? 'Custom Audio Track' : 'Test Audio (Beep Sound)'}
                </p>
                <p className="text-white/60 text-sm">
                  {currentTrack ? 'Ready to play your uploaded music' : 'Click to test audio functionality'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Music Settings */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Playback Settings</h3>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Auto Play</p>
                  <p className="text-white/60 text-sm">Start music automatically when page loads</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={musicSettings.autoPlay}
                    onChange={(e) => setMusicSettings({ ...musicSettings, autoPlay: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Loop Music</p>
                  <p className="text-white/60 text-sm">Repeat music continuously</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={musicSettings.loop}
                    onChange={(e) => setMusicSettings({ ...musicSettings, loop: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Show Controls</p>
                  <p className="text-white/60 text-sm">Display music controls to visitors</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={musicSettings.showControls}
                    onChange={(e) => setMusicSettings({ ...musicSettings, showControls: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Fade In</p>
                  <p className="text-white/60 text-sm">Gradually increase volume when starting</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={musicSettings.fadeIn}
                    onChange={(e) => setMusicSettings({ ...musicSettings, fadeIn: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Fade Out</p>
                  <p className="text-white/60 text-sm">Gradually decrease volume when stopping</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={musicSettings.fadeOut}
                    onChange={(e) => setMusicSettings({ ...musicSettings, fadeOut: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Volume Control */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Default Volume: {musicSettings.volume}%
            </label>
            <div className="flex items-center gap-4">
              <VolumeX className="text-white/60" size={20} />
              <input
                type="range"
                min="0"
                max="100"
                value={musicSettings.volume}
                onChange={(e) => setMusicSettings({ ...musicSettings, volume: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <Volume2 className="text-white/60" size={20} />
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={saveSettings} className="btn-primary">
              <Music size={20} />
              Save Music Settings
            </button>
            <button onClick={resetSettings} className="btn-secondary">
              <RotateCcw size={20} />
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="glass-card p-6 bg-blue-400/10 border-blue-400/20">
        <h3 className="text-blue-400 font-medium mb-3">Music Setup Instructions</h3>
        <div className="space-y-2 text-white/70 text-sm">
          <p>• Upload your own audio files for custom birthday music</p>
          <p>• Recommended format: MP3 for best compatibility</p>
          <p>• Keep file size under 10MB for optimal loading</p>
          <p>• Test your music with the play button above</p>
          <p>• Settings will be applied to the public celebration page</p>
        </div>
      </div>
    </div>
  );
}