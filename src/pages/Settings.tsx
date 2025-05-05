import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/api'; // Replace with your actual API fetch utility

const Settings = () => {
  const [settingsData, setSettingsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiFetch('user/settings'); // Use apiFetch instead of fetch
        if (!response.ok) {
          throw new Error('Failed to fetch settings data');
        }
        const data = await response.json();
        console.log('Settings data:', data); // Debugging line
        setSettingsData(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching settings data');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <PageLayout showSidebar={true} className="bg-musinova-cream/30 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-musinova-navy mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account and application preferences
        </p>
      </div>

      {settingsData && (
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="team_members">Team Members</TabsTrigger> {/* New Tab */}
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Name:</strong> {settingsData.user_name}</p>
                <p><strong>Email:</strong> {settingsData.email}</p>
                <p><strong>Team:</strong> {settingsData.team.name}</p>
                <p><strong>User Created:</strong> {new Date(settingsData.created_at).toLocaleDateString()}</p>
                <p><strong>Team Created:</strong> {new Date(settingsData.team.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {settingsData.payments.map((payment: any) => (
                  <div key={payment.id} className="mb-4 border-b pb-4">
                    <p><strong>Payment Type:</strong> {payment.payment_type}</p>
                    <p><strong>Campaign:</strong> {payment.campaign_name}</p>
                    <p><strong>Musi Nova Fee:</strong> ${payment.breakdown_musi_nova_fee}</p>
                    <p><strong>Ad Spend:</strong> ${payment.breakdown_ad_spend}</p>
                    <p><strong>Total Charge:</strong> ${payment.breakdown_total_charge}</p>
                    <p><strong>Paid:</strong> {payment.paid ? 'Yes' : 'No'}</p>
                    <p><strong>Created At:</strong> {new Date(payment.created_at).toLocaleDateString()}</p>
                    {payment.updated_at && (
                      <p><strong>Updated At:</strong> {new Date(payment.updated_at).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
                {/* Add a button linking to the /help page */}
                <div className="mt-4">
                  <a
                    href="/help"
                    className="inline-block px-4 py-2 bg-musinova-navy text-white rounded hover:bg-musinova-navy/90"
                  >
                    Need help stopping a subscription?
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team_members"> {/* New Tab Content */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                {settingsData.team_members.map((member: any) => (
                  <div key={member.id} className="mb-4 border-b pb-4">
                    <p><strong>Name:</strong> {member.user_name}</p>
                    <p><strong>Email:</strong> {member.email}</p>
                    <p><strong>Joined:</strong> {new Date(member.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </PageLayout>
  );
};

export default Settings;