import React, { useState } from 'react';
import { Music, Upload, Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MusicManager() {
  const [musicSettings, setMusicSettings] = useState({
    autoPlay: false,
    loop: true,
    volume: 50,
    fadeIn: true,
    fadeOut: true,
    showControls: true
  });

  const [currentTrack, setCurrentTrack] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const musicPresets = [
    {
      name: 'Happy Birthday Classic',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      description: 'Traditional birthday celebration music'
    },
    {
      name: 'Celebration Fanfare',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      description: 'Upbeat celebration music'
    },
    {
      name: 'Gentle Birthday Melody',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      description: 'Soft and elegant birthday tune'
    },
    {
      name: 'Party Time',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      description: 'Energetic party music'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        setCurrentTrack(url);
        toast.success(`Uploaded: ${file.name}`);
      } else {
        toast.error('Please upload an audio file');
      }
    }
  };

  const selectPreset = (preset: any) => {
    setCurrentTrack(preset.url);
    toast.success(`Selected: ${preset.name}`);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const saveSettings = () => {
    localStorage.setItem('elaja_music_settings', JSON.stringify(musicSettings));
    toast.success('Music settings saved!');
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

          {/* Music Presets */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Music Presets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {musicPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => selectPreset(preset)}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Music className="text-blue-400" size={20} />
                    <div>
                      <h4 className="text-white font-medium">{preset.name}</h4>
                      <p className="text-white/60 text-sm">{preset.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Track */}
          {currentTrack && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Current Track</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayback}
                  className="w-12 h-12 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center text-yellow-400 hover:bg-yellow-400/30 transition-all duration-200"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div className="flex-1">
                  <p className="text-white font-medium">Audio Track</p>
                  <p className="text-white/60 text-sm">Ready to play</p>
                </div>
                <audio
                  src={currentTrack}
                  controls
                  className="max-w-xs"
                  style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                />
              </div>
            </div>
          )}
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
            <button
              onClick={() => setMusicSettings({
                autoPlay: false,
                loop: true,
                volume: 50,
                fadeIn: true,
                fadeOut: true,
                showControls: true
              })}
              className="btn-secondary"
            >
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
          <p>• Upload your own audio files or select from our presets</p>
          <p>• Recommended format: MP3 for best compatibility</p>
          <p>• Keep file size under 10MB for optimal loading</p>
          <p>• Test your music with different volume levels</p>
          <p>• Consider your audience - some may prefer no auto-play</p>
        </div>
      </div>
    </div>
  );
}