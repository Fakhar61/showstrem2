import { Link } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { LazyImage } from "@/components/LazyImage";

interface MerchItem {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  isRevealed: boolean;
}

const merchItems: MerchItem[] = [
  {
    id: "light-skin-noise",
    title: "Light // Skin // Noise",
    subtitle: "Limited edition hardcover. 112 pages.",
    image: "/images/book-thumbnail.png",
    isRevealed: true,
  },
  {
    id: "unreadable",
    title: "Unreadable",
    subtitle: "Minimalist black tee. One drop only.",
    image: "/images/merch-thumbnail.png",
    isRevealed: true,
  },
  {
    id: "subscriber-gift",
    title: "Subscriber Gift Item",
    subtitle: "Revealed only to subscribers.",
    isRevealed: false,
  },
];

const CollectorsMerch = () => {
  const { isActive: isSubscribed } = useSubscription();

  const handleItemClick = (item: MerchItem) => {
    if (!isSubscribed) {
      // Will be handled by Link component redirect
      return;
    }
    
    // For subscribed users, open product detail view
    console.log("Opening product detail for:", item.title);
  };

  return (
    <section className="py-2xl bg-background border-t border-border/50">
      <div className="container mx-auto px-lg">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="mb-2xl text-center animate-fade-in">
            <h2 className="text-display font-semibold text-foreground mb-md" style={{ fontFamily: 'serif' }}>
              Collector's Merch
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'sans-serif', fontWeight: '300' }}>
              Exclusive items available only to subscribers. Limited quantities, unlimited stories.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {merchItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {isSubscribed ? (
                  <div
                    className="cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => handleItemClick(item)}
                  >
                    <ProductCard item={item} isSubscribed={isSubscribed} />
                  </div>
                ) : (
                  <Link to="/pricing" className="block transition-all duration-300 hover:scale-[1.02]">
                    <ProductCard item={item} isSubscribed={isSubscribed} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface ProductCardProps {
  item: MerchItem;
  isSubscribed: boolean;
}

const ProductCard = ({ item, isSubscribed }: ProductCardProps) => {
  const showImage = item.isRevealed || isSubscribed;
  
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-accent/30">
      
      {/* Product Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted/20">
        {showImage && item.image ? (
          <LazyImage
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
            <div className="text-center p-md">
              <div className="w-12 h-12 mx-auto mb-sm rounded bg-muted/40 flex items-center justify-center">
                <div className="w-6 h-6 rounded bg-muted/60" />
              </div>
              <p className="text-xs text-muted-foreground">
                {isSubscribed ? "Exclusive Item" : "Subscribe to View"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-lg space-y-sm">
        <h3 
          className="text-xl font-medium text-foreground leading-tight"
          style={{ fontFamily: 'serif' }}
        >
          {item.title}
        </h3>
        
        <p 
          className="text-sm text-muted-foreground leading-relaxed"
          style={{ fontFamily: 'sans-serif', fontWeight: '300' }}
        >
          {item.subtitle}
        </p>
        
        {/* Action Indicator */}
        {isSubscribed ? (
          <div className="pt-sm">
            <span className="text-xs text-accent font-medium">
              View Details
            </span>
          </div>
        ) : (
          <div className="pt-sm">
            <span className="text-xs text-muted-foreground font-medium">
              Subscribe to Access
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorsMerch;