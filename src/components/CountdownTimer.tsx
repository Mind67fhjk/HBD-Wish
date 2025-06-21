import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
        setIsComplete(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsComplete(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="mb-12">
      <div className="flex justify-center gap-8 mb-4 flex-wrap">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center min-w-[100px] shadow-lg hover:bg-white/15 transition-all duration-300"
          >
            <div className="text-3xl font-bold text-yellow-400 font-mono">
              {value.toString().padStart(2, '0')}
            </div>
            <div className="text-white/80 text-sm uppercase tracking-wider mt-2">
              {unit}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-white/90 text-lg italic text-center">
        {isComplete ? (
          <>
            🎉 <span className="font-semibold text-yellow-400">Happy Birthday ElaJa!</span> 🎉
          </>
        ) : (
          'Until ElaJa\'s special celebration begins!'
        )}
      </p>
    </div>
  );
}