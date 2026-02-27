import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Privacy = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <Navbar />
    <main className="flex-grow flex flex-col items-center pt-24 pb-12 px-4">
      <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-musinova-green mb-6 text-center">Privacy Policy</h1>
        <p className="mb-6 text-musinova-darkgray text-base text-center">
          This Privacy Policy explains how MusiNova ("we", "us", or "our") collects, uses, and protects your personal information in accordance with United States law, including the California Consumer Privacy Act (CCPA) and other applicable U.S. privacy laws. MusiNova is based in the State of Wyoming, USA.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li><strong>Account Information:</strong> Name, email address, password, and other information you provide when registering.</li>
          <li><strong>Usage Data:</strong> Information about how you use our service, such as playlists, campaigns, and interactions.</li>
          <li><strong>Payment Data:</strong> Payment and billing information processed securely by Stripe. We do not store your full payment details.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, and device information.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">2. How We Use Your Data</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>To provide and improve our services.</li>
          <li>To process payments and manage subscriptions.</li>
          <li>To communicate with you about your account, campaigns, and updates.</li>
          <li>To comply with legal obligations and prevent fraud.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>To provide and improve our services.</li>
          <li>To process payments and manage subscriptions.</li>
          <li>To communicate with you about your account, campaigns, and updates.</li>
          <li>To comply with legal obligations and prevent fraud.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">4. Data Sharing</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>We do not sell your personal information.</li>
          <li>We may share information with trusted service providers (e.g., Stripe, hosting) under strict confidentiality agreements, only as necessary to provide our services or comply with the law.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">5. Your Rights (U.S. Residents)</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>Request access to the personal information we hold about you.</li>
          <li>Request correction or deletion of your personal information.</li>
          <li>Opt out of the sale of your personal information (we do not sell your data).</li>
          <li>Non-discrimination for exercising your privacy rights.</li>
          <li>California residents: You have additional rights under the CCPA, including the right to request disclosure of the categories and specific pieces of personal information we have collected about you.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">6. Data Security & Retention</h2>
        <ul className="list-disc list-inside mb-4 text-musinova-darkgray">
          <li>We use industry-standard security measures to protect your data.</li>
          <li>We retain your data only as long as necessary for the purposes described or as required by law.</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">7. Cookies</h2>
        <p className="mb-4 text-musinova-darkgray">We do not use cookies or similar tracking technologies for analytics or marketing. If this changes, we will update this policy and provide notice as required by U.S. law.</p>
        <h2 className="text-xl font-bold mt-8 mb-2">8. Contact</h2>
        <p className="mb-4 text-musinova-darkgray">If you have questions or wish to exercise your rights, please contact us at <a href="mailto:contact@musi-nova.com" className="underline text-musinova-green">contact@musi-nova.com</a>.</p>
        <p className="text-xs text-gray-400 mt-8">This policy was last updated on {new Date().toLocaleDateString()}. This policy is governed by the laws of the State of Wyoming, United States of America.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
