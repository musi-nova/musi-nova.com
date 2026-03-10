import { Route, Routes } from "react-router-dom";
import ForgottenPassword from "@/pages/auth/ForgottenPassword";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import SmartUrlDashboard from "@/pages/dashboard/SmartUrlDashboard";
import Help from "@/pages/Help";
import Index from "@/pages/Index";
import CreateCampaign from "@/pages/CreateCampaign";
import NotFound from "@/pages/NotFound";
import PaymentFailed from "@/pages/PaymentFailed";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Playlists from "@/pages/Playlists";
import Pricing from "@/pages/Pricing";
import Privacy from "@/pages/Privacy";
import Settings from "@/pages/Settings";
import Terms from "@/pages/Terms";
import PaymentCreditsPage from "@/pages/PaymentCredits";
import AuthGuard from "@/components/AuthGuard";
import TestimonialsPage from "./pages/TestimonialsPage";
import CreditsBanner from '@/components/CreditsBanner';
import Unsubscribe from "./pages/Unsubscribe";
// import Blog from "./pages/Blog";
import Faqs from "./pages/Faqs";

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
        {/* <Route path="/blog" element={<Blog />} /> */}
        <Route path="/help" element={<Help />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* <Route path="/feedback" element={<Feedback />} /> */}
        <Route path="/campaigns/new" element={<CreateCampaign />} />
        <Route path="/payment-credits" element={<PaymentCreditsPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        
        {/* faqs routes */}
        <Route path="/faqs" element={<Faqs />} />

        {/* Protected routes (require AuthGuard) */}
        <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/dashboard/smart-url" element={<AuthGuard><SmartUrlDashboard /></AuthGuard>} />
        <Route path="/playlists" element={<AuthGuard><Playlists /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CreditsBanner />
    </>
  );
}
