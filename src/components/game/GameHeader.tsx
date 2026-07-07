import React from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStars } from '../../hooks/useStars';

export default function GameHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  const { stars } = useStars();

  return (
    <header className="flex justify-between items-center px-4 py-4 w-full sticky top-0 z-40 bg-surface/90 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/games')}
          aria-label="Back to games"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:scale-105 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-headline font-bold text-primary text-lg leading-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full border border-accent/20">
        <Star className="w-5 h-5 text-accent-warm fill-current" />
        <span className="font-display font-bold text-dark text-lg">{stars}</span>
      </div>
    </header>
  );
}
