import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Music, Play, Users, TrendingUp, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiFetch } from "@/lib/api";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Define a type for the job data
type Job = {
  id: string;
  playlist_id: string;
  playlist_name: string;
  campaign_id: string;
  artist_id: string; // Added artist_id
};

const cache: Record<string, any> = {}; // In-memory cache object

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
  campaign_id: string
) => {
  const cacheKey = `campaign-summary-${playlist_id}-${campaign_id}`;
  return fetchWithCache(cacheKey, async () => {
    try {
      const response = await apiFetch(
        `user/playlist/${playlist_id}/campaign/${campaign_id}/summary`
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
        playlist_description: "Spotify data is currently unavailable.",
        playlist_image_url: "/placeholder-image.png", // Replace with a valid placeholder image path
        spend: 0,
        playlist_followers_total: 0,
      };
    }
  });
};

// Function to fetch time series data
const fetchTimeSeriesData = async (
  playlist_id: string,
  campaign_id: string
) => {
  const cacheKey = `time-series-${playlist_id}-${campaign_id}`;
  return fetchWithCache(cacheKey, async () => {
    const response = await apiFetch(
      `user/playlist/${playlist_id}/campaign/${campaign_id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch time series data");
    }
    return response.json();
  });
};

// Function to fetch artist's top tracks
const fetchArtistTopTracks = async (artist_id: string) => {
  const cacheKey = `artist-top-tracks-${artist_id}`;
  return fetchWithCache(cacheKey, async () => {
    const response = await apiFetch(`user/artist/${artist_id}/top-tracks`);
    if (!response.ok) {
      throw new Error("Failed to fetch artist's top tracks");
    }
    return response.json();
  });
};

const Dashboard = () => {
  const [selectedJob, setSelectedJob] = useState("all");
  const [jobs, setJobs] = useState<
    {
      id: string;
      name: string;
      campaign_id?: string;
      playlist_id?: string;
      artist_id?: string;
    }[]
  >([]);
  const [campaignSummary, setCampaignSummary] = useState(null);
  const [topTracksData, setTopTracksData] = useState([]); // State for top tracks data
  const [timeSeriesData, setTimeSeriesData] = useState([]); // State for time series data
  const { user } = useAuth();
  const isMobile = useIsMobile();

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
            artist_id: job.artist_id, // Include artist_id
          };
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

  // Fetch campaign summary and time series data
  useEffect(() => {
    const fetchCampaignSummary = async () => {
      if (selectedJob === "all") {
        setCampaignSummary(null);
        setTimeSeriesData([]); // Reset time series data
        return;
      }
  
      const selected = jobs.find((job) => job.id === selectedJob);
      if (selected?.campaign_id) {
        try {
          // Fetch campaign summary
          const summary = await fetchCampaignSummaryData(
            selected.playlist_id,
            selected.campaign_id
          );
          console.log("Campaign Summary:", summary);
          setCampaignSummary(summary);
  
          // Fetch time series data
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
      }
    };
  
    fetchCampaignSummary();
  }, [selectedJob, jobs]);
  
  useEffect(() => {
    const fetchTopTracks = async () => {
      const selected = jobs.find((job) => job.id === selectedJob);
      if (selected?.artist_id) {
        try {
          const tracks = await fetchArtistTopTracks(selected.artist_id);
          setTopTracksData(tracks);
          console.log("Top Tracks Data:", tracks);
        } catch (error) {
          console.error("Error fetching artist's top tracks:", error);
        }
      } else {
        setTopTracksData([]); // Reset if no artist_id
      }
    };
  
    fetchTopTracks();
  }, [selectedJob, jobs]);

  return (
    <PageLayout
      showSidebar={true}
      className="bg-musinova-cream/30 py-4 md:py-8"
    >
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <h2 className="text-sm text-gray-600">
          Welcome back, {user?.user_name || "Musician"}! Here’s your dashboard.
        </h2>
      </div>

      {/* Job Selector */}
      <div className="mb-4 md:mb-8">
        <div className="flex items-center gap-2 md:gap-4">
          <label
            htmlFor="job-select"
            className="font-medium text-sm md:text-base"
          >
            Job:
          </label>
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
        </div>
      </div>

      {/* Render Campaign Summary */}
      {campaignSummary && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-4">Campaign Summary</h2>
          <Card className="bg-white p-4 rounded shadow-md">
            <CardContent>
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
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600">
                    Total Spend
                  </h4>
                  <p className="text-lg font-bold text-gray-800">
                    ${campaignSummary.spend}
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for Charts */}
      {timeSeriesData.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-4">Time Series Data</h2>
          <Tabs defaultValue="followers-vs-spend">
            <TabsList>
              <TabsTrigger value="followers-vs-spend">
                Followers vs Spend
              </TabsTrigger>
              <TabsTrigger value="impressions-vs-clicks">
                Impressions vs Clicks
              </TabsTrigger>
              <TabsTrigger value="top-tracks">Top Tracks</TabsTrigger>
            </TabsList>
            <TabsContent value="followers-vs-spend">
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
            <TabsContent value="impressions-vs-clicks">
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
                      id="colorImpressions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#8884d8"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorClicks"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#82ca9d"
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
                      value: "Impressions",
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
                      value: "Clicks",
                      angle: -90,
                      position: "insideRight",
                    }}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#8884d8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorImpressions)"
                    yAxisId="left"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                    yAxisId="right"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="top-tracks">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={topTracksData}
                  margin={{
                    top: 10,
                    right: isMobile ? 10 : 20,
                    left: isMobile ? 0 : 10,
                    bottom: isMobile ? 40 : 20,
                  }}
                >
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
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    label={{
                      value: "Popularity",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {Array.from(
                    new Map(
                      topTracksData.map((track) => [track.track_id, track])
                    ).keys()
                  ).map((trackId) => {
                    const track = topTracksData.find(
                      (t) => t.track_id === trackId
                    );
                    return (
                      <Line
                        key={trackId}
                        type="monotone"
                        dataKey={(data) =>
                          data.track_id === trackId
                            ? data.track_popularity
                            : null
                        }
                        name={track?.track_name || "Unknown Track"} // Use track_name for the legend
                        stroke={`#${Math.floor(
                          Math.random() * 16777215
                        ).toString(16)}`} // Random color for each line
                        strokeWidth={2}
                        connectNulls
                        dot={false}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </PageLayout>
  );
};

export default Dashboard;
