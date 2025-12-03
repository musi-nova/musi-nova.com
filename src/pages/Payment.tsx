import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api"; // Replace with your actual API fetch utility

type Job = {
  playlist_id: string;
  playlist_name: string;
  campaign_name: string;
  campaign_id?: string;
  artist_id?: string;
  displayName?: string;
  id: string; // generated as playlist_id + '-' + campaign_id
};

const PaymentPage = () => {
  const [oneTimeAmount, setOneTimeAmount] = useState(100);
  const [oneTimeDuration, setOneTimeDuration] = useState(14);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const navigate = useNavigate();

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiFetch("team/jobs");
        if (response.status === 401) {
          console.error("Unauthorized access to campaign summary");
          window.location.href = "/login";
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data: Job[] = await response.json();
        console.log("Jobs Data:", data);

        const jobCounters: Record<string, number> = {};
        const uniqueJobs = Array.from(
          new Map(
            data.map((job) => [`${job.playlist_id}-${job.campaign_id}`, job])
          ).values()
        ).map((job) => {
          jobCounters[job.playlist_id] = (jobCounters[job.playlist_id] || 0) + 1;
          const campaignSuffix = jobCounters[job.playlist_id] > 1 ? ` (Campaign ${jobCounters[job.playlist_id]})` : "";
          return {
            ...job,
            id: `${job.playlist_id}-${job.campaign_id}`,
            displayName: `${job.campaign_name}${campaignSuffix}`,
          };
        });
        setJobs([...uniqueJobs]);
        if (uniqueJobs.length > 0) {
          setSelectedCampaignId(uniqueJobs[0].id);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const calculateBreakdown = (amount: number) => {
    const musiNovaFee = amount <= 100 ? (amount * 0.45).toFixed(2) : (amount * 0.35).toFixed(2);
    const adSpend = amount <= 100 ? (amount * 0.55).toFixed(2) : (amount * 0.65).toFixed(2);
    return {
      musiNovaFee: parseFloat(musiNovaFee),
      adSpend: parseFloat(adSpend),
      totalCharge: amount,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCampaign = jobs.find((job) => job.id === selectedCampaignId) || null;

    setIsSubmitting(true);
    const breakdown = calculateBreakdown(oneTimeAmount);
    const paymentDetails = {
      paymentType: "one-time",
      oneTimeAmount,
      oneTimeDuration,
      selectedCampaign,
      breakdown,
    };
    console.log("Form submitted with values:", paymentDetails);
    try {
      const response = await apiFetch("stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe checkout
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("An error occurred while processing your payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const breakdown = calculateBreakdown(oneTimeAmount);

  // Get the selected campaign object for use in form and handleSubmit
  const selectedCampaign = jobs.find((job) => job.id === selectedCampaignId) || null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Top Up Your Campaign
            </h2>

            {/* Campaign Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Campaign
              </label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="" disabled>
                  -- Select a Campaign --
                </option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* One-Time Payment Only */}
            <div className="space-y-6 mb-8">
              {/* amount of money */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">
                    Campaign Budget
                  </label>
                  <span className="text-lg font-bold text-musinova-green">
                    ${oneTimeAmount}
                  </span>
                </div>
                <Slider
                  defaultValue={[oneTimeAmount]}
                  max={10000}
                  min={25}
                  step={5}
                  onValueChange={(values) => setOneTimeAmount(values[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$25</span>
                  <span>$10,000</span>
                </div>
              </div>
              {/* duration of campaign */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">
                    Campaign Duration (days)
                  </label>
                  <span className="text-lg font-bold text-musinova-green">
                    {oneTimeDuration} days
                  </span>
                </div>
                <Slider
                  defaultValue={[oneTimeDuration]}
                  max={30}
                  min={1}
                  step={1}
                  onValueChange={(values) => setOneTimeDuration(values[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 day</span>
                  <span>30 days</span>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-4">Payment Breakdown</h3>
              <div className="flex justify-between mb-2">
                <span>MusiNova Fee:</span>
                <span>${breakdown.musiNovaFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Ad Spend:</span>
                <span>${breakdown.adSpend.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Charge:</span>
                <span>${breakdown.totalCharge.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft size={16} className="mr-2" /> Back
                </Button>

                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting || !selectedCampaignId}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      Launch Campaign <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPage;