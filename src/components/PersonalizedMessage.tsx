import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const personalizedMessages = [
  "Happy Birthday, {name}! May this new year of life bring you endless possibilities and beautiful moments.",
  "Celebrating you today, {name}! Wishing you a year filled with love, success, and cherished memories.",
  "Happy Birthday, {name}! May your special day be as wonderful and extraordinary as you are.",
  "To {name}, on your birthday: May every moment be filled with happiness and every dream come true.",
  "Happy Birthday, {name}! Here's to another year of growth, adventure, and beautiful discoveries.",
  "Wishing {name} the most magnificent birthday! May this year exceed all your expectations.",
  "Happy Birthday, {name}! May your journey ahead be illuminated with joy and success."
];

export default function PersonalizedMessage() {
  const [name, setName] = useState('');
  const [currentMessage, setCurrentMessage] = useState(
    "Wishing you a day filled with joy, laughter, and everything your heart desires."
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const generateMessage = () => {
    if (!name.trim()) {
      // Gentle shake animation for empty input
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
      return;
    }

    const randomMessage = personalizedMessages[Math.floor(Math.random() * personalizedMessages.length)];
    const newMessage = randomMessage.replace('{name}', name.trim());
    
    setCurrentMessage(newMessage);
    setName('');
    
    // Create celebration effect
    createCelebrationEffect();
  };

  const createCelebrationEffect = () => {
    // This would trigger particle effects
    const event = new CustomEvent('celebrate');
    window.dispatchEvent(event);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateMessage();
    }
  };

  return (
    <div className="glass-card p-8 mb-8 text-center">
      <div className="mb-8">
        <p className="font-playfair text-xl md:text-2xl text-white leading-relaxed mb-6">
          {currentMessage}
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="relative mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a name for a personalized message"
            className={`w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-md focus:border-yellow-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 ${
              isAnimating ? 'animate-pulse' : ''
            }`}
          />
          <Heart className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
        </div>
        
        <button
          onClick={generateMessage}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold py-4 px-8 rounded-2xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <Sparkles size={20} />
          Create Personal Message
        </button>
      </div>
    </div>
  );
}