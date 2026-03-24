import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';

const CLIPS = ['/videos/clip1.mp4', '/videos/clip2.mp4', '/videos/clip3.mp4'];

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentClip, setCurrentClip] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();
  const durations = useRef<number[]>([0, 0, 0]);
  const currentClipRef = useRef(0);

  // Keep ref in sync so callbacks always see latest value
  currentClipRef.current = currentClip;

  const hideControlsDelayed = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const handleTap = () => {
    setShowControls(true);
    if (isPlaying) hideControlsDelayed();
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!hasStarted) setHasStarted(true);
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      hideControlsDelayed();
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Compute elapsed time across all previous clips + current position
  const getElapsedTime = useCallback(() => {
    const video = videoRef.current;
    if (!video) return 0;
    let elapsed = 0;
    for (let i = 0; i < currentClipRef.current; i++) {
      elapsed += durations.current[i] || 0;
    }
    elapsed += video.currentTime || 0;
    return elapsed;
  }, []);

  const getTotalDuration = useCallback(() => {
    return durations.current.reduce((sum, d) => sum + (d || 0), 0);
  }, []);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Preload all clip durations on mount
  useEffect(() => {
    CLIPS.forEach((src, i) => {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = src;
      tempVideo.onloadedmetadata = () => {
        durations.current[i] = tempVideo.duration;
        const total = durations.current.reduce((sum, d) => sum + (d || 0), 0);
        setTotalDuration(total);
      };
    });
  }, []);

  // Time update + ended handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const total = getTotalDuration();
      if (total > 0) {
        setTotalProgress(getElapsedTime() / total);
      }
    };

    const onEnded = () => {
      const clipIdx = currentClipRef.current;
      if (clipIdx < CLIPS.length - 1) {
        // Seamlessly switch to next clip
        const nextIdx = clipIdx + 1;
        setCurrentClip(nextIdx);
        video.src = CLIPS[nextIdx];
        video.load();
        video.play().catch(() => {});
      } else {
        // All clips finished
        setIsPlaying(false);
        setShowControls(true);
        setTotalProgress(1);
      }
    };

    const onLoadedMetadata = () => {
      durations.current[currentClipRef.current] = video.duration;
      const total = durations.current.reduce((sum, d) => sum + (d || 0), 0);
      setTotalDuration(total);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [getElapsedTime, getTotalDuration]);

  // Fullscreen change listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Handle progress bar click/seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = fraction * getTotalDuration();

    // Find which clip and position
    let accumulated = 0;
    for (let i = 0; i < CLIPS.length; i++) {
      const clipDur = durations.current[i] || 0;
      if (accumulated + clipDur > targetTime) {
        const posInClip = targetTime - accumulated;
        if (i !== currentClipRef.current) {
          setCurrentClip(i);
          const video = videoRef.current;
          if (video) {
            video.src = CLIPS[i];
            video.load();
            video.onloadeddata = () => {
              video.currentTime = posInClip;
              if (isPlaying) video.play().catch(() => {});
              video.onloadeddata = null;
            };
          }
        } else {
          if (videoRef.current) videoRef.current.currentTime = posInClip;
        }
        return;
      }
      accumulated += clipDur;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_8px_32px_rgba(0,0,0,0.2)] cursor-pointer select-none"
      onClick={handleTap}
    >
      {/* Single video element — plays all clips sequentially */}
      <video
        ref={videoRef}
        src={CLIPS[0]}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="auto"
        muted
      />

      {/* Initial play overlay */}
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
            Kanda urebe!
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
            className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent"
          >
            {/* Center play/pause (large, tap-friendly) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:scale-90"
              >
                {isPlaying
                  ? <Pause className="w-8 h-8 fill-current" />
                  : <Play className="w-8 h-8 fill-current ml-1" />
                }
              </button>
            </div>

            {/* Bottom controls */}
            <div className="px-4 pb-4 space-y-2">
              {/* Seekable progress bar */}
              <div
                className="w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-accent rounded-full transition-[width] duration-150 group-hover:bg-accent-warm"
                  style={{ width: `${totalProgress * 100}%` }}
                />
              </div>

              {/* Time + fullscreen */}
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-xs font-bold tabular-nums">
                  {formatTime(getElapsedTime())} / {formatTime(totalDuration)}
                </span>
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
