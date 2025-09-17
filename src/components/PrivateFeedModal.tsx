import React from 'react';
import { createPortal } from 'react-dom';
import { X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrivateFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  thumbnailImage: string;
  title: string;
}

export const PrivateFeedModal: React.FC<PrivateFeedModalProps> = ({
  isOpen,
  onClose,
  thumbnailImage,
  title
}) => {
  if (!isOpen) return null;

  const handlePlayClick = () => {
    // This would trigger actual video playback
    console.log('Playing Private Feed video');
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-black" onClick={(e) => e.stopPropagation()}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${thumbnailImage})`,
          filter: 'brightness(0.6) blur(0.5px)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
      
      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-white hover:bg-white/20 p-3 min-h-[48px] min-w-[48px] focus:ring-2 focus:ring-white/50"
        aria-label="Close video player"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-lg">
        
        {/* Video Thumbnail Container */}
        <div className="relative max-w-4xl w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          
          {/* Thumbnail Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${thumbnailImage})` }}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button
              onClick={handlePlayClick}
              size="lg"
              className="w-24 h-24 rounded-full bg-white/20 hover:bg-white/30 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
            >
              <Play className="w-10 h-10 fill-current text-white ml-1" />
            </Button>
          </div>

          {/* Video Title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h1 className="text-white text-2xl md:text-3xl font-medium">{title}</h1>
            <p className="text-white/80 text-sm mt-2">
              Exclusive content • Full access available
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center max-w-2xl">
          <p className="text-white/90 text-lg mb-4">
            Experience the raw, unfiltered content that goes beyond the surface.
          </p>
          <p className="text-white/70 text-sm">
            Press ESC to close • Click play to start watching
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};