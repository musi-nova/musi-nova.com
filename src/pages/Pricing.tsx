import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CurvedArrow from "@/components/ui/curved-arrow";

const pricingOptions = [
	{
		type: "Subscription",
		subtitle: "For ongoing campaigns",
		price: "$100+",
		priceSuffix: "/month",
		highlight: true,
		icon: (
			<span className="flex items-center justify-center w-12 h-12 rounded-full bg-musinova-green/90 mb-4">
				<svg
					width="28"
					height="28"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						fill="#fff"
						d="M12 17.75a.75.75 0 0 1-.53-.22l-6.5-6.5a.75.75 0 1 1 1.06-1.06l5.97 5.97 5.97-5.97a.75.75 0 1 1 1.06 1.06l-6.5 6.5a.75.75 0 0 1-.53.22Z"
					/>
				</svg>
			</span>
		),
		features: [
			"Set your monthly budget",
			"Continuous campaign promotion",
			"Cancel anytime",
			"Lower fees for higher budgets",
			"Priority support",
		],
		fee: "45% fee up to $100/mo, 35% fee above $100/mo",
		adSpend: "55% ad spend up to $100/mo, 65% ad spend above $100/mo",
		cta: "Start Subscription",
		to: "/register",
	},
	{
		type: "One-Time Payment",
		subtitle: "For short-term boosts",
		price: "$100+",
		priceSuffix: "/campaign",
		icon: (
			<span className="flex items-center justify-center w-12 h-12 rounded-full bg-musinova-yellow/90 mb-4">
				<svg
					width="28"
					height="28"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						fill="#fff"
						d="M12 2a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 19.93 11H21a1 1 0 1 1 0 2h-1.07A7.002 7.002 0 0 1 13 19.93V21a1 1 0 1 1-2 0v-1.07A7.002 7.002 0 0 1 4.07 13H3a1 1 0 1 1 0-2h1.07A7.002 7.002 0 0 1 11 4.07V3a1 1 0 0 1 1-1Zm0 3a5 5 0 1 0 0 10A5 5 0 0 0 12 5Z"
					/>
				</svg>
			</span>
		),
		features: [
			"Set your one-time budget",
			"Choose campaign duration",
			"No commitment",
			"Great for testing or short-term boosts",
			"Same transparent fees",
		],
		fee: "45% fee up to $100, 35% fee above $100",
		adSpend: "55% ad spend up to $100, 65% ad spend above $100",
		cta: "Try One-Time",
		to: "/register",
	},
];

const Pricing = () => {
	return (
		<div
			className="min-h-screen flex flex-col"
			style={{
				background:
					"linear-gradient(135deg, #e3f0d6 0%, #c7e5c6 100%)",
			}}
		>
			<Navbar />
			<main className="flex-grow flex flex-col justify-center items-center py-12">
				<div className="w-full max-w-5xl px-4">
					<h1
						className="text-5xl font-extrabold text-center text-musinova-green mb-2"
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
					<div className="grid gap-10 md:grid-cols-2">
						{/* Subscription Card */}
						<div className="relative bg-white border border-gray-200 rounded-3xl shadow-2xl p-10 flex flex-col items-center hover:scale-[1.03] hover:shadow-3xl transition-transform duration-200">
							<span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-musinova-green text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">
								Most Popular
							</span>
							<div className="flex flex-col items-center w-full">
								<h2 className="text-2xl font-extrabold mb-1 text-musinova-darkgray tracking-tight">
									Subscription
								</h2>
								<div className="text-musinova-darkgray text-base mb-2 font-medium">
									For ongoing campaigns
								</div>
								<ul className="mb-8 text-musinova-darkgray text-base list-none text-left w-full space-y-2">
									<li className="flex items-center gap-2 relative">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										<span>
											Set your monthly budget{" "}
											<span className="font-semibold">
												(minimum $50)
											</span>
										</span>
									</li>
									<li className="flex items-center gap-4 mt-1" style={{ marginLeft: '24px', position: 'relative' }}>
                    <span className="flex-shrink-0" style={{ position: 'absolute', left: '0px', top: '-4px' }}>
                      <CurvedArrow width={38} height={24} fill="#000" stroke="#222" strokeWidth={2} />
                    </span>
                    <span className="text-sm font-bold text-black ml-10" style={{ position: 'relative', top: '1px' }}>Higher budget = more streams.</span>
                  </li>
									<li className="flex items-center gap-2">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										Continuous campaign promotion
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										Cancel anytime
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										Lower fees for higher budgets
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
										height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										Priority support
									</li>
								</ul>
								<div className="w-full mb-4 text-sm text-gray-700">
									<div>Our fee:</div>
									<div>
										• 45% if budget{" "}
										<span className="font-semibold">
											below $100/mo
										</span>
									</div>
									<div>
										• 35% if budget{" "}
										<span className="font-semibold">
											above $100/mo
										</span>
									</div>
								</div>
								<Link to="/register" className="w-full mt-auto">
									<Button className="w-full font-bold text-lg py-3 rounded-xl bg-musinova-green text-white hover:bg-musinova-green/90 transition-all shadow">
										Start Subscription
									</Button>
								</Link>
							</div>
						</div>
						{/* One-Time Payment Card */}
						<div className="relative bg-white border border-gray-200 rounded-3xl shadow-2xl p-10 flex flex-col items-center hover:scale-[1.03] hover:shadow-3xl transition-transform duration-200">
							<div className="flex flex-col items-center w-full">
								<h2 className="text-2xl font-extrabold mb-1 text-musinova-darkgray tracking-tight">
									One-Time Payment
								</h2>
								<div className="text-musinova-darkgray text-base mb-2 font-medium">
									For short-term boosts
								</div>
								<ul className="mb-8 text-musinova-darkgray text-base list-none text-left w-full space-y-2">
									<li className="flex items-center gap-2 relative">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										<span>
											Set your monthly budget{" "}
											<span className="font-semibold">
												(minimum $50)
											</span>
										</span>
									</li>
									<li className="flex items-center gap-4 mt-1" style={{ marginLeft: '24px', position: 'relative' }}>
                    <span className="flex-shrink-0" style={{ position: 'absolute', left: '0px', top: '-4px' }}>
                      <CurvedArrow width={38} height={24} fill="#000" stroke="#222" strokeWidth={2} />
                    </span>
                    <span className="text-sm font-bold text-black ml-10" style={{ position: 'relative', top: '1px' }}>Higher budget = more streams.</span>
                  </li>
									<li className="flex items-center gap-2">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										Continuous campaign promotion
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										Cancel anytime
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										Lower fees for higher budgets
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="text-musinova-green flex-shrink-0"
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 10.5l3.5 3.5 6-7"
											/>
										</svg>
										Priority support
									</li>
								</ul>
								<div className="w-full mb-4 text-sm text-gray-700">
									<div>Our fee:</div>
									<div>
										• 45% if budget{" "}
										<span className="font-semibold">
											below $100/mo
										</span>
									</div>
									<div>
										• 35% if budget{" "}
										<span className="font-semibold">
											above $100/mo
										</span>
									</div>
								</div>
								<Link to="/register" className="w-full mt-auto">
									<Button className="w-full font-bold text-lg py-3 rounded-xl border border-musinova-green text-musinova-green bg-white hover:bg-musinova-green hover:text-white transition-all shadow">
										Try One-Time
									</Button>
								</Link>
							</div>
						</div>
					</div>
					<div className="text-center text-xs text-gray-700 mt-10">
						All pricing is in USD.
					</div>
				</div>
			</main>
			<footer className="bg-white py-6">
				<div className="text-center text-musinova-darkgray text-base">
					<p className="mb-2">
						<span className="font-semibold">Cancel anytime.</span> All payments
						are securely processed via{" "}
						<span className="font-semibold text-musinova-green">Stripe</span>.
					</p>
					<p className="text-xs text-gray-500">
						Questions?{" "}
						<a
							href="/help"
							className="underline hover:text-musinova-green"
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
