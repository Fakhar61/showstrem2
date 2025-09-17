import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useBrandConfig } from "@/hooks/useBrandConfig";
import { useContentData } from "@/hooks/useContentData";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ContentCard } from "@/components/ContentCard";
import CollectorsMerch from "@/components/CollectorsMerch";
import { useEffect, useRef } from "react";

const Home = () => {
  const { config: brandConfig } = useBrandConfig();
  const { contentData, getFeaturedContent, loading, error } = useContentData();
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5; // Background moves at 50% speed of scroll
        parallaxRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!brandConfig || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !contentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">Error loading content</div>
          <div className="text-muted-foreground">{error || 'Content data not available'}</div>
        </div>
      </div>
    );
  }

  const featured = getFeaturedContent();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-24 lg:pt-32">
        {/* Background */}
        <div 
          ref={parallaxRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-entrance will-change-transform"
          style={{ 
            backgroundImage: `url(${brandConfig.hero.backgroundImage})`,
            height: '120%',
            top: '-10%'
          }}
        />
        <div className="absolute inset-0 bg-navy-deep/40" />
        {/* Cinematic gradient overlay for enhanced contrast and mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/30 to-navy-deep/50" />
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-lg space-y-6" style={{ marginTop: '40px' }}>
          {/* Primary Hero Header */}
          <h1 
            className="font-bold uppercase tracking-[0.06em] leading-[1.05] animate-fade-in"
            style={{ 
              fontSize: 'clamp(28px, 6vw, 64px)',
              color: 'hsl(var(--hero-headline-color))',
              fontFamily: 'Arial, sans-serif',
              animationDelay: '0.1s'
            }}
            aria-label="Get closer than front row"
          >
            GET CLOSER THAN FRONT ROW
          </h1>
          
          {/* Sub-headline */}
          <h2 
            className="font-medium italic text-white animate-fade-in"
            style={{ 
              fontSize: 'clamp(18px, 4vw, 32px)',
              fontFamily: 'Arial, sans-serif',
              lineHeight: '1.2',
              animationDelay: '0.2s'
            }}
          >
            Exclusive. Intimate. Unseen.
          </h2>
          
          {/* Supporting copy */}
          <p 
            className="text-white animate-fade-in mx-auto"
            style={{ 
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'normal',
              lineHeight: '1.5',
              maxWidth: '70%',
              opacity: '0.9',
              animationDelay: '0.3s'
            }}
          >
            Unlock unreleased footage, backstage access, stripped-down sessions, and one-off performances — with merch drops, giveaways and priority tickets for subscribers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-lg justify-center items-center mt-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/pricing">
              <Button 
                size="lg" 
                className="text-white px-2xl py-lg text-body font-semibold transition-all duration-300 hover:scale-105 focus:ring-4 min-w-[200px] shadow-lg border-0"
                style={{
                  background: 'var(--gradient-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'hsl(var(--accent-blue))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--gradient-primary)';
                }}
                aria-label={`${brandConfig.hero.ctaText} - Premium access`}
              >
                {brandConfig.hero.ctaText}
              </Button>
            </Link>
            
            <Link to="/library">
              <Button 
                variant="outline" 
                size="lg"
                className="text-white px-2xl py-lg text-body font-semibold transition-all duration-300 hover:scale-105 focus:ring-4 min-w-[200px] shadow-lg bg-transparent"
                style={{
                  borderColor: 'hsl(var(--accent-blue))',
                  borderWidth: '2px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'hsl(var(--accent-blue))';
                  e.currentTarget.style.borderColor = 'hsl(var(--accent-blue))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'hsl(var(--accent-blue))';
                }}
                aria-label={`${brandConfig.hero.secondaryCtaText} - Browse content`}
              >
                {brandConfig.hero.secondaryCtaText}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-2xl bg-surface">
        <div className="container mx-auto px-lg">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="mb-2xl text-center animate-fade-in">
              <h2 className="text-display font-semibold text-foreground mb-md">
                Featured This Week
              </h2>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                Hand-picked exclusive content. New releases and subscriber favorites.
              </p>
            </div>

            {/* Featured Video Player */}
            {featured.series && featured.episode && (
              <div className="mb-xl animate-scale-in">
                <VideoPlayer
                  title={`${featured.series.title}: ${featured.episode.title}`}
                  seriesId={featured.series.id}
                  episodeId={featured.episode.id}
                  isPremium={featured.episode.isPremium}
                />
              </div>
            )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
        {contentData.series.slice(0, 8).map((series, index) => (
          <div 
            key={series.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ContentCard series={series} index={index} />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Collector's Merch Section */}
      <CollectorsMerch />
</div>
);
};

export default Home;