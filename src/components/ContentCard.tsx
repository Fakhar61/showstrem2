import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Lock, Clock } from 'lucide-react';
import { Series } from '@/hooks/useContentData';
import { useContentData } from '@/hooks/useContentData';
import { LazyImage } from '@/components/LazyImage';
import { useContent } from '@/contexts/ContentContext';
import { useSubscription } from '@/hooks/useSubscription';
import { PrivateFeedModal } from '@/components/PrivateFeedModal';

interface ContentCardProps {
  series: Series;
  index?: number;
}

function redirectToSubscribe() {
  window.location.href = "/pricing"; // Change this to your pricing or sign-up route
}

export const ContentCard: React.FC<ContentCardProps> = ({ series, index = 0 }) => {
  const { formatDuration } = useContentData();
  const { getPublishedContent } = useContent();
  const { isActive, subscription } = useSubscription();
  const navigate = useNavigate();
  const [showPrivateFeedModal, setShowPrivateFeedModal] = useState(false);
  const firstEpisode = series.episodes[0];
  const yearRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (yearRef.current) {
      yearRef.current.textContent = index % 2 === 0 ? '2024' : '2025';
    }
  }, [index]);

  // Handle ESC key for modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showPrivateFeedModal) {
        setShowPrivateFeedModal(false);
      }
    };

    if (showPrivateFeedModal) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showPrivateFeedModal]);

  if (!firstEpisode) return null;

  // Check if this content is published in CMS
  const publishedContent = getPublishedContent();
  const isPublished = publishedContent.some(item => 
    item.title === series.title || item.series === series.title
  );

  // Don't render if not published
  if (!isPublished) {
    return null;
  }

  // Special logic: 7th position (index 6) is always free "Rehearsals & Riffs", 
  // and "Private Feed" also gets direct access - all others are premium
  const isSeventhPosition = index === 6;
  const isPrivateFeed = series.id === 'private-feed';
  const isFreeContent = isSeventhPosition || isPrivateFeed;
  const isPremiumContent = !isFreeContent;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log('ContentCard clicked - Position check:', { 
      index, 
      isSeventhPosition,
      isPrivateFeed,
      isPremiumContent, 
      seriesTitle: series.title 
    });
    
    // Handle Private Feed special case - show full page video modal
    if (isPrivateFeed) {
      console.log('Private Feed clicked - Opening full page video modal');
      setShowPrivateFeedModal(true);
      return;
    }
    
    // 7th position (index 6) goes to video player, no subscription check
    if (isSeventhPosition) {
      console.log('Free content - Navigating to video player');
      navigate(`/watch/${series.id}/${firstEpisode.id}`);
    } else {
      // All other positions redirect to pricing page
      console.log('Redirecting to pricing - premium content');
      navigate('/pricing');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group block transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded-lg cursor-pointer"
      aria-label={isPremiumContent 
        ? `Subscribe to watch ${series.title} - ${firstEpisode.title}` 
        : `Watch ${series.title} - ${firstEpisode.title}`
      }
    >
      <div className="bg-card rounded-lg overflow-hidden border border-border group-hover:border-accent/50 transition-all duration-300">
        
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <LazyImage
            src={series.thumbnail}
            alt={`${series.title} thumbnail`}
            className="w-full h-full transition-all duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 group-hover:scale-110 transition-all duration-300">
              <div className="text-white text-sm font-semibold flex items-center gap-2">
                {isPremiumContent ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Subscribe to watch
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Watch now
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Premium Badge - Show for all premium content */}
          {isPremiumContent && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
              Premium
            </div>
          )}

          {/* Duration */}
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(firstEpisode.duration)}
          </div>
        </div>

        {/* Content Info */}
        <div className="p-md space-y-sm">
          <h3 className="text-body font-semibold text-card-foreground group-hover:text-accent transition-colors line-clamp-2">
            {series.title}
          </h3>
          
          <p className="text-caption text-muted-foreground line-clamp-2 leading-relaxed">
            {firstEpisode.synopsis}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="bg-surface px-2 py-1 rounded">{series.genre}</span>
            <span ref={yearRef} className="year">{series.year}</span>
          </div>

          {series.episodes.length > 1 && (
            <div className="text-xs text-muted-foreground pt-1">
              {series.episodes.length} episodes
            </div>
          )}
        </div>
      </div>

      {/* Private Feed Modal */}
      <PrivateFeedModal
        isOpen={showPrivateFeedModal}
        onClose={() => setShowPrivateFeedModal(false)}
        thumbnailImage={series.thumbnail}
        title={series.title}
      />
    </div>
  );
};