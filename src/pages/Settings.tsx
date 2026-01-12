import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Simple BillingHistory component (kept inline to avoid new files)
const BillingHistory = () => {
  const [history, setHistory] = React.useState<any[] | null>(null);
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [historyError, setHistoryError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      setHistoryError(null);
      try {
        const res = await apiFetch('stripe/billing-history');
        if (!res.ok) throw new Error('Failed to fetch billing history');
        const data = await res.json();
        // New API may return an array directly or { history: [...] }
        const list = Array.isArray(data) ? data : data?.history || [];
        setHistory(list);
      } catch (err: any) {
        console.error('Billing history error', err);
        setHistoryError(err?.message || 'Failed to load billing history');
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  if (loadingHistory) return <p>Loading billing history...</p>;
  if (historyError) return <p className="text-red-600">{historyError}</p>;
  if (!history || history.length === 0) return <p>No billing history found.</p>;

  return (
    <div className="space-y-3">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pb-2">Date</th>
            <th className="pb-2">Description</th>
            <th className="pb-2">Amount</th>
            <th className="pb-2">Currency</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h: any) => {
            const amount = h.amount != null ? Number(h.amount) / 100 : 0;
            const currency = (h.currency || '').toUpperCase();
            const dateStr = h.date ? new Date(h.date * 1000).toLocaleString() : '';
            return (
              <tr key={h.id} className="border-t">
                <td className="py-2">{dateStr}</td>
                <td className="py-2">{'One-time purchase'}</td>
                <td className="py-2">${amount.toFixed(2)}</td>
                <td className="py-2">{currency}</td>
                <td className="py-2">
                  {h.status === 'succeeded' ? (
                    <CheckCircle className="text-green-600" size={18} />
                  ) : h.status === 'pending' ? (
                    <Clock className="text-yellow-600" size={18} />
                  ) : (
                    <XCircle className="text-red-600" size={18} />
                  )}
                </td>
                <td className="py-2">
                  {h.receipt_url ? (
                    <Button size="sm" onClick={() => window.open(h.receipt_url, '_blank')} className="bg-musinova-green text-white">View receipt</Button>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Settings = () => {
  const [settingsData, setSettingsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUserStatus, login } = useAuth();
  const { toast } = useToast();

  // Editable form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [teamName, setTeamName] = useState('');

  // Password change state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiFetch('user/settings');
        if (!response.ok) throw new Error('Failed to fetch settings data');
        const data = await response.json();
        setSettingsData(data);
        setName(data.name || '');
        setEmail(data.email || '');
        setTeamName(data.team?.name || '');
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching settings data');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Render the page layout even while loading so the sidebar remains visible.
  // Show a centered loading state or an inline error inside the content area.
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-musinova-green" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 bg-red-50 border border-red-100 rounded">
          <h3 className="text-lg font-semibold text-red-700">Error loading settings</h3>
          <p className="text-sm text-red-600">{error}</p>
          <div className="mt-4">
            <Button onClick={() => { setLoading(true); setError(null); (async () => {
              try {
                const response = await apiFetch('user/settings');
                if (!response.ok) throw new Error('Failed to fetch settings data');
                const data = await response.json();
                setSettingsData(data);
                setName(data.name || '');
                setEmail(data.email || '');
                setTeamName(data.team?.name || '');
              } catch (err: any) {
                setError(err.message || 'An error occurred while fetching settings data');
              } finally {
                setLoading(false);
              }
            })(); }}>Retry</Button>
          </div>
        </div>
      );
    }

    return null; // normal content will be rendered below
  };

  const handleSave = async () => {
    try {
      // Update user
      const userRes = await apiFetch('user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email }),
      });
      if (!userRes.ok) throw new Error('Failed to update user');
      const updatedUser = await userRes.json();

      // Update user access_token based on updatedUser.access_token
      localStorage.setItem('access_token', updatedUser.access_token);

      // Update team
      const teamRes = await apiFetch('team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName }),
      });
      if (!teamRes.ok) throw new Error('Failed to update team');
      const updatedTeam = await teamRes.json();

      // Update local state
      setSettingsData((prev: any) => ({
        ...prev,
        name: updatedUser.name || name,
        email: updatedUser.email || email,
        team: { ...(prev.team || {}), name: updatedTeam.name || teamName },
      }));

      // Update auth context + localStorage
      try {
        updateUserStatus && updateUserStatus({ name: updatedUser.name || name, email: updatedUser.email || email });
        const stored = localStorage.getItem('musinova_user');
        if (stored) {
          const obj = JSON.parse(stored);
          obj.name = updatedUser.name || name;
          obj.email = updatedUser.email || email;
          localStorage.setItem('musinova_user', JSON.stringify(obj));
        }
      } catch (err) {
        // ignore
      }

      toast({ title: 'Success', description: 'Settings updated successfully' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update settings', variant: 'destructive' });
    }
  };

  // TODO: actually implement password change API
  const handleChangePassword = async () => {
    // Basic validation
    if (!currentPassword) {
      toast({ title: 'Error', description: 'Please enter your current password', variant: 'destructive' });
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast({ title: 'Error', description: 'Please fill new password fields', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: 'Error', description: 'Password should be at least 8 characters', variant: 'destructive' });
      return;
    }

    try {
    // Re-authenticate the user with their current password before changing
    try {
      if (!email) throw new Error('No email available for reauthentication');
      await login(email, currentPassword);
    } catch (reauthErr: any) {
      toast({ title: 'Error', description: 'Current password is incorrect', variant: 'destructive' });
      return;
    }

    // Only send the new password to the API; reauthentication already verified the current password
    const payload: any = { new_password: newPassword };

      const res = await apiFetch('user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to change password');
      }

      toast({ title: 'Success', description: 'Password updated successfully' });

      // If we have the user's email in the form state, re-login to refresh token and musinova_user
      try {
        if (email) {
          await login(email, newPassword);
        }
      } catch (loginErr) {
        console.warn('Re-login after password change failed:', loginErr);
      }

  // clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Could not change password', variant: 'destructive' });
    }
  };

  return (
    <PageLayout showSidebar={true} className="bg-musinova-cream/30 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-musinova-navy mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      {loading || error ? (
        <div className="mb-4">{renderContent()}</div>
      ) : settingsData ? (
        <Tabs defaultValue="account">
          <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
            <TabsTrigger value="team_members">Team Members</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <CardTitle>Account Information</CardTitle>
                      {/* <div>
                        <Button size="sm" className="w-full sm:w-auto" onClick={async () => {
                          try {
                            const res = await apiFetch('stripe/customer-portal');
                            if (!res.ok) throw new Error('Failed to open customer portal');
                            const data = await res.json();
                            if (data?.url) {
                              window.open(data.url, '_blank');
                            } else {
                              throw new Error('No URL returned from customer portal');
                            }
                          } catch (err: any) {
                            toast({ title: 'Error', description: err?.message || 'Could not open customer portal', variant: 'destructive' });
                          }
                        }}>Stripe Customer Portal</Button>
                      </div> */}
                    </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Team Name</label>
                    <input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full p-2 border rounded" />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSave} className="px-4 py-2 bg-musinova-green text-white rounded">Save</button>
                    <button onClick={() => { setName(settingsData.name || ''); setEmail(settingsData.email || ''); setTeamName(settingsData.team?.name || ''); }} className="px-4 py-2 border rounded">Reset</button>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    {!showChangePassword && (
                      <button onClick={() => setShowChangePassword(true)} className="px-4 py-2 border rounded">Change password</button>
                    )}

                    {showChangePassword && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Current password</label>
                          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-2 border rounded" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">New password</label>
                          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Confirm new password</label>
                          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded" />
                        </div>

                        <div className="flex gap-3">
                          <button onClick={handleChangePassword} className="px-4 py-2 bg-musinova-green text-white rounded">Update password</button>
                          <button onClick={() => { setShowChangePassword(false); setNewPassword(''); setConfirmPassword(''); }} className="px-4 py-2 border rounded">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <BillingHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team_members">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                {settingsData.team_members.map((member: any) => (
                  <div key={member.id} className="mb-4 border-b pb-4">
                    <p><strong>Name:</strong> {member.name}</p>
                    <p><strong>Email:</strong> {member.email}</p>
                    <p><strong>Joined:</strong> {new Date(member.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : null }
    </PageLayout>
  );
};

export default Settings;