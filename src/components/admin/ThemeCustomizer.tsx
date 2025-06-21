import React, { useState } from 'react';
import { Palette, Save, RotateCcw, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ThemeCustomizer() {
  const [theme, setTheme] = useState({
    primaryColor: '#d4af37',
    secondaryColor: '#f4d03f',
    backgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)',
    textColor: '#ffffff',
    accentColor: '#e8e8e8',
    borderRadius: '24px',
    glassOpacity: 0.05,
    particleIntensity: 15
  });

  const [previewMode, setPreviewMode] = useState(false);

  const colorPresets = [
    {
      name: 'Golden Elegance (Default)',
      colors: {
        primaryColor: '#d4af37',
        secondaryColor: '#f4d03f',
        accentColor: '#e8e8e8'
      }
    },
    {
      name: 'Royal Purple',
      colors: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#a78bfa',
        accentColor: '#ddd6fe'
      }
    },
    {
      name: 'Ocean Blue',
      colors: {
        primaryColor: '#0ea5e9',
        secondaryColor: '#38bdf8',
        accentColor: '#bae6fd'
      }
    },
    {
      name: 'Rose Gold',
      colors: {
        primaryColor: '#f43f5e',
        secondaryColor: '#fb7185',
        accentColor: '#fecdd3'
      }
    },
    {
      name: 'Emerald Green',
      colors: {
        primaryColor: '#10b981',
        secondaryColor: '#34d399',
        accentColor: '#a7f3d0'
      }
    }
  ];

  const backgroundPresets = [
    {
      name: 'Purple Galaxy (Default)',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)'
    },
    {
      name: 'Sunset Dreams',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
    },
    {
      name: 'Ocean Depths',
      gradient: 'linear-gradient(135deg, #0c4a6e 0%, #075985 25%, #0369a1 50%, #0284c7 75%, #0ea5e9 100%)'
    },
    {
      name: 'Forest Mystique',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 25%, #047857 50%, #059669 75%, #10b981 100%)'
    },
    {
      name: 'Midnight Elegance',
      gradient: 'linear-gradient(135deg, #1f2937 0%, #374151 25%, #4b5563 50%, #6b7280 75%, #9ca3af 100%)'
    }
  ];

  const applyColorPreset = (preset: any) => {
    setTheme(prev => ({
      ...prev,
      ...preset.colors
    }));
  };

  const applyBackgroundPreset = (preset: any) => {
    setTheme(prev => ({
      ...prev,
      backgroundColor: preset.gradient
    }));
  };

  const saveTheme = () => {
    localStorage.setItem('elaja_theme', JSON.stringify(theme));
    toast.success('Theme saved successfully!');
    
    // Apply theme to document
    applyThemeToDocument();
  };

  const resetTheme = () => {
    const defaultTheme = {
      primaryColor: '#d4af37',
      secondaryColor: '#f4d03f',
      backgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)',
      textColor: '#ffffff',
      accentColor: '#e8e8e8',
      borderRadius: '24px',
      glassOpacity: 0.05,
      particleIntensity: 15
    };
    setTheme(defaultTheme);
    toast.success('Theme reset to default');
  };

  const applyThemeToDocument = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--border-radius', theme.borderRadius);
    root.style.setProperty('--glass-opacity', theme.glassOpacity.toString());
    
    // Apply background
    document.body.style.background = theme.backgroundColor;
  };

  const togglePreview = () => {
    if (!previewMode) {
      applyThemeToDocument();
    } else {
      // Reset to default
      window.location.reload();
    }
    setPreviewMode(!previewMode);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Theme Customizer</h2>
            <p className="text-white/60">Customize the look and feel of your celebration</p>
          </div>
          <div className="flex gap-3">
            <button onClick={togglePreview} className="btn-secondary">
              <Eye size={20} />
              {previewMode ? 'Exit Preview' : 'Preview'}
            </button>
            <button onClick={resetTheme} className="btn-secondary">
              <RotateCcw size={20} />
              Reset
            </button>
            <button onClick={saveTheme} className="btn-primary">
              <Save size={20} />
              Save Theme
            </button>
          </div>
        </div>
      </div>

      {/* Color Customization */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Palette size={24} />
          Color Scheme
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Presets */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Color Presets</h4>
            <div className="space-y-3">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyColorPreset(preset)}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: preset.colors.primaryColor }}
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: preset.colors.secondaryColor }}
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: preset.colors.accentColor }}
                      />
                    </div>
                    <span className="text-white font-medium">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Custom Colors</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Customization */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Background</h3>

        <div>
          <h4 className="text-lg font-medium text-white mb-4">Background Presets</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backgroundPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyBackgroundPreset(preset)}
                className="p-4 border border-white/20 rounded-xl hover:border-white/40 transition-all duration-200 text-left"
                style={{ background: preset.gradient }}
              >
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
                  <span className="text-white font-medium">{preset.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Advanced Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Border Radius: {theme.borderRadius}
            </label>
            <input
              type="range"
              min="8"
              max="32"
              value={parseInt(theme.borderRadius)}
              onChange={(e) => setTheme({ ...theme, borderRadius: `${e.target.value}px` })}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Glass Opacity: {Math.round(theme.glassOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0.02"
              max="0.15"
              step="0.01"
              value={theme.glassOpacity}
              onChange={(e) => setTheme({ ...theme, glassOpacity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Particle Intensity: {theme.particleIntensity}
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={theme.particleIntensity}
              onChange={(e) => setTheme({ ...theme, particleIntensity: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Preview Warning */}
      {previewMode && (
        <div className="glass-card p-6 border-yellow-400/30 bg-yellow-400/10">
          <div className="flex items-center gap-3">
            <Eye className="text-yellow-400" size={24} />
            <div>
              <h4 className="text-yellow-400 font-medium">Preview Mode Active</h4>
              <p className="text-white/70 text-sm">You're currently previewing your theme changes. Click "Save Theme" to make them permanent.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}