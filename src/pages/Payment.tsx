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
  id: string;
  playlist_id: string;
  playlist_name: string;
  campaign_id?: string;
  artist_id?: string;
};

const PaymentPage = () => {
  const [paymentType, setPaymentType] = useState<"subscription" | "one-time">(
    "subscription"
  );
  const [subscriptionAmount, setSubscriptionAmount] = useState(100);
  const [oneTimeAmount, setOneTimeAmount] = useState(100);
  const [oneTimeDuration, setOneTimeDuration] = useState(14);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Job | null>(null); // Store the full Job object
  const navigate = useNavigate();

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiFetch("user/playlist/jobs");
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
          jobCounters[job.playlist_id] =
            (jobCounters[job.playlist_id] || 0) + 1;

          const campaignSuffix =
            jobCounters[job.playlist_id] > 1
              ? ` (Campaign ${jobCounters[job.playlist_id]})`
              : "";

          return {
            id: `${job.playlist_id}-${job.campaign_id}`,
            name: `${job.playlist_name}${campaignSuffix}`,
            campaign_id: job.campaign_id,
            playlist_id: job.playlist_id,
            artist_id: job.artist_id,
          };
        });

        setJobs([...uniqueJobs]);
        if (uniqueJobs.length > 0) {
          setSelectedCampaign(uniqueJobs[0]); // Set the first job as the default selected campaign
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const calculateBreakdown = (amount: number) => {
    const musiNovaFee =
      amount <= 100 ? (amount * 0.45).toFixed(2) : (amount * 0.35).toFixed(2);
    const adSpend =
      amount <= 100 ? (amount * 0.55).toFixed(2) : (amount * 0.65).toFixed(2);
    return {
      musiNovaFee: parseFloat(musiNovaFee),
      adSpend: parseFloat(adSpend),
      totalCharge: amount,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let paymentDetails;

    if (paymentType === "subscription") {
      const breakdown = calculateBreakdown(subscriptionAmount);
      paymentDetails = {
        paymentType,
        subscriptionAmount,
        selectedCampaign,
        breakdown,
      };
    } else {
      const breakdown = calculateBreakdown(oneTimeAmount);
      paymentDetails = {
        paymentType,
        oneTimeAmount,
        oneTimeDuration,
        selectedCampaign,
        breakdown,
      };
    }

    console.log("Form submitted with values:", paymentDetails);

    setTimeout(() => setIsSubmitting(false), 2000); // Simulate submission delay
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const breakdown =
    paymentType === "subscription"
      ? calculateBreakdown(subscriptionAmount)
      : calculateBreakdown(oneTimeAmount);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Choose Payment Option
            </h2>

            {/* Campaign Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Campaign
              </label>
              <select
                value={selectedCampaign?.id || ""}
                onChange={(e) =>
                  setSelectedCampaign(
                    jobs.find((job) => job.id === e.target.value) || null
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="" disabled>
                  -- Select a Campaign --
                </option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.name}
                  </option>
                ))}
              </select>
            </div>

            <Tabs
              defaultValue="subscription"
              onValueChange={(value) =>
                setPaymentType(value as "subscription" | "one-time")
              }
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="subscription">
                  Monthly Subscription
                </TabsTrigger>
                <TabsTrigger value="one-time">One-Time Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="subscription">
                <div className="space-y-6 mb-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        Monthly Budget
                      </label>
                      <span className="text-lg font-bold text-musinova-green">
                        ${subscriptionAmount}
                      </span>
                    </div>

                    <Slider
                      defaultValue={[subscriptionAmount]}
                      max={10000}
                      min={50}
                      step={50}
                      onValueChange={(values) =>
                        setSubscriptionAmount(values[0])
                      }
                      className="my-4"
                    />

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$50</span>
                      <span>$10,000</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="one-time">
                <div className="space-y-6 mb-8">
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
                      min={50}
                      step={50}
                      onValueChange={(values) => setOneTimeAmount(values[0])}
                      className="my-4"
                    />

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$50</span>
                      <span>$10,000</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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
                  disabled={isSubmitting || !selectedCampaign}
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