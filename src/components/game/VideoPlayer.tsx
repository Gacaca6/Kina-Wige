import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';

const CLIPS = ['/videos/clip1.mp4', '/videos/clip2.mp4', '/videos/clip3.mp4'];
const CROSSFADE_MS = 800;

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentClip, setCurrentClip] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();
  const durations = useRef<number[]>([0, 0, 0]);

  const hideControlsDelayed = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    if (isPlaying) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  const handleTap = () => {
    setShowControls(true);
    hideControlsDelayed();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (!hasStarted) setHasStarted(true);
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      hideControlsDelayed();
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const transitionToNext = useCallback(() => {
    if (currentClip >= CLIPS.length - 1) {
      setIsPlaying(false);
      setShowControls(true);
      return;
    }

    setIsFading(true);

    // Preload next video
    if (nextVideoRef.current) {
      nextVideoRef.current.src = CLIPS[currentClip + 1];
      nextVideoRef.current.load();
      nextVideoRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      setCurrentClip(prev => prev + 1);
      setIsFading(false);
    }, CROSSFADE_MS);
  }, [currentClip]);

  const skipToNext = () => {
    if (currentClip < CLIPS.length - 1) {
      transitionToNext();
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Time update handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration);
        // Calculate total progress across all clips
        const clipWeight = 1 / CLIPS.length;
        const total = (currentClip * clipWeight) + (video.currentTime / video.duration) * clipWeight;
        setTotalProgress(total);
      }
    };

    const onEnded = () => transitionToNext();

    const onLoadedMetadata = () => {
      durations.current[currentClip] = video.duration;
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [currentClip, transitionToNext]);

  // Auto-play next clip after transition
  useEffect(() => {
    if (videoRef.current && hasStarted) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      hideControlsDelayed();
    }
  }, [currentClip]);

  // Fullscreen change listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border-4 border-surface-container-lowest cursor-pointer select-none"
      onClick={handleTap}
    >
      {/* Current video */}
      <video
        ref={videoRef}
        src={CLIPS[currentClip]}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[800ms] ${isFading ? 'opacity-0' : 'opacity-100'}`}
        playsInline
        preload="auto"
        muted={isMuted}
      />

      {/* Next video (for crossfade) */}
      <video
        ref={nextVideoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[800ms] ${isFading ? 'opacity-100' : 'opacity-0'}`}
        playsInline
        muted={isMuted}
      />

      {/* Play button overlay (before started) */}
      {!hasStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]"
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(15,82,56,0.5)]"
          >
            <Play className="w-10 h-10 fill-current ml-1" />
          </motion.button>
          <p className="mt-4 font-headline font-bold text-white text-lg drop-shadow-lg">
            Kanda urebe! (Tap to watch!)
          </p>
        </motion.div>
      )}

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && hasStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-black/30"
          >
            {/* Top bar */}
            <div className="flex justify-between items-center px-4 pt-3">
              <div className="flex items-center gap-2">
                {CLIPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentClip ? 'w-8 bg-white' : i < currentClip ? 'w-4 bg-white/80' : 'w-4 bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/80 text-xs font-bold bg-black/30 px-2 py-1 rounded-full">
                {currentClip + 1}/{CLIPS.length}
              </span>
            </div>

            {/* Center play/pause */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:scale-90"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              {currentClip < CLIPS.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); skipToNext(); }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:scale-90"
                >
                  <SkipForward className="w-6 h-6 fill-current" />
                </button>
              )}
            </div>

            {/* Bottom bar */}
            <div className="px-4 pb-3 space-y-2">
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-200"
                  style={{ width: `${totalProgress * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
