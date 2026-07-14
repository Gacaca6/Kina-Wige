import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';

interface VideoPlayerProps {
  clips: string[];
  poster?: string;
  onAllClipsEnded?: () => void;
}

export default function VideoPlayer({ clips, poster, onAllClipsEnded }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentClip, setCurrentClip] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();
  const durations = useRef<number[]>(clips.map(() => 0));
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
      video.play().catch(() => {});
      setIsPlaying(true);
      hideControlsDelayed();
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    const doc = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void };

    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      if (doc.exitFullscreen) await doc.exitFullscreen().catch(() => {});
      else doc.webkitExitFullscreen?.();
      return;
    }
    // state syncs via the fullscreenchange listener (never set manually —
    // a blocked request would desync the icon)
    if (container?.requestFullscreen) {
      await container.requestFullscreen().catch(() => {});
    } else if (container?.webkitRequestFullscreen) {
      // older Safari (iPad): prefixed element fullscreen
      container.webkitRequestFullscreen();
    } else if (video?.webkitEnterFullscreen) {
      // iPhone Safari: only the <video> element itself can go fullscreen,
      // and it throws if the video has no data yet
      try {
        if (video.paused) await video.play().catch(() => {});
        video.webkitEnterFullscreen();
      } catch {
        // not ready yet — user can try again once playing
      }
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
    clips.forEach((src, i) => {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = src;
      tempVideo.onloadedmetadata = () => {
        durations.current[i] = tempVideo.duration;
        const total = durations.current.reduce((sum, d) => sum + (d || 0), 0);
        setTotalDuration(total);
      };
    });
  }, [clips]);

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
      if (clipIdx < clips.length - 1) {
        // Seamlessly switch to next clip
        const nextIdx = clipIdx + 1;
        setCurrentClip(nextIdx);
        video.src = clips[nextIdx];
        video.load();
        video.play().catch(() => {});
      } else {
        // All clips finished
        setIsPlaying(false);
        setShowControls(true);
        setTotalProgress(1);
        onAllClipsEnded?.();
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
  }, [clips, getElapsedTime, getTotalDuration, onAllClipsEnded]);

  // Fullscreen change listener (standard + webkit-prefixed for Safari)
  useEffect(() => {
    const doc = document as Document & { webkitFullscreenElement?: Element };
    const handler = () => setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  // Seek to an absolute time across all clips (handles clip switching)
  const seekToTime = (targetTime: number) => {
    const total = getTotalDuration();
    if (total <= 0) return;
    const clamped = Math.max(0, Math.min(targetTime, total - 0.1));

    let accumulated = 0;
    for (let i = 0; i < clips.length; i++) {
      const clipDur = durations.current[i] || 0;
      if (accumulated + clipDur > clamped || i === clips.length - 1) {
        const posInClip = clamped - accumulated;
        if (i !== currentClipRef.current) {
          setCurrentClip(i);
          const video = videoRef.current;
          if (video) {
            video.src = clips[i];
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

  // Skip forward/backward by n seconds
  const skip = (deltaSeconds: number) => {
    seekToTime(getElapsedTime() + deltaSeconds);
    setShowControls(true);
    if (isPlaying) hideControlsDelayed();
  };

  // Handle progress bar click/seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekToTime(fraction * getTotalDuration());
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_8px_32px_rgba(0,0,0,0.2)] cursor-pointer select-none"
      onClick={handleTap}
    >
      {/* Single video element — plays all clips sequentially, with sound */}
      <video
        ref={videoRef}
        src={clips[0]}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="auto"
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
            {/* Center controls: skip back / play-pause / skip forward.
                pointer-events-none on the full-size wrapper so it never
                swallows taps meant for the bottom bar (mute/fullscreen/seek);
                the buttons themselves re-enable pointer events. */}
            <div className="absolute inset-0 flex items-center justify-center gap-8 pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); skip(-10); }}
                aria-label="Back 10 seconds"
                className="pointer-events-auto relative w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:scale-90"
              >
                <RotateCcw className="w-6 h-6" />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-0.5">10</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="pointer-events-auto w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:scale-90"
              >
                {isPlaying
                  ? <Pause className="w-8 h-8 fill-current" />
                  : <Play className="w-8 h-8 fill-current ml-1" />
                }
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); skip(10); }}
                aria-label="Forward 10 seconds"
                className="pointer-events-auto relative w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:scale-90"
              >
                <RotateCw className="w-6 h-6" />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-0.5">10</span>
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

              {/* Time + mute + fullscreen */}
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-xs font-bold tabular-nums">
                  {formatTime(getElapsedTime())} / {formatTime(totalDuration)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="text-white/80 hover:text-white transition-colors p-1"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    className="text-white/80 hover:text-white transition-colors p-1"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
