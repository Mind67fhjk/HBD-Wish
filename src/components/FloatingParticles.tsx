import React, { useEffect, useState } from 'react';

export default function FloatingParticles() {
  const [particleIntensity, setParticleIntensity] = useState(15);

  useEffect(() => {
    // Load particle intensity from theme settings
    const loadThemeSettings = () => {
      const saved = localStorage.getItem('elaja_theme');
      if (saved) {
        const theme = JSON.parse(saved);
        setParticleIntensity(theme.particleIntensity || 15);
      }
    };

    loadThemeSettings();

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      setParticleIntensity(event.detail.particleIntensity || 15);
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const createFloatingStar = () => {
      const star = document.createElement('div');
      star.className = 'floating-star';
      star.textContent = '✦';
      star.style.cssText = `
        position: fixed;
        color: #d4af37;
        font-size: 1rem;
        pointer-events: none;
        z-index: 5;
        opacity: 0.7;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      
      star.animate([
        { opacity: 0.3, transform: 'scale(0.8)' },
        { opacity: 0.8, transform: 'scale(1.2)' },
        { opacity: 0.3, transform: 'scale(0.8)' }
      ], {
        duration: 4000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
      
      document.body.appendChild(star);
      
      setTimeout(() => {
        if (star.parentNode) {
          star.remove();
        }
      }, 8000);
    };

    const createSubtleParticle = () => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: 100%;
        pointer-events: none;
        z-index: 1;
      `;
      
      particle.animate([
        { opacity: 0, transform: 'translateY(0)' },
        { opacity: 1, offset: 0.1 },
        { opacity: 1, offset: 0.9 },
        { opacity: 0, transform: 'translateY(-100vh)' }
      ], {
        duration: 8000,
        easing: 'linear'
      });
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 8000);
    };

    // Create initial stars based on intensity
    for (let i = 0; i < particleIntensity; i++) {
      setTimeout(createFloatingStar, i * 200);
    }

    // Continuous creation based on intensity
    const starInterval = setInterval(createFloatingStar, Math.max(1000, 5000 - (particleIntensity * 100)));
    const particleInterval = setInterval(createSubtleParticle, Math.max(200, 1000 - (particleIntensity * 20)));

    return () => {
      clearInterval(starInterval);
      clearInterval(particleInterval);
    };
  }, [particleIntensity]);

  return null;
}