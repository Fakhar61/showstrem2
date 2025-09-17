import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto py-lg">
      <div className="container mx-auto px-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-md">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="text-xs text-muted-foreground">
              © 2024 Your Streaming Platform. All rights reserved.
            </p>
          </div>

          {/* Login Links */}
          <div className="flex items-center gap-lg">
            <Link 
              to="/" 
              className="text-xs text-muted-foreground hover:text-accent transition-smooth"
            >
              Home
            </Link>
            <Link 
              to="/artist" 
              className="text-xs text-muted-foreground hover:text-accent transition-smooth"
            >
              Artist Login
            </Link>
            <Link 
              to="/admin/cms" 
              className="text-xs text-muted-foreground hover:text-accent transition-smooth"
            >
              Admin Login
            </Link>
            <Link 
              to="/partner" 
              className="text-xs text-muted-foreground hover:text-accent transition-smooth"
            >
              Partner Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;