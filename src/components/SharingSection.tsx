import React, { useState } from 'react';
import { Share, Copy, Facebook, Twitter, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SharingSectionProps {
  celebrationId: string;
  title: string;
}

export default function SharingSection({ celebrationId, title }: SharingSectionProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}?celebration=${celebrationId}`;
  const shareText = `Join me in celebrating this special birthday! 🎉 ${title}`;

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
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="font-playfair text-3xl text-yellow-400 text-center mb-8">Share the Celebration</h2>
      
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
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => shareToSocial('facebook')}
              className="flex items-center gap-3 px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 hover:border-blue-400/50 rounded-2xl text-blue-300 transition-all duration-300"
            >
              <Facebook size={20} />
              Facebook
            </button>
            
            <button
              onClick={() => shareToSocial('twitter')}
              className="flex items-center gap-3 px-6 py-3 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-400/30 hover:border-sky-400/50 rounded-2xl text-sky-300 transition-all duration-300"
            >
              <Twitter size={20} />
              Twitter
            </button>
            
            <button
              onClick={() => shareToSocial('whatsapp')}
              className="flex items-center gap-3 px-6 py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 hover:border-green-400/50 rounded-2xl text-green-300 transition-all duration-300"
            >
              <MessageCircle size={20} />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}