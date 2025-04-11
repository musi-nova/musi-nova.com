
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Music, Plus, Play, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Playlists = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-playlists");
  const isMobile = useIsMobile();
  
  const myPlaylists = [
    {
      id: "indie2024",
      name: "Indie Rock 2024",
      songs: 42,
      followers: 156,
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200"
    }, 
    {
      id: "popfinds",
      name: "Fresh Pop Finds",
      songs: 35,
      followers: 89,
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=200"
    }, 
    {
      id: "chillvibes",
      name: "Chill Vibes",
      songs: 28,
      followers: 213,
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200"
    }
  ];
  
  const featuredPlaylists = [
    {
      id: "indie-rising",
      name: "Indie Rising Stars",
      songs: 50,
      followers: 1245,
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200"
    }, 
    {
      id: "electronic-beats",
      name: "Electronic Beats 2024",
      songs: 45,
      followers: 2389,
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200"
    }
  ];
  
  return (
    <PageLayout showSidebar={true} className="bg-musinova-cream/30 py-4 md:py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-musinova-navy mb-2">
            {user?.name}'s Playlists
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage and monitor all your playlists
          </p>
        </div>
        
        <Link to="/playlist-creator" className="mt-3 md:mt-0">
          <Button className="w-full md:w-auto bg-musinova-brown hover:bg-musinova-brown/90 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create Playlist
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="my-playlists" onValueChange={setActiveTab} className="mb-4 md:mb-8">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger className="flex-1 md:flex-none text-sm" value="my-playlists">My Playlists</TabsTrigger>
          <TabsTrigger className="flex-1 md:flex-none text-sm" value="promoted">Promoted</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-playlists">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mt-3 md:mt-6">
            {myPlaylists.map(playlist => (
              <Card key={playlist.id} className="overflow-hidden border-0 shadow-sm">
                <div className="h-28 md:h-36 bg-gray-200 relative">
                  <img src={playlist.image} alt={playlist.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="rounded-full bg-white/20 text-white hover:bg-white/40 hover:text-white">
                      <Play className="h-6 w-6 md:h-8 md:w-8" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="pt-3 md:pt-4 p-3 md:p-4">
                  <h3 className="font-medium text-base md:text-lg mb-1">{playlist.name}</h3>
                  <div className="flex justify-between text-xs md:text-sm text-gray-500">
                    <div className="flex items-center">
                      <Music className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      {playlist.songs} songs
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      {playlist.followers} followers
                    </div>
                  </div>
                  
                  <div className="mt-3 md:mt-4 flex justify-between">
                    <Button variant="outline" size={isMobile ? "sm" : "default"}>Edit</Button>
                    <Link to={`/campaigns/new?playlist=${playlist.id}`}>
                      <Button size={isMobile ? "sm" : "default"}>Promote</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="flex flex-col items-center justify-center p-4 md:p-8 text-center h-full border-dashed border-2 border-gray-300 bg-white/50 shadow-none">
              <Plus className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-4" />
              <h3 className="font-medium text-gray-700 mb-1 md:mb-2 text-sm md:text-base">Create a new playlist</h3>
              <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4">
                Add your favorite tracks and share
              </p>
              <Link to="/playlist-creator">
                <Button variant="outline" size={isMobile ? "sm" : "default"}>Get Started</Button>
              </Link>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="featured">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mt-3 md:mt-6">
            {featuredPlaylists.map(playlist => (
              <Card key={playlist.id} className="overflow-hidden border-0 shadow-sm">
                <div className="h-28 md:h-36 bg-gray-200 relative">
                  <img src={playlist.image} alt={playlist.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="rounded-full bg-white/20 text-white hover:bg-white/40 hover:text-white">
                      <Play className="h-6 w-6 md:h-8 md:w-8" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="pt-3 md:pt-4 p-3 md:p-4">
                  <h3 className="font-medium text-base md:text-lg mb-1">{playlist.name}</h3>
                  <div className="flex justify-between text-xs md:text-sm text-gray-500">
                    <div className="flex items-center">
                      <Music className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      {playlist.songs} songs
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      {playlist.followers} followers
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="promoted">
          <div className="py-8 md:py-12 text-center">
            <Music className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-300 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-medium text-gray-600 mb-2">No promoted playlists yet</h3>
            <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
              Start promoting your playlists to grow your audience
            </p>
            <Link to="/campaigns/new">
              <Button>Create Campaign</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Playlists;
