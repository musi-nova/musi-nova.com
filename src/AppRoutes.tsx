import { Route, Routes } from "react-router-dom";
import Admin from "@/pages/Admin";
import ForgottenPassword from "@/pages/auth/ForgottenPassword";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import SmartUrlDashboard from "@/pages/dashboard/SmartUrlDashboard";
import Help from "@/pages/Help";
import Index from "@/pages/Index";
import LearnMore from "@/pages/LearnMore";
import NewCampaign from "@/pages/NewCampaign";
import CreateCampaign from "@/pages/CreateCampaign";
import NotFound from "@/pages/NotFound";
import PaymentFailed from "@/pages/PaymentFailed";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PlaylistTips from "@/pages/playlist/PlaylistTips";
import PlaylistChecker from "@/pages/PlaylistChecker";
import Playlists from "@/pages/Playlists";
import Pricing from "@/pages/Pricing";
import Privacy from "@/pages/Privacy";
import Settings from "@/pages/Settings";
import Terms from "@/pages/Terms";
import Feedback from "@/pages/Feedback";
import Submission from "@/pages/Submission";
import PaymentCreditsPage from "@/pages/PaymentCredits";
import AuthGuard from "@/components/AuthGuard";
import TestimonialsPage from "./pages/TestimonialsPage";
import CreditsBanner from '@/components/CreditsBanner';
import Unsubscribe from "./pages/Unsubscribe";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotten-password" element={<ForgottenPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/smart-url" element={<SmartUrl />} /> */}
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/help" element={<Help />} />
        <Route path="/playlist-checker" element={<PlaylistChecker />} />
        <Route path="/playlist-tips" element={<PlaylistTips />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/submissions" element={<Submission />} />
        <Route path="/campaigns/new" element={<CreateCampaign />} />
        <Route path="/campaign/new" element={<CreateCampaign />} />
        {/* legacy/new-style full flow kept for reference */}
        <Route path="/campaigns/new-old" element={<NewCampaign />} />
        <Route path="/payment-credits" element={<PaymentCreditsPage />} />
        {/* <Route path="/submit-to-playlists" element={<SubmissionPromo />} /> */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />

        {/* Protected routes (require AuthGuard) */}
        <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/dashboard/smart-url" element={<AuthGuard><SmartUrlDashboard /></AuthGuard>} />
        <Route path="/playlists" element={<AuthGuard><Playlists /></AuthGuard>} />
        <Route path="/admin" element={<AuthGuard><Admin /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CreditsBanner />
    </>
  );
}
