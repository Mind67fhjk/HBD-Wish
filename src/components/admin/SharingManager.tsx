import React, { useState } from 'react';
import { Share2, Copy, QrCode, Link, Settings } from 'lucide-react';
import { Celebration } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface SharingManagerProps {
  celebration: Celebration;
}

export default function SharingManager({ celebration }: SharingManagerProps) {
  const [shareSettings, setShareSettings] = useState({
    enableFacebook: true,
    enableTwitter: true,
    enableTelegram: true,
    enableInstagram: true,
    enableWhatsApp: false,
    customMessage: `🎉 Join me in celebrating ${celebration.title}! 🎂✨`,
    showQRCode: true,
    trackClicks: true
  });

  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}?celebration=${celebration.id}`;
  const shortUrl = `${baseUrl}/c/${celebration.id.slice(0, 8)}`;

  const socialPlatforms = [
    {
      name: 'Facebook',
      key: 'enableFacebook',
      color: 'bg-blue-600',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareSettings.customMessage)}`
    },
    {
      name: 'Twitter',
      key: 'enableTwitter',
      color: 'bg-sky-500',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareSettings.customMessage)}`
    },
    {
      name: 'Telegram',
      key: 'enableTelegram',
      color: 'bg-blue-500',
      icon: '✈️',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareSettings.customMessage)}`
    },
    {
      name: 'Instagram',
      key: 'enableInstagram',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      icon: '📷',
      url: '#'
    },
    {
      name: 'WhatsApp',
      key: 'enableWhatsApp',
      color: 'bg-green-500',
      icon: '💬',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareSettings.customMessage} ${shareUrl}`)}`
    }
  ];

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const generateQRCode = () => {
    // In a real implementation, you'd use a QR code library
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
    return qrUrl;
  };

  const saveSettings = () => {
    localStorage.setItem('elaja_share_settings', JSON.stringify(shareSettings));
    toast.success('Sharing settings saved!');
  };

  const testShare = (platform: any) => {
    if (platform.name === 'Instagram') {
      copyToClipboard(`${shareSettings.customMessage} ${shareUrl}`, 'Instagram share text');
      toast.success('Link copied! You can paste it in Instagram');
    } else {
      window.open(platform.url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="space-y-6">
      {/* Share Links */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Share2 size={24} />
          Sharing & Social Media
        </h2>

        <div className="space-y-6">
          {/* Main Share URL */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Share Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Share URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl, 'Share URL')}
                    className="btn-secondary"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Short URL (Custom)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(shortUrl, 'Short URL')}
                    className="btn-secondary"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {shareSettings.showQRCode && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">QR Code</h3>
              <div className="flex items-center gap-6">
                <div className="bg-white p-4 rounded-xl">
                  <img
                    src={generateQRCode()}
                    alt="QR Code"
                    className="w-32 h-32"
                  />
                </div>
                <div>
                  <p className="text-white/80 mb-2">Scan to visit celebration</p>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generateQRCode();
                      link.download = 'celebration-qr-code.png';
                      link.click();
                    }}
                    className="btn-secondary"
                  >
                    <QrCode size={20} />
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social Media Settings */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Social Media Platforms</h3>

        <div className="space-y-6">
          {/* Custom Message */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Custom Share Message
            </label>
            <textarea
              value={shareSettings.customMessage}
              onChange={(e) => setShareSettings({ ...shareSettings, customMessage: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 resize-none"
              placeholder="Enter your custom share message"
            />
          </div>

          {/* Platform Settings */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Enabled Platforms</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialPlatforms.map((platform) => (
                <div
                  key={platform.name}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    shareSettings[platform.key as keyof typeof shareSettings]
                      ? 'border-white/30 bg-white/5'
                      : 'border-white/10 bg-white/2 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                        {platform.icon}
                      </div>
                      <span className="text-white font-medium">{platform.name}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareSettings[platform.key as keyof typeof shareSettings] as boolean}
                        onChange={(e) => setShareSettings({
                          ...shareSettings,
                          [platform.key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>
                  
                  {shareSettings[platform.key as keyof typeof shareSettings] && (
                    <button
                      onClick={() => testShare(platform)}
                      className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all duration-200"
                    >
                      Test Share
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Additional Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Show QR Code</p>
                  <p className="text-white/60 text-sm">Display QR code for easy mobile sharing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareSettings.showQRCode}
                    onChange={(e) => setShareSettings({ ...shareSettings, showQRCode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Track Clicks</p>
                  <p className="text-white/60 text-sm">Monitor how many people click your share links</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareSettings.trackClicks}
                    onChange={(e) => setShareSettings({ ...shareSettings, trackClicks: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>
            </div>
          </div>

          <button onClick={saveSettings} className="btn-primary">
            <Settings size={20} />
            Save Sharing Settings
          </button>
        </div>
      </div>

      {/* Share Analytics */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Share Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-white/60">Total Shares</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-white/60">Link Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">0%</div>
            <div className="text-white/60">Conversion Rate</div>
          </div>
        </div>
        
        <p className="text-white/60 text-sm text-center mt-4">
          Analytics will be available once sharing tracking is enabled
        </p>
      </div>
    </div>
  );
}