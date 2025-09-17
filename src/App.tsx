import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Watch from "./pages/Watch";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import DebugTypography from "./pages/DebugTypography";
import Admin from "./pages/Admin";
import AdminCMS from "./pages/AdminCMS";
import Partner from "./pages/Partner";
import PartnerInsights from "./pages/PartnerInsights";
import PartnerStudio from "./pages/PartnerStudio";
import { PasswordGate } from "./components/PasswordGate";
import { PartnerAuthProvider } from "./contexts/PartnerAuthContext";
import { ContentProvider } from "./contexts/ContentContext";
import ArtistDashboard from "./pages/ArtistDashboard";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <PartnerAuthProvider>
          <ContentProvider>
            <Routes>
              {/* Partner routes (no password gate, no navigation) */}
              <Route path="/partner" element={<Partner />}>
                <Route index element={<PartnerInsights />} />
                <Route path="insights" element={<PartnerInsights />} />
                <Route path="studio" element={<PartnerStudio />} />
              </Route>
              
              {/* Artist routes (no password gate) */}
              <Route path="/artist" element={<ArtistDashboard />} />
              <Route path="/artist/login" element={<ArtistDashboard />} />
              <Route path="/artist-login" element={<ArtistDashboard />} />
              
              {/* Admin routes (no password gate) */}
              <Route path="/admin" element={<AdminCMS />} />
              <Route path="/admin/cms" element={<AdminCMS />} />
              
              {/* Main app routes */}
              <Route path="/*" element={
                <PasswordGate>
                  <div className="min-h-screen bg-background flex flex-col">
                    <Navigation />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/watch/*" element={<Pricing />} />
                        <Route path="/debug/typography" element={<DebugTypography />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </PasswordGate>
              } />
            </Routes>
          </ContentProvider>
        </PartnerAuthProvider>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
