import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiFetch } from '@/lib/api'; // Replace with your actual API fetch utility

const Admin = () => {
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

  // Check if the user belongs to the specific team
  if (settingsData.team.id !== '3d19423e-d150-4819-9a63-20714899f425') {
    return <p>You do not have access to this page.</p>;
  }

  return (
    <PageLayout showSidebar={true} className="bg-musinova-cream/30 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-musinova-navy mb-2">Admin Page</h1>
        <p className="text-gray-600">
          Welcome to the admin page. Here you can manage team settings and other administrative tasks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Team Name:</strong> {settingsData.team.name}</p>
          <p><strong>Team Created:</strong> {new Date(settingsData.team.created_at).toLocaleDateString()}</p>
          <p><strong>Team ID:</strong> {settingsData.team.id}</p>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Here you can add admin-specific actions or features.</p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Admin;