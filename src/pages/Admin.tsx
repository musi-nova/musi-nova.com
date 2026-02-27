import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/api';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const baseUrl = import.meta.env.VITE_MN_API_BASE_URL;

// Cache object to store fetched data
const cache: Record<string, any> = {};


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


const Admin = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  // Fetch payments from `admin/payments` with caching
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await fetchWithCache('admin/payments', async () => {
          const response = await apiFetch('admin/payments');
          if (!response.ok) {
            throw new Error('Failed to fetch payments');
          }
          return response.json();
        });
        setPayments(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching payments');
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, []);

  // Fetch jobs from `admin/jobs`
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiFetch('admin/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);
        if (data.length > 0) {
          setSelectedJob(data[0].id); // Set the first job as the default selection
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch time series data for the selected job
  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      if (selectedJob === 'all') {
        setTimeSeriesData([]);
        return;
      }

      const selected = jobs.find((job) => job.id === selectedJob);
      if (selected?.playlist_id) {
        try {
          const response = await apiFetch(`admin/playlist/${selected.playlist_id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch time series data');
          }
          const data = await response.json();
          setTimeSeriesData(data);
        } catch (err) {
          console.error('Error fetching time series data:', err);
        }
      }
    };

    fetchTimeSeriesData();
  }, [selectedJob, jobs]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <PageLayout showSidebar={true} className="bg-musinova-cream/30 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-musinova-green mb-2">Admin Page</h1>
        <p className="text-gray-600">
          Welcome to the admin page. Here you can manage team settings and view analytics.
        </p>
      </div>

      <Tabs defaultValue="payments">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr>
                        <th className="border-b py-2">Campaign Name</th>
                        <th className="border-b py-2">Payment Type</th>
                        <th className="border-b py-2">Breakdown Ad Spend</th>
                        <th className='border-b py-2'>Campaign Spend (til now)</th>
                        <th className="border-b py-2">Campaign Start Date</th>
                        <th className="border-b py-2">Ad duration (days)</th>
                        <th className="border-b py-2">Paid</th>
                        <th className="border-b py-2">Created At</th>
                        <th className="border-b py-2">Smart URL</th>
                        <th className="border-b py-2">Stripe Payment Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="border-b py-2">{payment.campaign_name}</td>
                          <td className="border-b py-2">{payment.payment_type}</td>
                          <td className="border-b py-2">${payment.breakdown_ad_spend}</td>
                          <td className="border-b py-2">${payment.campaign_spend ? payment.campaign_spend : 'N/A'}</td>
                          <td className="border-b py-2">{payment.campaign_start_date}</td>
                          <td className="border-b py-2">{payment.one_time_duration}</td>
                          <td
                            className={`border-b py-2 ${!payment.paid ? 'bg-red-100 text-red-600 font-bold' : ''}`}
                          >
                            {payment.paid ? 'Yes' : 'No'}
                          </td>
                          <td className="border-b py-2">{new Date(payment.created_at).toLocaleDateString()}</td>
                          <td className="border-b py-2">
                            {payment.playlist_id ? (
                              <Button
                                className="text-sm md:text-base"
                                onClick={() => {
                                  const smartUrl = `${baseUrl}spotify/playlist/${payment.playlist_id}/smart-url`;
                                  window.open(smartUrl, '_blank'); // Open the Smart URL in a new tab
                                }}
                              >
                                Get Smart-URL
                              </Button>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td className="border-b py-2">
                            {payment.stripe_payment_id ? (
                              <Button
                                className="text-sm md:text-base"
                                onClick={() => {
                                  const stripeUrl = `https://dashboard.stripe.com/payments/${payment.stripe_payment_id}`;
                                  window.open(stripeUrl, '_blank'); // Open the Stripe payment link in a new tab
                                }}
                              >
                                Get Stripe Payment Link
                              </Button>
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No payments found/ Loading...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle>Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="job-select" className="font-medium text-sm md:text-base">
                  Select Campaign:
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

              {timeSeriesData.length > 0 ? (
                <div className="h-[300px] sm:h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeSeriesData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 20,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="created_at"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 10 }} width={40} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Area
                        type="monotone"
                        dataKey="followers_total"
                        name="Followers"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorFollowers)"
                      />
                      <Area
                        type="monotone"
                        dataKey="spend"
                        name="Spend ($)"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorSpend)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p>No data available for the selected job.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Admin;