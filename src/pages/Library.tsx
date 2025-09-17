import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useContentData } from "@/hooks/useContentData";
import { ContentCard } from "@/components/ContentCard";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { contentData, getAllEpisodes } = useContentData();

  const categories = ["All", "Series", "Movies", "Documentaries"];
  const allEpisodes = getAllEpisodes();

  const filteredContent = contentData?.series.filter(series => {
    const matchesSearch = series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         series.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
                           (selectedCategory === "Movies" && series.type === "Movie") ||
                           (selectedCategory === "Series" && series.type === "Series") ||
                           (selectedCategory === "Documentaries" && series.type === "Documentary");
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-lg py-xl">
        {/* Header */}
        <div className="mb-2xl animate-fade-in">
          <h1 className="text-display font-semibold text-foreground mb-md">
            Content Library
          </h1>
          <p className="text-body text-muted-foreground">
            Watch the moments only the real fans ever see.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-xl space-y-lg animate-fade-in">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-md top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search titles, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-surface border-border text-foreground placeholder:text-muted-foreground focus:ring-accent focus:border-accent h-12 focus:ring-2"
              aria-label="Search content library"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-xs">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-accent hover:bg-accent-hover text-accent-foreground min-h-[44px] px-lg" 
                  : "border-border hover:bg-surface text-muted-foreground hover:text-foreground min-h-[44px] px-lg"
                }
                aria-pressed={selectedCategory === category}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-lg tv:gap-2xl">
          {filteredContent.map((series, index) => (
            <div 
              key={series.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ContentCard series={series} index={index} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-2xl animate-fade-in">
            <div className="space-y-md">
              <Filter className="w-12 h-12 text-muted-foreground/40 mx-auto" />
              <h3 className="text-title font-medium text-foreground">No content found</h3>
              <p className="text-body text-muted-foreground max-w-sm mx-auto">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="border-border hover:bg-surface text-foreground min-h-[44px] px-lg focus:ring-2 focus:ring-accent"
                aria-label="Clear all filters"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;