import { useState, useEffect } from 'react';

export interface Episode {
  id: string;
  title: string;
  synopsis: string;
  duration: number; // in seconds
  thumbnail: string;
  captionsUrl: string;
  videoUrl: string;
  backdropImage?: string;
  posterImage?: string;
  isPremium: boolean;
}

export interface Series {
  id: string;
  title: string;
  synopsis: string;
  year: string;
  genre: string;
  type: 'Series' | 'Movie' | 'Documentary';
  thumbnail: string;
  isPremium: boolean;
  episodes: Episode[];
}

export interface ContentData {
  series: Series[];
  featured: {
    seriesId: string;
    episodeId: string;
  };
}

export const useContentData = () => {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/data/content-data.json');
        if (!response.ok) {
          throw new Error('Failed to load content data');
        }
        const data = await response.json();
        setContentData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading content data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const getSeriesById = (id: string): Series | undefined => {
    return contentData?.series.find(series => series.id === id);
  };

  const getEpisodeById = (seriesId: string, episodeId: string): Episode | undefined => {
    const series = getSeriesById(seriesId);
    return series?.episodes.find(episode => episode.id === episodeId);
  };

  const getFeaturedContent = () => {
    if (!contentData?.featured) return null;
    
    const series = getSeriesById(contentData.featured.seriesId);
    const episode = getEpisodeById(contentData.featured.seriesId, contentData.featured.episodeId);
    
    return { series, episode };
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getAllEpisodes = (): Episode[] => {
    if (!contentData) return [];
    
    return contentData.series.flatMap(series => 
      series.episodes.map(episode => ({
        ...episode,
        seriesTitle: series.title,
        seriesId: series.id,
        type: series.type,
        genre: series.genre,
        year: series.year
      }))
    );
  };

  return { 
    contentData, 
    loading, 
    error, 
    getSeriesById, 
    getEpisodeById, 
    getFeaturedContent,
    formatDuration,
    getAllEpisodes
  };
};