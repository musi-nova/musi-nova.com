import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiFetch('user/settings');
        if (!response.ok) throw new Error('Failed to fetch settings data');
        const data = await response.json();
        setSettingsData(data);
        setName(data.user_name || '');
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleSave = async () => {
    try {
      // Update user
      const userRes = await apiFetch('user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: name, email }),
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
        user_name: updatedUser.user_name || name,
        email: updatedUser.email || email,
        team: { ...(prev.team || {}), name: updatedTeam.name || teamName },
      }));

      // Update auth context + localStorage
      try {
        updateUserStatus && updateUserStatus({ user_name: updatedUser.user_name || name, email: updatedUser.email || email });
        const stored = localStorage.getItem('musinova_user');
        if (stored) {
          const obj = JSON.parse(stored);
          obj.user_name = updatedUser.user_name || name;
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

  const handleChangePassword = async () => {
    // Basic validation
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
    // Only send the new password; we no longer require the current password
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

      {settingsData && (
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            {/* <TabsTrigger value="payments">Payments</TabsTrigger> */}
            <TabsTrigger value="team_members">Team Members</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Account Information</CardTitle>
                      <div>
                        <Button size="sm" onClick={async () => {
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
                      </div>
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
                    <button onClick={() => { setName(settingsData.user_name || ''); setEmail(settingsData.email || ''); setTeamName(settingsData.team?.name || ''); }} className="px-4 py-2 border rounded">Reset</button>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    {!showChangePassword && (
                      <button onClick={() => setShowChangePassword(true)} className="px-4 py-2 border rounded">Change password</button>
                    )}

                    {showChangePassword && (
                      <div className="space-y-3">
                        {/* We no longer require the current password */}

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

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {settingsData.payments.map((payment: any) => (
                  <div key={payment.id} className={`mb-4 border-b pb-4 p-6 rounded-lg ${!payment.paid ? 'bg-red-100' : ''}`}>
                    <p><strong>Payment Type:</strong> {payment.payment_type}</p>
                    <p><strong>Campaign:</strong> {payment.campaign_name}</p>
                    <p><strong>Musi Nova Fee:</strong> ${payment.breakdown_musi_nova_fee}</p>
                    <p><strong>Ad Spend:</strong> ${payment.breakdown_ad_spend}</p>
                    <p><strong>Total Charge:</strong> ${payment.breakdown_total_charge}</p>
                    <p><strong>Paid:</strong> {payment.paid ? 'Yes' : 'No'}</p>
                    <p><strong>Created At:</strong> {new Date(payment.created_at).toLocaleDateString()}</p>
                    {payment.updated_at && (<p><strong>Updated At:</strong> {new Date(payment.updated_at).toLocaleDateString()}</p>)}
                  </div>
                ))}
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