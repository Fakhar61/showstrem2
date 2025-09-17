import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Heart, Crown } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useContentData } from "@/hooks/useContentData";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PremiumOverlay } from "@/components/PremiumOverlay";
import { LazyImage } from "@/components/LazyImage";
import { useState, useEffect } from "react";
import { useSubscription, setLastViewedContent } from "@/hooks/useSubscription";

const Watch = () => {
  const { seriesId, episodeId } = useParams();
  const navigate = useNavigate();
  const { getSeriesById, getEpisodeById, formatDuration } = useContentData();
  const { isActive, subscription, loading } = useSubscription();
  const [hasAccess, setHasAccess] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const series = seriesId ? getSeriesById(seriesId) : null;
  const episode = seriesId && episodeId ? getEpisodeById(seriesId, episodeId) : null;

  // Check if content requires premium access - "Rehearsals & Riffs" and "Private Feed" are always free
  const isFreeContent = series?.title === "Rehearsals & Riffs" || series?.id === "private-feed";
  const needsPremium = !isFreeContent && (episode?.isPremium || series?.isPremium);
  const shouldShowPaywall = needsPremium && !hasAccess && !isActive;

  // Initialize access state and listen for subscription changes
  useEffect(() => {
    console.log('Watch page - Subscription state changed:', { isActive, subscription, needsPremium });
    if (isActive) {
      setHasAccess(true);
      setShowPaywall(false);
    } else {
      setHasAccess(false);
    }
  }, [isActive]); // Simplified dependency

  // Redirect to pricing if premium content and not subscribed
  useEffect(() => {
    console.log('Watch page - Checking redirect:', { needsPremium, isActive, loading });
    
    // Don't redirect while still loading subscription state
    if (loading) {
      console.log('Still loading subscription, waiting...');
      return;
    }
    
    // If user has active subscription, never redirect
    if (isActive) {
      console.log('User has active subscription, staying on watch page');
      return;
    }
    
    // Only redirect for premium content when definitely not subscribed
    if (needsPremium && !isActive) {
      console.log('Redirecting to pricing - Premium content, no subscription');
      navigate('/pricing');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [needsPremium, isActive, loading, navigate]);

  // Set last viewed content when episode changes
  useEffect(() => {
    if (seriesId && episodeId) {
      setLastViewedContent(seriesId, episodeId);
    }
  }, [seriesId, episodeId]);

  const handleUnlock = () => {
    setHasAccess(true);
    setShowPaywall(false);
  };

  // Fallback backdrop images
  const fallbackBackdrops = [
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&h=1080&fit=crop", // Crowd silhouette
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&h=1080&fit=crop", // Studio close-up
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920&h=1080&fit=crop"  // Artist under stage lights
  ];

  // Get backdrop image - use episode backdrop or fallback
  const getBackdropImage = () => {
    if (episode?.backdropImage) {
      return episode.backdropImage;
    }
    // Use a deterministic fallback based on episode ID
    const fallbackIndex = episode?.id?.length ? episode.id.length % fallbackBackdrops.length : 0;
    return fallbackBackdrops[fallbackIndex];
  };

  if (!series || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-md">
          <h1 className="text-display font-semibold text-foreground">Content Not Found</h1>
          <p className="text-body text-muted-foreground">The requested content could not be loaded.</p>
          <Link to="/library">
            <Button variant="outline">Browse Library</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if this is "Rehearsals & Riffs" or "Private Feed" for full-page video player
  const isFullPageVideo = series.title === "Rehearsals & Riffs" || series.id === "rehearsals-riffs" || 
                          seriesId === "rehearsals-riffs" || series.id === "private-feed" || seriesId === "private-feed";

  // Full-page video player for "Rehearsals & Riffs" and "Private Feed"
  if (isFullPageVideo) {
    return (
      <div className="min-h-screen bg-black relative">
        <VideoPlayer
          videoUrl={episode.videoUrl}
          captionsUrl={episode.captionsUrl}
          posterImage={series.thumbnail} // Use series thumbnail as poster
          title={episode.title}
          seriesId={series.id}
          episodeId={episode.id}
          isPremium={episode.isPremium}
          isFullPage={true}
        />
        
        {/* Back Button */}
        <Link 
          to="/library" 
          className="absolute top-4 left-4 z-50"
        >
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Backdrop Image */}
      <div 
        className="fixed inset-0 w-full h-full -z-10"
        aria-hidden="true"
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getBackdropImage()})`,
            filter: 'blur(15px) brightness(0.6)',
            transform: 'scale(1.1)', // Prevent blur edge artifacts
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Video Player Area */}
      <div className="relative">
        <VideoPlayer
          videoUrl={episode.videoUrl}
          captionsUrl={episode.captionsUrl}
          posterImage={episode.posterImage}
          title={episode.title}
          seriesId={series.id}
          episodeId={episode.id}
          isPremium={episode.isPremium}
        />
        
        {/* Back Button */}
        <Link 
          to="/library" 
          className="absolute top-md left-md z-20"
        >
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Episode Details */}
      <div className="container mx-auto px-lg py-2xl max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2xl">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-xl">
            <div className="space-y-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-md">
                  <div className="flex items-center gap-md">
                    <h1 className="text-display font-semibold text-foreground">{episode.title}</h1>
                    {episode.isPremium && (
                      <div className="flex items-center gap-xs bg-accent/10 text-accent px-sm py-xs rounded-md">
                        <Crown className="w-4 h-4" />
                        <span className="text-caption font-medium">Premium</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-md text-muted-foreground text-body">
                    <span>{series.year}</span>
                    <span>•</span>
                    <span>{series.genre}</span>
                    <span>•</span>
                    <span>{formatDuration(episode.duration)}</span>
                    <span>•</span>
                    <span>{series.type}</span>
                  </div>
                </div>
              </div>

              <p className="text-body text-muted-foreground leading-relaxed">
                {episode.synopsis}
              </p>

              <div className="flex items-center gap-md">
                <Button variant="outline" size="sm" className="border-border hover:bg-surface text-foreground">
                  <Heart className="w-4 h-4" />
                  Add to Watchlist
                </Button>
                <Button variant="outline" size="sm" className="border-border hover:bg-surface text-foreground">
                  <Info className="w-4 h-4" />
                  More Info
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-xl">
            {/* Series Info */}
            <div className="space-y-md">
              <h3 className="text-title font-medium text-foreground">About This Series</h3>
              <div className="space-y-sm">
                <p className="text-body text-muted-foreground">{series.synopsis}</p>
                <div className="pt-md">
                  <Link to="/library">
                    <Button variant="outline" size="sm" className="border-border hover:bg-surface text-foreground">
                      View All Episodes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* More Episodes */}
            {series.episodes.length > 1 && (
              <div className="space-y-md">
                <h3 className="text-title font-medium text-foreground">More Episodes</h3>
                <div className="space-y-sm">
                  {series.episodes.filter(ep => ep.id !== episode.id).slice(0, 3).map((ep) => (
                    <Link 
                      key={ep.id} 
                      to={`/watch/${series.id}/${ep.id}`}
                      className="block group"
                    >
                      <div className="flex gap-md p-md rounded-lg hover:bg-surface transition-smooth">
                         <div className="relative w-20 h-12 bg-surface rounded overflow-hidden flex-shrink-0">
                          <LazyImage 
                            src={ep.thumbnail} 
                            alt={ep.title}
                            className="w-full h-full object-cover"
                          />
                          {ep.isPremium && (
                            <Crown className="absolute top-1 right-1 w-3 h-3 text-accent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-body font-medium text-foreground group-hover:text-accent transition-smooth truncate">
                            {ep.title}
                          </h4>
                          <p className="text-caption text-muted-foreground">
                            {formatDuration(ep.duration)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Paywall */}
      {showPaywall && (
        <PremiumOverlay onUnlock={handleUnlock} />
      )}
    </div>
  );
};

export default Watch;