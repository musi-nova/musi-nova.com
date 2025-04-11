import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Music, Play, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState("all");
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const playlists = [
    { id: "all", name: "All Playlists" },
    { id: "indie2024", name: "Indie Rock 2024" },
    { id: "popfinds", name: "Fresh Pop Finds" },
    { id: "chillvibes", name: "Chill Vibes" },
  ];
  
  const activeCampaigns = [
    {
      name: "Indie Rock 2024",
      budget: "$150/month",
      progress: 75,
      daysLeft: 21
    },
    {
      name: "Fresh Pop Finds",
      budget: "$75/month",
      progress: 25,
      daysLeft: 7
    }
  ];

  return (
    <PageLayout showSidebar={true} className="bg-musinova-cream/30 py-4 md:py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-musinova-navy mb-2">
            Welcome, {user?.name || 'Musician'}!
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Here's an overview of your campaigns
          </p>
        </div>
        
        <Link to="/campaigns/new" className="mt-3 md:mt-0">
          <Button className="w-full md:w-auto bg-musinova-brown hover:bg-musinova-brown/90 text-white">
            <Play className="mr-2 h-4 w-4" /> Start Campaign
          </Button>
        </Link>
      </div>
      
      <div className="mb-4 md:mb-8">
        <div className="flex items-center gap-2 md:gap-4">
          <label htmlFor="playlist-select" className="font-medium text-sm md:text-base">Playlist:</label>
          <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
            <SelectTrigger className="w-full md:w-56 text-sm">
              <SelectValue placeholder="Select playlist" />
            </SelectTrigger>
            <SelectContent>
              {playlists.map(playlist => (
                <SelectItem key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mb-4 md:mb-8">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="pt-4 md:pt-6 p-2 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-musinova-darkgray/70">Active Campaigns</p>
                <h3 className="text-xl md:text-3xl font-bold text-musinova-darkgray mt-1">2</h3>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 bg-musinova-cream rounded-full flex items-center justify-center">
                <Music size={isMobile ? 16 : 24} className="text-musinova-brown" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="pt-4 md:pt-6 p-2 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-musinova-darkgray/70">Total Plays</p>
                <h3 className="text-xl md:text-3xl font-bold text-musinova-darkgray mt-1">1,234</h3>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 bg-musinova-cream rounded-full flex items-center justify-center">
                <Play size={isMobile ? 16 : 24} className="text-musinova-green" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="pt-4 md:pt-6 p-2 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-musinova-darkgray/70">New Followers</p>
                <h3 className="text-xl md:text-3xl font-bold text-musinova-darkgray mt-1">56</h3>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 bg-musinova-cream rounded-full flex items-center justify-center">
                <Users size={isMobile ? 16 : 24} className="text-musinova-navy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="pt-4 md:pt-6 p-2 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-musinova-darkgray/70">Growth Rate</p>
                <h3 className="text-xl md:text-3xl font-bold text-green-600 mt-1">+12%</h3>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 bg-musinova-cream rounded-full flex items-center justify-center">
                <TrendingUp size={isMobile ? 16 : 24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 bg-white border-0 shadow-sm">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-lg md:text-xl font-semibold">Campaign Performance</CardTitle>
            <p className="text-xs md:text-sm text-gray-500">Daily plays and engagement metrics</p>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="h-48 md:h-80 flex items-center justify-center bg-gray-50 rounded-md">
              <div className="text-center text-gray-500">
                <BarChart3 size={isMobile ? 32 : 48} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Performance chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-lg md:text-xl font-semibold">Active Campaigns</CardTitle>
            <p className="text-xs md:text-sm text-gray-500">Currently running promotions</p>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="space-y-3 md:space-y-6">
              {activeCampaigns.map((campaign, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3 md:p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm md:text-base text-musinova-brown">{campaign.name}</h3>
                    <span className="text-xs md:text-sm text-gray-600">{campaign.budget}</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2 my-2" />
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>{campaign.progress}% complete</span>
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
