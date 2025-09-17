import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ContentItem {
  id: string;
  title: string;
  series: string;
  contentType: string;
  durationSec: number;
  releaseDate: string;
  posterImage: string;
  backdropImage: string;
  isPremium: boolean;
  isPublished?: boolean;
  description?: string;
  year?: number;
  videoUrl?: string;
  order?: number;
}

interface ContentContextType {
  contentItems: ContentItem[];
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  addContentItem: (item: ContentItem) => void;
  deleteContentItem: (id: string) => void;
  reorderContent: (startIndex: number, endIndex: number) => void;
  getPublishedContent: () => ContentItem[];
  getStats: () => {
    total: number;
    published: number;
    drafts: number;
    innerCircle: number;
  };
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Load initial content from catalog.json
    fetch('/data/catalog.json')
      .then(res => res.json())
      .then(data => {
        const items = data.content.map((item: any, index: number) => ({
          ...item,
          isPublished: true,
          description: `Experience the exclusive ${item.title} content.`,
          year: new Date(item.releaseDate).getFullYear(),
          videoUrl: '',
          order: index
        }));
        setContentItems(items);
      })
      .catch(console.error);
  }, []);

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const addContentItem = (item: ContentItem) => {
    const newItem = {
      ...item,
      order: contentItems.length
    };
    setContentItems(prev => [...prev, newItem]);
  };

  const deleteContentItem = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
  };

  const reorderContent = (startIndex: number, endIndex: number) => {
    setContentItems(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update order values
      return result.map((item, index) => ({
        ...item,
        order: index
      }));
    });
  };

  const getPublishedContent = () => {
    return contentItems
      .filter(item => item.isPublished)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const getStats = () => {
    const total = contentItems.length;
    const published = contentItems.filter(item => item.isPublished).length;
    const drafts = total - published;
    const innerCircle = contentItems.filter(item => item.isPremium).length;
    
    return { total, published, drafts, innerCircle };
  };

  return (
    <ContentContext.Provider value={{
      contentItems,
      updateContentItem,
      addContentItem,
      deleteContentItem,
      reorderContent,
      getPublishedContent,
      getStats
    }}>
      {children}
    </ContentContext.Provider>
  );
};