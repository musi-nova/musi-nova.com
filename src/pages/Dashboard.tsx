import React from 'react';
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import UserSubmissionsList from '@/components/UserSubmissionsList';
import { daysSince } from '@/lib/uiUtils';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import MobileBadge from '@/components/ui/mobile-badge';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import GuestBanner from '@/components/GuestBanner';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./DashboardTopupBtn.css";

const baseUrl = import.meta.env.VITE_MN_API_BASE_URL;

// Define a type for the job data
type Job = {
  id: string;
  name: string;
  playlist_id: string;
  playlist_name: string;
  campaign_id?: string;
  campaign_name?: string;
  artist_id?: string;
};

const cache: Record<string, any> = {}; // In-memory cache object

// using shared LazyImage and daysSince utilities

// Function to fetch data with caching
const fetchWithCache = async (key: string, fetcher: () => Promise<any>) => {
  if (cache[key]) {
    console.log(`Cache hit for key: ${key}`);
    return cache[key];
  }

  console.log(`Cache miss for key: ${key}`);
  const data = await fetcher();
  cache[key] = data; // Store the result in the cache
  return data;
};

// Function to fetch campaign summary
const fetchCampaignSummaryData = async (
  playlist_id: string,
  campaign_id?: string
) => {
  const cacheKey = `campaign-summary-${playlist_id}-${campaign_id || "none"}`;
  return fetchWithCache(cacheKey, async () => {
    try {
      const response = await apiFetch(
        `team/playlist/${playlist_id}/campaign/${campaign_id || "none"}/summary`
      );

      if (!response.ok) {
        console.error("Failed to fetch campaign summary");
        throw new Error("Failed to fetch campaign summary");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching campaign summary:", error);

      // Return a placeholder object if the API call fails
      return {
        playlist_name: "Unavailable",
        playlist_description: "Live Spotify data is currently unavailable.",
        playlist_image_url: "/placeholder.svg", // Replace with a valid placeholder image path
        spend: 0,
        playlist_followers_total: 0,
      };
    }
  });
};

// Function to fetch time series data
const fetchTimeSeriesData = async (
  playlist_id: string,
  campaign_id?: string
) => {
  const cacheKey = `time-series-${playlist_id}-${campaign_id || "none"}`;
  return fetchWithCache(cacheKey, async () => {
    const response = await apiFetch(
      `team/playlist/${playlist_id}/campaign/${campaign_id || "none"}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch time series data");
    }
    return response.json();
  });
};

// Helper to format the campaign end date for the badge
const formatEndDate = (dateLike: string | number | null | undefined) => {
  if (!dateLike) return "";
  const d = new Date(dateLike as any);
  if (isNaN(d.getTime())) return String(dateLike);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

// Function to fetch artist's top tracks
const fetchArtistTopTracks = async (artist_id: string) => {
  const cacheKey = `artist-top-tracks-${artist_id}`;
  return fetchWithCache(cacheKey, async () => {
    const response = await apiFetch(`team/artist/${artist_id}/top-tracks`);
    if (!response.ok) {
      throw new Error("Failed to fetch artist's top tracks");
    }
    return response.json();
  });
};

const Dashboard = () => {
  const [selectedJob, setSelectedJob] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [campaignSummary, setCampaignSummary] = useState<any>(null);
  const [topTracksData, setTopTracksData] = useState<any[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignAmount, setAssignAmount] = useState<number | string>("");
  const [assignDurationDays, setAssignDurationDays] = useState<number>(14);
  const [assignLoading, setAssignLoading] = useState(false);
  const [currentCredits, setCurrentCredits] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);

  // When opening the assign dialog, prefill with minimum 100
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const openAssignDialog = async () => {
    // Fetch latest credits from API to ensure up-to-date value before opening slider
    setCreditsLoading(true);
    try {
      const res = await apiFetch('team/credits');
      if (!res.ok) {
        // If we can't fetch, fall back to stored user value
        console.warn('Failed to fetch latest credits, falling back to user value');
      }

      const data = res.ok ? await res.json() : null;
      const latest = data === null ? (Number((user as any)?.credits ?? (user as any)?.credit_amount ?? 0)) : (typeof data === 'number' ? data : (data?.credits ?? 0));
      const userCredits = Number(latest || 0);

      if (userCredits < 100) {
        // Persist toast payload so it can be shown after redirect
        try {
          localStorage.setItem('pending_toast', JSON.stringify({ title: 'Not enough credits', description: 'You need at least 100 credits to assign to a campaign. Please top up.', variant: 'destructive' }));
        } catch (err) {
          console.error('Failed to persist toast for redirect', err);
        }
        window.location.href = '/payment-credits';
        return;
      }

      setCurrentCredits(userCredits);
  // default assign amount and duration when opening
  setAssignAmount((prev) => (prev === "" ? 100 : prev));
  setAssignDurationDays((prev) => prev ?? 7);
      setAssignOpen(true);
    } catch (err) {
      console.error('Error fetching credits:', err);
      // fallback: open dialog with user value
      const fallback = Number((user as any)?.credits ?? (user as any)?.credit_amount ?? 0);
      setCurrentCredits(fallback);
      setAssignAmount((prev) => (prev === "" ? 100 : prev));
      setAssignDurationDays((prev) => prev ?? 7);
      setAssignOpen(true);
    } finally {
      setCreditsLoading(false);
    }
  };

  const isMobile = useIsMobile();
  const [showGuestBanner, setShowGuestBanner] = useState(false);
  const [viewMode, setViewMode] = useState<'campaign' | 'submissions'>('campaign');
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState<string | null>(null);

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

        // If there are no jobs returned, switch the dashboard to the submissions view
        if (!data || data.length === 0) {
          setViewMode('submissions');
        } else {
          // ensure campaign view when jobs are available
          setViewMode('campaign');
        }

        const jobCounters: Record<string, number> = {};
        const uniqueJobs = Array.from(
          new Map(
            data.map((job) => [`${job.campaign_name}-${job.campaign_id}`, job])
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
            name: `${job.campaign_name}${campaignSuffix}`,
            campaign_name: job.campaign_name,
            campaign_id: job.campaign_id,
            playlist_id: job.playlist_id,
            playlist_name: job.playlist_name,
            artist_id: job.artist_id,
          } as Job;
        });

        setJobs([...uniqueJobs]);
        if (uniqueJobs.length > 0) {
          setSelectedJob(uniqueJobs[0].id);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('guestBannerDismissed');
      const userName = (user?.user_name || '').toString().toLowerCase();
      const isGuest = userName.includes('guest');
      setShowGuestBanner(isGuest && !dismissed);
    } catch (err) {
      setShowGuestBanner(false);
    }
  }, [user]);

  // Fetch campaign summary and time series data
  useEffect(() => {
    const fetchCampaignSummary = async () => {
      if (selectedJob === "all") {
        setCampaignSummary(null);
        setTimeSeriesData([]);
        return;
      }

      const selected = jobs.find((job) => job.id === selectedJob);
      if (selected?.playlist_id) {
        try {
          const summary = await fetchCampaignSummaryData(
            selected.playlist_id,
            selected.campaign_id
          );
          console.log("Campaign Summary:", summary);
          setCampaignSummary(summary);

          const timeSeries = await fetchTimeSeriesData(
            selected.playlist_id,
            selected.campaign_id
          );
          setTimeSeriesData(timeSeries);
        } catch (error) {
          console.error(
            "Error fetching campaign summary or time series data:",
            error
          );
        }
      } else {
        console.warn("Missing playlist_id for the selected job.");
        setCampaignSummary(null);
        setTimeSeriesData([]);
      }
    };

    fetchCampaignSummary();
  }, [selectedJob, jobs]);

  // Handler to assign credits to the campaign
  const handleAssignCredits = async () => {
    if (!campaignSummary?.campaign_id) return;
    const amount = Number(assignAmount);
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid credit amount');
      return;
    }

    // Enforce minimum of 100 credits
    if (amount < 100) {
      alert('Minimum assignment is 100 credits');
      return;
    }

    setAssignLoading(true);
    try {
      // Assumption: backend supports POST to this endpoint to set credits for a campaign
      // Compute end_date based on selected duration in days (UTC ISO string)
      const durationDays = Number(assignDurationDays) || 0;
      const now = new Date();
      const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
      const end_date = endDate.toISOString();

      const res = await apiFetch(`team/campaign/${campaignSummary.campaign_id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credit_amount: amount, end_date }),
      });

      if (!res.ok) throw new Error('Failed to assign credits');

      // Try to update the campaign summary using the same summary endpoint
      const updated = await fetchCampaignSummaryData(campaignSummary.playlist_id, campaignSummary.campaign_id);
      setCampaignSummary(updated);
      setAssignOpen(false);
      setAssignAmount("");
      setAssignDurationDays(14);
    } catch (err) {
      console.error('Error assigning credits:', err);
      alert('Failed to assign credits. Please try again.');
    } finally {
      setAssignLoading(false);
    }
  };

  useEffect(() => {
    const fetchTopTracks = async () => {
      const selected = jobs.find((job) => job.id === selectedJob);
      if (selected?.artist_id) {
        try {
          const tracks = await fetchArtistTopTracks(selected.artist_id);

          // Preprocess the data to round `created_at` to just the date
          const processedTracks = tracks.map((track) => ({
            ...track,
            created_at: new Date(track.created_at).toISOString().split("T")[0], // Extract only the date part
          }));

          // Get all unique dates
          const allDates = Array.from(
            new Set(processedTracks.map((track) => track.created_at))
          ).sort();

          // Get all unique track names
          const trackNames = Array.from(
            new Set(processedTracks.map((track) => track.track_name))
          ) as string[];

          // Normalize the data
          const normalizedData = allDates.map((date) => {
            const dataPoint: Record<string, any> = { created_at: date };
            trackNames.forEach((trackName) => {
              const track = processedTracks.find(
                (t) => t.created_at === date && t.track_name === trackName
              );
              dataPoint[trackName] = track ? track.track_popularity : 0; // Fill missing values with 0
            });
            return dataPoint;
          });

          setTopTracksData(normalizedData);
          console.log("Normalized Top Tracks Data:", normalizedData);
        } catch (error) {
          console.error("Error fetching artist's top tracks:", error);
        }
      } else {
        console.warn("Missing artist_id for the selected job.");
        setTopTracksData([]);
      }
    };

    fetchTopTracks();
  }, [selectedJob, jobs]);

  // Fetch user submissions when viewMode is 'submissions'
  useEffect(() => {
    if (viewMode !== 'submissions') return;
    const fetchUserSubmissions = async () => {
      setSubsLoading(true);
      setSubsError(null);
      try {
        const res = await apiFetch('team/submissions');
        if (!res.ok) throw new Error('Failed to fetch your submissions');
        const data = await res.json();
        setUserSubmissions(data);
      } catch (err: any) {
        console.error(err);
        setSubsError(err?.message || 'Error fetching submissions');
      } finally {
        setSubsLoading(false);
      }
    };

    fetchUserSubmissions();
  }, [viewMode]);

  return (
    <PageLayout
      showSidebar={true}
      className="bg-musinova-cream/30 py-4 md:py-8"
    >
      {/* Job Selector */}
      <div className="mb-4 md:mb-8">
        {/* View toggle similar to Hero FlowTabs */}
        <div className="flex justify-center py-2 mb-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'campaign' | 'submissions')} className="w-full max-w-[92vw] md:w-[480px]">
            <TabsList className="w-full">
              <TabsTrigger value="campaign" className="w-1/2 data-[state=active]:bg-musinova-green data-[state=active]:text-white">Your Campaigns</TabsTrigger>
              <TabsTrigger value="submissions" className="w-1/2 data-[state=active]:bg-musinova-green data-[state=active]:text-white">Your Submissions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Job selector (only for campaign view) */}
        {viewMode === 'campaign' && (
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full md:w-80 text-sm">
                <SelectValue placeholder="Select job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="text-sm md:text-base"
              onClick={() => {
                const selected = jobs.find((job) => job.id === selectedJob);
                if (selected?.playlist_id) {
                  const smartUrl = `${baseUrl}spotify/playlist/${selected.playlist_id}/smart-url`;
                  window.open(smartUrl, "_blank"); // Open the Smart URL in a new tab
                } else {
                  alert("Please select a valid playlist to generate a Smart URL.");
                }
              }}
            >
              Get Smart-URL
            </Button>
          </div>
        )}
      </div>

      {showGuestBanner && (
        <GuestBanner onDismiss={() => { localStorage.setItem('guestBannerDismissed', '1'); setShowGuestBanner(false); }} />
      )}

      {/* Submissions view - mirror Submission.tsx layout */}
      {viewMode === 'submissions' && isAuthenticated && (
        <>
          <UserSubmissionsList submissions={userSubmissions} loading={subsLoading} error={subsError} />
        </>
      )}

      {/* Render Campaign Summary */}
      {viewMode === 'campaign' && campaignSummary && (
        <div className="mb-4">
          <Card className="bg-white p-4 rounded shadow-md py-8 relative">
            {/* Top-right badge: show 'Not currently running' when end_date is null, otherwise show formatted end date */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {/* End date badge or not running (mobile icon + tooltip, desktop label) */}
              {(() => {
                const end = campaignSummary?.end_date ? new Date(campaignSummary.end_date) : null;
                const now = new Date();
                if (!end) {
                  return (
                    <MobileBadge
                      icon={<AlertTriangle size={16} />}
                      label={"Not currently running"}
                      explanation={"This campaign is not currently running."}
                      variant="destructive"
                    />
                  );
                }

                // If end date is in the past, show a destructive 'Ended' badge
                if (end.getTime() < now.getTime()) {
                  return (
                    <MobileBadge
                      icon={<AlertTriangle size={16} />}
                      label={`Ended ${formatEndDate(end.toISOString())}`}
                      explanation={`Ended ${formatEndDate(end.toISOString())}`}
                      variant="destructive"
                    />
                  );
                }

                return (
                  <MobileBadge
                    icon={<Calendar size={16} />}
                    label={`Ends ${formatEndDate(end.toISOString())}`}
                    explanation={`Ends ${formatEndDate(end.toISOString())}`}
                    variant="outline"
                  />
                );
              })()}

              {/* Credit badge when zero */}
              {campaignSummary?.credit_amount === 0 && (
                <MobileBadge
                  icon={<AlertTriangle size={16} />}
                  label={"No credits"}
                  explanation={"There are no credits on this campaign. Tap 'Assign credits' to add credits."}
                  variant="destructive"
                />
              )}

              {/* Assign credits button (opens a dialog) */}
              <div>
                <Button size="sm" variant="secondary" className="h-8 inline-flex items-center" onClick={openAssignDialog} disabled={creditsLoading}>Assign credits</Button>
                <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign credits to campaign</DialogTitle>
                      <DialogDescription>
                        Enter the number of credits to assign to this campaign.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                      {/* Slider: min 100, max = user's current credits */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <div className="w-40 text-sm">{Number(assignAmount)} credits</div>
                          <div className="flex-1">
                            <Slider
                              min={100}
                              max={Number(currentCredits ?? (Number((user as any)?.credits ?? (user as any)?.credit_amount ?? 1000)))}
                              step={1}
                              value={[Number(assignAmount) || 100]}
                              onValueChange={(values) => setAssignAmount(values[0])}
                            />
                          </div>
                        </div>

                        {/* Min/Max labels under the slider */}
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>100 credits</span>
                          <span>{Number(currentCredits ?? (Number((user as any)?.credits ?? (user as any)?.credit_amount ?? 1000)))} credits</span>
                        </div>
                        {/* Duration slider */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="w-40 text-sm">{assignDurationDays} days</div>
                            <div className="flex-1">
                              <Slider
                                min={14}
                                max={90}
                                step={1}
                                value={[assignDurationDays]}
                                onValueChange={(values) => setAssignDurationDays(values[0])}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>14 days</span>
                            <span>90 days</span>
                          </div>

                          <div className="text-xs text-gray-600 mt-2">
                            {assignDurationDays > 0 && (
                              <span>Ends {formatEndDate(new Date(Date.now() + assignDurationDays * 24 * 60 * 60 * 1000).toISOString())}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button disabled={assignLoading || creditsLoading || Number(assignAmount) < 100} onClick={handleAssignCredits}>{assignLoading ? 'Assigning...' : 'Assign'}</Button>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <CardContent>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="mb-4 pt-6 md:pt-0">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-musinova-green data-[state=active]:text-white">Summary</TabsTrigger>
                  <TabsTrigger value="performance" className="data-[state=active]:bg-musinova-green data-[state=active]:text-white">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={campaignSummary.playlist_image_url}
                      alt={campaignSummary.playlist_name}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold">
                        {campaignSummary.playlist_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {campaignSummary.playlist_description}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Owner:</strong> {campaignSummary.playlist_owner}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Total Spend</h4>
                      <p className="text-lg font-bold text-gray-800">
                        {campaignSummary.spend || 0} / 
                        <span className="ml-2 text-sm font-medium text-gray-600">
                          {((campaignSummary.credit_budget ?? campaignSummary.credit_amount ?? 0)).toLocaleString()} credits
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">
                        Total Followers
                      </h4>
                      <p className="text-lg font-bold text-gray-800">
                        {campaignSummary.playlist_followers_total}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">
                        Total Tracks
                      </h4>
                      <p className="text-lg font-bold text-gray-800">
                        {campaignSummary.playlist_tracks_total}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Genre</h4>
                      <p className="text-lg font-bold text-gray-800">
                        {campaignSummary.campaign_genre || "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-gray-600">Moods</h4>
                      <p className="text-lg font-bold text-gray-800">
                        {campaignSummary.campaign_moods?.join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={timeSeriesData}
                      margin={{
                        top: 10,
                        right: isMobile ? 10 : 20,
                        left: isMobile ? 0 : 10,
                        bottom: isMobile ? 40 : 20,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="colorFollowers"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopColor="#5EA47C" stopOpacity={0.8} />
                          <stop
                            offset="95%"
                            stopColor="#5EA47C"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5A2B" stopOpacity={0.8} />
                          <stop
                            offset="95%"
                            stopColor="#8B5A2B"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="created_at"
                        tickFormatter={(tick) =>
                          new Date(tick).toLocaleDateString()
                        }
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? "end" : "middle"}
                        height={isMobile ? 60 : 30}
                      />
                      <YAxis
                        yAxisId="left"
                        width={isMobile ? 40 : 60}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        label={{
                          value: "Followers",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        width={isMobile ? 40 : 60}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        label={{
                          value: "Spend ($)",
                          angle: -90,
                          position: "insideRight",
                        }}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="followers_total"
                        stroke="#5EA47C"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorFollowers)"
                        yAxisId="left"
                      />
                      <Area
                        type="monotone"
                        dataKey="spend"
                        stroke="#8B5A2B"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSpend)"
                        yAxisId="right"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
};

export default Dashboard;
