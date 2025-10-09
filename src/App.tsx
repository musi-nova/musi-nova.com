import AuthGuard from "@/components/AuthGuard";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Admin from "./pages/Admin";
import ForgottenPassword from "./pages/auth/ForgottenPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SmartUrlDashboard from "./pages/dashboard/SmartUrlDashboard";
import Help from "./pages/Help";
import Index from "./pages/Index";
import NewCampaign from "./pages/NewCampaign";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentSuccess from "./pages/PaymentSuccess";
import PlaylistTips from "./pages/playlist/PlaylistTips";
import PlaylistChecker from "./pages/PlaylistChecker";
import Playlists from "./pages/Playlists";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Settings from "./pages/Settings";
import SmartUrl from "./pages/SmartUrl";
import Terms from "./pages/Terms";
import Feedback from "./pages/Feedback";
import Submission from "./pages/Submission";
import PaymentCreditsPage from "./pages/PaymentCredits";
import SubmissionPromo from "./pages/SubmissionPromo";

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
            <Route path="/forgotten-password" element={<ForgottenPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />

            {/* Public informational page */}
            <Route path="/smart-url" element={<SmartUrl />} />
            {/* <Route path="/blog" element={<Blog />} /> */}
            <Route path="/help" element={<Help />} />
            <Route path="/playlist-checker" element={<PlaylistChecker />} />
            {/* <Route path="/playlist-creator" element={<PlaylistCreator />} /> */}
            <Route path="/playlist-tips" element={<PlaylistTips />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/feedback" element={<Feedback />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/dashboard/smart-url"
              element={
                <AuthGuard>
                  <SmartUrlDashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/playlists"
              element={
                <AuthGuard>
                  <Playlists />
                </AuthGuard>
              }
            />
            <Route
              path="/submissions"
              element={
                <AuthGuard>
                  <Submission />
                </AuthGuard>
              }
            />
            <Route
              path="/campaigns/new"
              element={
                <AuthGuard>
                  <NewCampaign />
                </AuthGuard>
              }
            />
            <Route
              path="/payment"
              element={
                // <AuthGuard>
                <Payment />
                // </AuthGuard>
              }
            />
            <Route path="/payment-credits" element={<PaymentCreditsPage />} />
            <Route path="/submit-to-playlists" element={<SubmissionPromo />} />
            <Route
              path="/payment-success"
              element={
                <PaymentSuccess />
              }
            />
            <Route
              path="/payment-failed"
              element={
                <PaymentFailed />
              }
            />
            <Route
              path="/admin"
              element={
                <AuthGuard>
                  <Admin />
                </AuthGuard>
              }
            />

            <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
