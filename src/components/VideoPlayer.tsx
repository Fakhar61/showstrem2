import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumOverlay } from './PremiumOverlay';
import { useSubscription } from '@/hooks/useSubscription';

interface VideoPlayerProps {
  videoUrl?: string;
  captionsUrl?: string;
  posterImage?: string;
  title: string;
  seriesId: string;
  episodeId: string;
  isPremium?: boolean;
  isFullPage?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  captionsUrl,
  posterImage,
  title,
  seriesId,
  episodeId,
  isPremium = false,
  isFullPage = false,
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isActive } = useSubscription();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);
  const [hasUnlockedPremium, setHasUnlockedPremium] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const storageKey = `continue-watching-${seriesId}-${episodeId}`;

  // Check if user has access (subscribed or unlocked this specific content)
  useEffect(() => {
    if (isActive) {
      setHasUnlockedPremium(true);
    } else if (isPremium) {
      // For premium content, check local unlock status
      const localUnlock = localStorage.getItem(`premium-unlocked-${seriesId}-${episodeId}`) === 'true';
      setHasUnlockedPremium(localUnlock);
    } else {
      setHasUnlockedPremium(true); // Non-premium content is always accessible
    }
  }, [isActive, isPremium, seriesId, episodeId]);

  // Show premium overlay for premium content after 30 seconds preview
  useEffect(() => {
    if (isPremium && !hasUnlockedPremium && isPlaying) {
      const previewTimeout = setTimeout(() => {
        setIsPlaying(false);
        setShowPremiumOverlay(true);
      }, 30000); // 30 second preview
      
      return () => clearTimeout(previewTimeout);
    }
  }, [isPremium, hasUnlockedPremium, isPlaying]);

  // Load saved progress
  useEffect(() => {
    const savedTime = localStorage.getItem(storageKey);
    if (savedTime && videoRef.current) {
      const time = parseFloat(savedTime);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, [storageKey]);

  // Save progress periodically
  useEffect(() => {
    if (currentTime > 0 && duration > 0) {
      const progress = currentTime / duration;
      // Only save if watched less than 90% to avoid storing completed videos
      if (progress < 0.9) {
        localStorage.setItem(storageKey, currentTime.toString());
      }
      onTimeUpdate?.(currentTime);
    }
  }, [currentTime, duration, storageKey, onTimeUpdate]);

  const togglePlay = useCallback(() => {
    // Don't allow play if premium content and not unlocked
    if (isPremium && !hasUnlockedPremium && currentTime >= 30) {
      setShowPremiumOverlay(true);
      return;
    }
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        setHasStartedPlaying(true);
        videoRef.current.play();
      }
    }
  }, [isPlaying, isPremium, hasUnlockedPremium, currentTime]);

  const handlePremiumUnlock = () => {
    // Store specific episode unlock (fallback for individual content unlocks)
    localStorage.setItem(`premium-unlocked-${seriesId}-${episodeId}`, 'true');
    setHasUnlockedPremium(true);
    setShowPremiumOverlay(false);
  };

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const skipTime = useCallback((seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [currentTime, duration]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'KeyC':
          setShowCaptions(!showCaptions);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, toggleMute, toggleFullscreen, skipTime, showCaptions]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    setShowControls(true);
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  }, [controlsTimeout, isPlaying]);

  // Auto-hide controls - fixed to avoid infinite loop
  useEffect(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    setShowControls(true);
    
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isPlaying]); // Only depend on isPlaying, not the callback

  const handleMouseMove = () => {
    // Clear existing timeout
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    setShowControls(true);
    
    // Set new timeout
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Fallback poster images
  const fallbackPosters = [
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920&h=1080&fit=crop", // Artist under stage lights
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&h=1080&fit=crop", // Studio close-up
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&h=1080&fit=crop"  // Crowd silhouette
  ];

  // Get poster image - use episode poster or fallback
  const getPosterImage = () => {
    if (posterImage) {
      return posterImage;
    }
    // Use a deterministic fallback based on episode ID
    const fallbackIndex = (episodeId?.length || 0) % fallbackPosters.length;
    return fallbackPosters[fallbackIndex];
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full bg-black group overflow-hidden",
        isFullPage ? "h-screen" : "aspect-video"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      {hasStartedPlaying ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onVolumeChange={(e) => {
            setVolume(e.currentTarget.volume);
            setIsMuted(e.currentTarget.muted);
          }}
          crossOrigin="anonymous"
        >
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
          {captionsUrl && showCaptions && (
            <track
              kind="captions"
              src={captionsUrl}
              srcLang="en"
              label="English"
              default
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-surface/20">
            <div className="text-muted-foreground text-center space-y-md">
              <Play className="w-16 h-16 mx-auto opacity-50" />
              <p className="text-body">Video content would load here</p>
              <p className="text-caption">Press Space to play/pause • F for fullscreen • C for captions</p>
            </div>
          </div>
        </video>
      ) : (
        /* Poster Image */
        <div className="relative w-full h-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${getPosterImage()})`,
              filter: 'brightness(0.8)'
            }}
          />
          {/* Gradient overlay for cinematic look */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-all duration-500",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              size="lg"
              className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 border border-white/20 backdrop-blur-sm"
            >
              <Play className="w-8 h-8 fill-current text-white ml-1" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-lg space-y-md">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer group/progress"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-accent rounded-full relative group-hover/progress:bg-accent-hover transition-colors"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20 p-sm min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-white/50"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => skipTime(-10)}
                className="text-white hover:bg-white/20 p-sm min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-white/50"
                aria-label="Skip back 10 seconds"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => skipTime(10)}
                className="text-white hover:bg-white/20 p-sm min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-white/50"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20 p-sm min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-white/50"
                aria-label={isMuted || volume === 0 ? 'Unmute video' : 'Mute video'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>

              <div className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCaptions(!showCaptions)}
                className={cn(
                  "text-white hover:bg-white/20 p-sm text-xs font-medium min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-white/50",
                  showCaptions && "bg-white/20"
                )}
                aria-label={showCaptions ? 'Hide captions' : 'Show captions'}
                aria-pressed={showCaptions}
              >
                CC
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-sm min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-white/50"
                aria-label="Video settings"
              >
                <Settings className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 p-sm min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-white/50"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      {showControls && (
        <div className="absolute top-lg left-lg right-lg">
          <h1 className="text-white text-title font-medium">{title}</h1>
        </div>
      )}

      {/* Premium Overlay */}
      {showPremiumOverlay && (
        <PremiumOverlay onUnlock={handlePremiumUnlock} />
      )}
    </div>
  );
};