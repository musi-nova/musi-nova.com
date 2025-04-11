import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  return (
    <PageLayout showSidebar={true} className="bg-musinova-cream/30 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-musinova-navy mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account and application preferences
        </p>
      </div>
      
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Name</label>
                      <Input defaultValue="John Doe" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input defaultValue="john.doe@example.com" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Current Password</label>
                      <Input type="password" />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">New Password</label>
                        <Input type="password" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
                        <Input type="password" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-musinova-green hover:bg-musinova-green/90">Save Changes</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <p className="text-center py-20 text-gray-500">Notification settings will appear here</p>
            </TabsContent>
            
            <TabsContent value="preferences">
              <p className="text-center py-20 text-gray-500">User preferences will appear here</p>
            </TabsContent>
            
            <TabsContent value="billing">
              <p className="text-center py-20 text-gray-500">Billing details will appear here</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Settings;
