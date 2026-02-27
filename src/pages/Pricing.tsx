import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Check, Rocket, TrendingUp, Award } from "lucide-react";
import { apiFetch } from "@/lib/api";
import React from "react";
import { useAnalytics } from '@/hooks/use-analytics';


const Pricing = () => {
	const navigate = useNavigate();

	const { trackPageView, trackClick } = useAnalytics();

	React.useEffect(() => {
		void trackPageView('/pricing', { component: 'Pricing' });
	}, [trackPageView]);

	// Use the same breakdown calculation as Payment
	const calculateBreakdown = (amount: number) => {
		const musiNovaFee = amount <= 100 ? (amount * 0.45).toFixed(2) : (amount * 0.35).toFixed(2);
		const adSpend = amount <= 100 ? (amount * 0.55).toFixed(2) : (amount * 0.65).toFixed(2);
		return {
			musiNovaFee: parseFloat(musiNovaFee),
			adSpend: parseFloat(adSpend),
			totalCharge: amount,
		};
	};

	// Handles guest campaign payment logic
	const handlePlanClick = async (e: React.MouseEvent, planAmount: number) => {
		e.preventDefault();
		// Track selected plan then go to create campaign flow
		void trackClick('select_plan', { component: 'Pricing', plan_amount: planAmount });
		// Always go to the create campaign flow and pass the chosen plan amount
		navigate('/campaigns/new', { state: { planAmount } });
	};

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{
				background: "#ffffff",
			}}
		>
			<Navbar />
			<main className="flex-grow flex flex-col justify-center items-center pt-28 md:pt-28 px-4">
				<div className="w-full max-w-7xl px-4">
					<h1
						className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-musinova-green mb-2"
						style={{
							textShadow: "0 2px 8px #c7e5c6",
						}}
					>
						Pricing
					</h1>
					<p className="text-lg text-center mb-8 max-w-2xl mx-auto text-musinova-darkgray">
						Simple, transparent pricing.{" "}
						<span className="text-musinova-green font-semibold">
							No hidden fees.
						</span>{" "}
						Choose the option that fits your campaign best.
					</p>
					<div className="grid gap-10 md:grid-cols-3">
						{/* Launch Pad Plan - Light Grey */}
						<div className="relative bg-gray-100 border border-gray-300 rounded-3xl shadow-2xl p-10 flex flex-col items-center hover:scale-[1.03] hover:shadow-3xl transition-transform duration-200">
							<div className="flex flex-col items-center w-full">
								<span className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-300 mb-4">
									<Rocket size={32} stroke="#5EA47C" />
								</span>
								<h2 className="text-2xl font-extrabold mb-1 text-gray-700 tracking-tight">LAUNCH PAD</h2>
								<div className="text-gray-700 text-2xl font-bold mb-2">$197 USD</div>
								<ul className="mb-6 text-musinova-darkgray text-base text-left w-full max-w-sm md:max-w-md mx-auto space-y-4">
									<li className="flex items-start gap-3"><Check size={28} className="text-musinova-green pt-1 flex-shrink-0" />Introduce your unique sound to a hand-picked, foundational audience.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-musinova-green pt-1 flex-shrink-0" />Secure placement on a dedicated playlist tailored to your specific genre.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-musinova-green pt-1 flex-shrink-0" />Begin the essential process of identifying and building your core listeners.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-musinova-green pt-1 flex-shrink-0" />Create a professional entry point for new fans to discover your brand.</li>
								</ul>
								<Button className="w-full font-bold text-lg py-3 rounded-xl bg-gray-300 text-gray-800 hover:bg-gray-400 transition-all shadow" onClick={(e) => handlePlanClick(e, 197)}>BEGIN JOURNEY</Button>
							</div>
						</div>

						{/* Momentum Plan - Musinova Green */}
						<div className="relative bg-musinova-green border border-musinova-green rounded-3xl shadow-2xl p-10 flex flex-col items-center hover:scale-[1.03] hover:shadow-3xl transition-transform duration-200">
							<span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-musinova-green text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">Most Popular</span>
							<div className="flex flex-col items-center w-full">
								<span className="flex items-center justify-center w-14 h-14 rounded-full bg-white mb-4">
									<TrendingUp size={32} stroke="#5EA47C" />
								</span>
								<h2 className="text-2xl font-extrabold mb-1 text-white tracking-tight">MOMENTUM</h2>
								<div className="text-white text-2xl font-bold mb-2">$397 USD</div>
								<ul className="mb-6 text-white text-base text-left w-full max-w-sm md:max-w-md mx-auto space-y-4">
									<li className="flex items-start gap-3"><Check size={28} className="text-white pt-1 flex-shrink-0" />Accelerate your growth by targeting listeners ready for a new favorite artist.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-white pt-1 flex-shrink-0" />Bridge the gap between casual plays and a loyal, recurring listener base.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-white pt-1 flex-shrink-0" />Fuel your most promising tracks with strategic, high-level visibility.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-white pt-1 flex-shrink-0" />Scale the organic buzz around your project to reach new territories.</li>
								</ul>
								<Button className="w-full font-bold text-lg py-3 rounded-xl bg-white text-musinova-green hover:bg-musinova-cream transition-all shadow border border-musinova-green" onClick={(e) => handlePlanClick(e, 397)}>ACCELERATE GROWTH</Button>
							</div>
						</div>

						{/* Breakthrough Plan - Musinova Brown */}
						<div className="relative bg-musinova-brown border border-musinova-brown rounded-3xl shadow-2xl p-10 flex flex-col items-center hover:scale-[1.03] hover:shadow-3xl transition-transform duration-200">
							<div className="flex flex-col items-center w-full">
								<span className="flex items-center justify-center w-14 h-14 rounded-full bg-white mb-4">
									<Award size={32} stroke="#8B5A2B" />
								</span>
								<h2 className="text-2xl font-extrabold mb-1 text-white tracking-tight">BREAKTHROUGH</h2>
								<div className="text-white text-2xl font-bold mb-2">$797 USD</div>
								<ul className="mb-6 text-white text-base text-left w-full max-w-sm md:max-w-md mx-auto space-y-4">
									<li className="flex items-start gap-3"><Check size={28} className="text-musinova-gold pt-1 flex-shrink-0" />Command attention with an intensive campaign for market saturation.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-musinova-gold pt-1 flex-shrink-0" />Achieve a career-defining level of exposure across high-traffic networks.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-musinova-gold pt-1 flex-shrink-0" />Drive a significant spike in data to trigger long-term algorithmic growth.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-musinova-gold pt-1 flex-shrink-0" />Establish an undeniable presence that is impossible to overlook.</li>
									<li className="flex items-start gap-3"><Check size={28} className="text-musinova-gold pt-1 flex-shrink-0" />Utilize our full resource suite to maximize your global potential.</li>
								</ul>
								<Button className="w-full font-bold text-lg py-3 rounded-xl bg-white text-musinova-brown hover:bg-musinova-cream transition-all shadow border border-musinova-brown" onClick={(e) => handlePlanClick(e, 797)}>MAXIMIZE REACH</Button>
							</div>
						</div>
					</div>
					{/* Contact card for custom requests */}
					<div className="mt-8 flex justify-center">
						<div className="bg-white border border-gray-200 rounded-xl shadow-md px-6 py-4 w-full text-center">
							<p className="text-sm text-musinova-darkgray mb-2 font-semibold">Are you a small or independent label?</p>
							<p className="text-sm text-musinova-darkgray mb-4">We offer custom solutions for label rosters, multiple artists, and unique campaign needs. Let’s help your artists break through with a tailored approach.</p>
							<div className="flex flex-col sm:flex-row sm:justify-center gap-3 items-center">
								<Link to="/help" className="inline-block">
									<Button className="bg-musinova-cream text-musinova-brown px-4 py-2 rounded-md text-sm font-semibold hover:bg-musinova-cream/80 transition-colors">
										Contact Us
									</Button>
								</Link>
								<a
									href="https://calendly.com/contact-musi-nova/30min"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block bg-musinova-green text-white px-4 py-2 rounded-md text-sm font-semibold"
								>
									Book a label consult
								</a>
							</div>
						</div>
					</div>
					<div className="text-center text-xs text-gray-700 mt-10 pb-8">
						All packages include a dedicated genre-specific playlist with your music at the top, blended with similar popular artists.
					</div>
				</div>
			</main>
			<footer className="bg-musinova-green py-6">
				<div className="text-center text-white text-base">
					<p className="mb-2">
						All payments are securely processed via{' '}
						<span className="font-semibold text-white">Stripe</span>.
					</p>
					<p className="text-xs text-white">
						Questions?{' '}
						<a
							href="/help"
							className="underline hover:text-musinova-brown"
						>
							Contact us
						</a>
						.
					</p>
				</div>
			</footer>
		</div>
	);
};

export default Pricing;
