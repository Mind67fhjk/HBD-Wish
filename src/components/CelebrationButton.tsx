import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const celebrationIcons = ['✨', '🌟', '💫', '⭐', '🎊', '🥂', '🎭', '🎪'];

export default function CelebrationButton() {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const celebrate = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIconIndex((prev) => (prev + 1) % celebrationIcons.length);
    
    // Create celebration particles
    createCelebrationEffect();
    
    // Create wish effect
    createWishEffect();
    
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const createCelebrationEffect = () => {
    const colors = ['#d4af37', '#f4d03f', '#ffffff', '#e8e8e8'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        left: ${centerX}px;
        top: ${centerY}px;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 0 6px ${colors[Math.floor(Math.random() * colors.length)]};
      `;
      
      const angle = (Math.PI * 2 * i) / 12;
      const velocity = 80 + Math.random() * 40;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      particle.animate([
        { opacity: 1, transform: 'translate(0, 0) scale(1)' },
        { opacity: 0, transform: `translate(${vx}px, ${vy}px) scale(0)` }
      ], {
        duration: 2000,
        easing: 'ease-out'
      });
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 2000);
    }
  };

  const createWishEffect = () => {
    const wish = document.createElement('div');
    wish.textContent = '✨ Make a wish ✨';
    wish.style.cssText = `
      position: fixed;
      left: 50%;
      top: 30%;
      transform: translateX(-50%);
      color: #d4af37;
      font-size: 1.2rem;
      font-family: 'Playfair Display', serif;
      font-weight: 500;
      pointer-events: none;
      z-index: 1000;
      text-shadow: 0 2px 10px rgba(212, 175, 55, 0.5);
    `;
    
    wish.animate([
      { opacity: 0, transform: 'translateX(-50%) translateY(20px) scale(0.8)' },
      { opacity: 1, transform: 'translateX(-50%) translateY(0) scale(1)', offset: 0.2 },
      { opacity: 1, transform: 'translateX(-50%) translateY(0) scale(1)', offset: 0.8 },
      { opacity: 0, transform: 'translateX(-50%) translateY(-20px) scale(0.8)' }
    ], {
      duration: 3000,
      easing: 'ease-in-out'
    });
    
    document.body.appendChild(wish);
    
    setTimeout(() => wish.remove(), 3000);
  };

  return (
    <div className="glass-card p-8 mb-8 text-center">
      <div className="mb-4">
        <button
          onClick={celebrate}
          className={`text-6xl transition-all duration-300 hover:scale-110 cursor-pointer ${
            isAnimating ? 'animate-pulse scale-125' : ''
          }`}
          style={{
            filter: 'drop-shadow(0 4px 15px rgba(212, 175, 55, 0.3))',
          }}
        >
          {celebrationIcons[currentIconIndex]}
        </button>
      </div>
      
      <p className="text-white/80 text-lg font-light">
        Click to celebrate and make a wish
      </p>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-yellow-400/60">
        <Sparkles size={16} />
        <span className="text-sm">Every click spreads more joy</span>
        <Sparkles size={16} />
      </div>
    </div>
  );
}