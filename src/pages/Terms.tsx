import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Terms = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen">
    <Navbar />
    <main className="flex-grow flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-musinova-green mb-6 text-center">Terms & Conditions</h1>
        <p className="mb-6 text-musinova-darkgray text-base text-center">
          These Terms & Conditions ("Terms") govern your use of MusiNova ("we", "us", or "our") and all related services. By accessing or using our platform, you agree to these Terms. If you do not agree, please do not use our services.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-2">1. Use of Service</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>You must be at least 18 years old or have legal parental/guardian consent to use MusiNova.</li>
          <li>You agree to provide accurate, current, and complete information during registration and to keep it updated.</li>
          <li>You are responsible for maintaining the confidentiality of your account and password.</li>
          <li>You may not use our service for any unlawful, abusive, or fraudulent purpose.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">2. User Content</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>You retain ownership of content you upload or create, but grant us a license to use, display, and distribute it as needed to provide our services.</li>
          <li>You must have all necessary rights to any content you submit.</li>
          <li>You may not upload or share content that is illegal, infringing, or violates the rights of others.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">3. Payments & Subscriptions</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>All payments are processed securely via Stripe. By making a payment, you agree to Stripe's terms and policies.</li>
          <li>Subscription fees are billed in advance and are non-refundable except as required by law.</li>
          <li>You may cancel your subscription at any time via your dashboard or by contacting us.</li>
          <li>We reserve the right to change pricing or fees with reasonable notice.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">4. Intellectual Property</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>All MusiNova trademarks, branding, and platform content (excluding user content) are our property or licensed to us.</li>
          <li>You may not copy, modify, or distribute our content without permission.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">5. Termination</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>We may suspend or terminate your account if you violate these Terms or applicable laws.</li>
          <li>You may terminate your account at any time. Some data may be retained as required by law or for legitimate business purposes.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">6. Disclaimers & Limitation of Liability</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>Our service is provided "as is" and "as available" without warranties of any kind.</li>
          <li>We do not guarantee specific results, playlist placements, or audience growth.</li>
          <li>To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">7. Indemnification</h2>
        <p className="mb-4 text-musinova-darkgray">You agree to indemnify and hold MusiNova, its affiliates, and staff harmless from any claims, damages, or expenses arising from your use of the service or violation of these Terms.</p>
        <h2 className="text-xl font-bold mt-8 mb-2">8. Changes to Terms</h2>
        <p className="mb-4 text-musinova-darkgray">We may update these Terms from time to time. We will notify users of material changes. Continued use of the service after changes constitutes acceptance of the new Terms.</p>
        <h2 className="text-xl font-bold mt-8 mb-2">9. Governing Law</h2>
        <p className="mb-4 text-musinova-darkgray">These Terms are governed by the laws of the State of Wyoming, United States of America, without regard to conflict of law principles. Any disputes will be subject to the exclusive jurisdiction of the state and federal courts located in Wyoming, USA.</p>
        <h2 className="text-xl font-bold mt-8 mb-2">10. Contact</h2>
        <p className="mb-4 text-musinova-darkgray">For questions about these Terms, please contact us at <a href="mailto:musi.nova321@gmail.com" className="underline text-musinova-green">musi.nova321@gmail.com</a>.</p>
        <p className="text-xs text-gray-400 mt-8">These Terms were last updated on {new Date().toLocaleDateString()}.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
