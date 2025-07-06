
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const pricingOptions = [
  {
    type: "Subscription",
    subtitle: "For ongoing campaigns",
    price: "$100+",
    priceSuffix: "/month",
    highlight: true,
    icon: (
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-musinova-green/90 mb-4">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 17.75a.75.75 0 0 1-.53-.22l-6.5-6.5a.75.75 0 1 1 1.06-1.06l5.97 5.97 5.97-5.97a.75.75 0 1 1 1.06 1.06l-6.5 6.5a.75.75 0 0 1-.53.22Z"/></svg>
      </span>
    ),
    features: [
      "Set your monthly budget",
      "Continuous campaign promotion",
      "Cancel anytime",
      "Lower fees for higher budgets",
      "Priority support"
    ],
    fee: "45% fee up to $100/mo, 35% fee above $100/mo",
    adSpend: "55% ad spend up to $100/mo, 65% ad spend above $100/mo",
    cta: "Start Subscription",
    to: "/register"
  },
  {
    type: "One-Time Payment",
    subtitle: "For short-term boosts",
    price: "$100+",
    priceSuffix: "/campaign",
    icon: (
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-musinova-yellow/90 mb-4">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 19.93 11H21a1 1 0 1 1 0 2h-1.07A7.002 7.002 0 0 1 13 19.93V21a1 1 0 1 1-2 0v-1.07A7.002 7.002 0 0 1 4.07 13H3a1 1 0 1 1 0-2h1.07A7.002 7.002 0 0 1 11 4.07V3a1 1 0 0 1 1-1Zm0 3a5 5 0 1 0 0 10A5 5 0 0 0 12 5Z"/></svg>
      </span>
    ),
    features: [
      "Set your one-time budget",
      "Choose campaign duration",
      "No commitment",
      "Great for testing or short-term boosts",
      "Same transparent fees"
    ],
    fee: "45% fee up to $100, 35% fee above $100",
    adSpend: "55% ad spend up to $100, 65% ad spend above $100",
    cta: "Try One-Time",
    to: "/register"
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center py-12">
        <div className="w-full max-w-5xl px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-musinova-green text-center mb-2 drop-shadow-lg tracking-tight">
            Pricing
          </h1>
          <p className="text-lg md:text-xl text-musinova-darkgray text-center mb-12 max-w-2xl mx-auto">
            Simple, transparent pricing. <span className="text-musinova-green font-semibold">No hidden fees.</span> Choose the option that fits your campaign best.
          </p>
          <div className="grid gap-10 md:grid-cols-2">
            {pricingOptions.map((option, idx) => (
              <div
                key={option.type}
                className={
                  `relative bg-white/95 border-2 ${option.highlight ? 'border-musinova-green/40' : 'border-musinova-yellow/40'} rounded-3xl shadow-2xl p-10 flex flex-col items-center hover:scale-[1.03] hover:shadow-3xl transition-transform duration-200` +
                  (option.highlight ? ' ring-2 ring-musinova-green/20' : '')
                }
              >
                {option.highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-musinova-green text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">Most Popular</span>
                )}
                {option.icon}
                <h2 className="text-2xl font-extrabold mb-1 text-musinova-darkgray drop-shadow-sm tracking-tight">
                  {option.type}
                </h2>
                <div className="text-musinova-darkgray text-base mb-2 font-medium">{option.subtitle}</div>
                <div className="flex items-end justify-center mb-4">
                  <span className="text-4xl font-extrabold text-musinova-green mr-1">{option.price}</span>
                  <span className="text-musinova-darkgray text-lg font-medium">{option.priceSuffix}</span>
                </div>
                <ul className="mb-8 text-musinova-darkgray text-base list-none text-left w-full space-y-2">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg className="text-musinova-green flex-shrink-0" width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 10.5l3.5 3.5 6-7"/></svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="w-full mb-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>MusiNova Fee:</span>
                    <span>{option.fee}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Ad Spend:</span>
                    <span>{option.adSpend}</span>
                  </div>
                </div>
                <Link to={option.to} className="w-full mt-auto">
                  <Button className={`w-full font-bold text-lg py-3 rounded-xl transition-all shadow ${option.highlight ? 'bg-musinova-green text-white hover:bg-musinova-green/90' : 'bg-white text-musinova-green border border-musinova-green hover:bg-musinova-green hover:text-white'}`}>
                    {option.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Pricing page footer info */}
      <footer className="bg-white py-6">
        <div className="text-center text-musinova-darkgray text-base">
          <p className="mb-2">
            <span className="font-semibold">Cancel anytime.</span> All payments are securely processed via <span className="font-semibold text-musinova-green">Stripe</span>.
          </p>
          <p className="text-xs text-gray-500">Questions? <a href="/help" className="underline hover:text-musinova-green">Contact us</a>.</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
