import React from 'react';

interface LogoProps {
  variant?: 'splash' | 'header';
  className?: string;
}

export default function Logo({ variant = 'splash', className = '' }: LogoProps) {
  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <span className="font-display font-bold text-xl text-primary tracking-tight">Kina</span>
        <span className="font-display font-bold text-xl text-accent tracking-tight">Wige</span>
      </div>
    );
  }

  // Splash variant — large centered logo with the book character image
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-56 h-56 rounded-3xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-2">
        <img
          src="/splash-logo.jpeg"
          alt="Kina Wige Logo"
          className="w-full h-full object-contain rounded-2xl"
        />
      </div>
    </div>
  );
}
