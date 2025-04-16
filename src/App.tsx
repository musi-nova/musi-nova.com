
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import AuthGuard from "@/components/AuthGuard";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PlaylistChecker from "./pages/PlaylistChecker";
import NewCampaign from "./pages/NewCampaign";
import NotFound from "./pages/NotFound";
import SmartUrl from "./pages/SmartUrl";
import Blog from "./pages/Blog";
import Help from "./pages/Help";
import PlaylistCreator from "./pages/playlist/PlaylistCreator";
import PlaylistTips from "./pages/playlist/PlaylistTips";
import Settings from "./pages/Settings";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TryForFree from "./pages/auth/TryForFree";
import Playlists from "./pages/Playlists";
import SmartUrlDashboard from "./pages/dashboard/SmartUrlDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/try-for-free" element={<TryForFree />} /> */}
            
            {/* Public informational page */}
            {/* <Route path="/smart-url" element={<SmartUrl />} /> */}
            {/* <Route path="/blog" element={<Blog />} /> */}
            {/* <Route path="/help" element={<Help />} /> */}
            <Route path="/playlist-checker" element={<PlaylistChecker />} />
            {/* <Route path="/playlist-creator" element={<PlaylistCreator />} /> */}
            <Route path="/playlist-tips" element={<PlaylistTips />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/playlists" element={<AuthGuard><Playlists /></AuthGuard>} />
            {/* <Route path="/campaigns/new" element={<AuthGuard><NewCampaign /></AuthGuard>} /> */}
            {/* <Route path="/dashboard/smart-url" element={<AuthGuard><SmartUrlDashboard /></AuthGuard>} /> */}
            {/* <Route path="/smart-url/create" element={<AuthGuard><SmartUrl /></AuthGuard>} /> */}
            {/* <Route path="/smart-url/list" element={<AuthGuard><SmartUrl /></AuthGuard>} /> */}
            {/* <Route path="/smart-url/analytics" element={<AuthGuard><SmartUrl /></AuthGuard>} /> */}
            {/* <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} /> */}
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
