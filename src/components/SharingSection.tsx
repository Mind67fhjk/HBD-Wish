import React, { useState } from 'react';
import { Share, Copy, Facebook, Twitter, MessageCircle, Instagram, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface SharingSectionProps {
  celebrationId: string;
  title: string;
}

export default function SharingSection({ celebrationId, title }: SharingSectionProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}?celebration=${celebrationId}`;
  const shareText = `🎉 Join me in celebrating ElaJa's special birthday! ${title} 🎂✨`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast.success('Link copied! You can paste it in Instagram');
        return;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="font-playfair text-3xl text-yellow-400 text-center mb-8">Share ElaJa's Celebration</h2>
      
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white backdrop-blur-md focus:outline-none cursor-default"
            />
            <button
              onClick={copyToClipboard}
              className="btn-primary flex-shrink-0"
            >
              <Copy size={20} />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-white/80 text-lg mb-6">Share on social media</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => shareToSocial('facebook')}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 hover:border-blue-400/50 rounded-2xl text-blue-300 transition-all duration-300 hover:scale-105"
            >
              <Facebook size={20} />
              <span className="hidden sm:inline">Facebook</span>
            </button>
            
            <button
              onClick={() => shareToSocial('twitter')}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-400/30 hover:border-sky-400/50 rounded-2xl text-sky-300 transition-all duration-300 hover:scale-105"
            >
              <Twitter size={20} />
              <span className="hidden sm:inline">Twitter</span>
            </button>
            
            <button
              onClick={() => shareToSocial('telegram')}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-300/30 hover:border-blue-300/50 rounded-2xl text-blue-200 transition-all duration-300 hover:scale-105"
            >
              <Send size={20} />
              <span className="hidden sm:inline">Telegram</span>
            </button>
            
            <button
              onClick={() => shareToSocial('instagram')}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 hover:border-pink-400/50 rounded-2xl text-purple-200 transition-all duration-300 hover:scale-105"
            >
              <Instagram size={20} />
              <span className="hidden sm:inline">Instagram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}