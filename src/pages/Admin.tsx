import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiFetch } from '@/lib/api';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const Admin = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  // Fetch payments from `admin/payments`
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await apiFetch('admin/payments');
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
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
        <h1 className="text-3xl font-bold text-musinova-navy mb-2">Admin Page</h1>
        <p className="text-gray-600">
          Welcome to the admin page. Here you can manage team settings and view analytics.
        </p>
      </div>

      <Tabs defaultValue="payments">
        <TabsList>
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
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b py-2">Campaign Name</th>
                      <th className="border-b py-2">Payment Type</th>
                      <th className="border-b py-2">Breakdown Ad Spend</th>
                      <th className="border-b py-2">Ad duration (days)</th>
                      {/* <th className="border-b py-2">Breakdown Musi Nova Fee</th> */}
                      {/* <th className="border-b py-2">Breakdown Total Charge</th> */}
                      {/* <th className="border-b py-2">Stripe Checkout Session Id</th> */}
                      {/* <th className="border-b py-2">Stripe Payment Id</th> */}
                      {/* <th className="border-b py-2">Stripe Subscription Id</th> */}
                      <th className="border-b py-2">Paid</th>
                      <th className="border-b py-2">Created At</th>
                      <th className="border-b py-2">Stripe Payment Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="border-b py-2">{payment.campaign_name}</td>
                        <td className="border-b py-2">{payment.payment_type}</td>
                        <td className="border-b py-2">${payment.breakdown_ad_spend}</td>
                        <td className="border-b py-2">{payment.one_time_duration}</td>
                        {/* Uncomment if needed */}
                        {/* <td className="border-b py-2">${payment.breakdown_musi_nova_fee}</td> */}
                        {/* <td className="border-b py-2">${payment.breakdown_total_charge}</td> */}
                        {/* <td className="border-b py-2">{payment.stripe_checkout_session_id}</td> */}
                        {/* <td className="border-b py-2">{payment.stripe_payment_id}</td> */}
                        {/* <td className="border-b py-2">{payment.stripe_subscription_id}</td> */}
                        <td
                          className={`border-b py-2 ${!payment.paid ? 'bg-red-100 text-red-600 font-bold' : ''
                            }`}
                        >
                          {payment.paid ? 'Yes' : 'No'}
                        </td>
                        <td className="border-b py-2">{new Date(payment.created_at).toLocaleDateString()}</td>
                        <td className="border-b py-2">
                          {payment.stripe_payment_id ? (
                            <a
                              href={`https://dashboard.stripe.com/payments/${payment.stripe_payment_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline hover:text-blue-700"
                            >
                              View in Stripe
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No payments found.</p>
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
                  Select Job:
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
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart
                    data={timeSeriesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                    <XAxis dataKey="created_at" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="followers_total"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorFollowers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="spend"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorSpend)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
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