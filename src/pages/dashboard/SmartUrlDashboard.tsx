
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { dashboardTabs } from '@/config/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link2, PlusCircle, BarChart3, Trash2, ExternalLink, Eye, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const SmartUrlDashboard = () => {
  const [urlInput, setUrlInput] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Mock data for demo purposes
  const smartUrlStats = [
    { title: 'Total Smart URLs', value: '12', icon: <Link2 className="text-musinova-green" size={24} /> },
    { title: 'Total Clicks', value: '1,458', icon: <ExternalLink className="text-musinova-brown" size={24} /> },
    { title: 'Avg. Click Rate', value: '24%', icon: <BarChart3 className="text-musinova-navy" size={24} /> }
  ];

  const smartUrlList = [
    { 
      id: 1, 
      name: 'Summer Vibes', 
      originalUrl: 'https://spotify.com/playlist/12345678901234', 
      shortUrl: 'msnv.to/summer', 
      clicks: 342, 
      dateCreated: '2023-04-01', 
      tag: 'playlist'
    },
    { 
      id: 2, 
      name: 'New Release - Single', 
      originalUrl: 'https://spotify.com/track/abcdefghijk1234', 
      shortUrl: 'msnv.to/newrelease', 
      clicks: 156, 
      dateCreated: '2023-04-15', 
      tag: 'track'
    },
    { 
      id: 3, 
      name: 'Underground Mix', 
      originalUrl: 'https://spotify.com/playlist/567890abcdef', 
      shortUrl: 'msnv.to/underground', 
      clicks: 89, 
      dateCreated: '2023-05-10', 
      tag: 'playlist'
    },
  ];

  const tags = [
    { id: 'all', name: 'All URLs' },
    { id: 'playlist', name: 'Playlists' },
    { id: 'track', name: 'Tracks' },
    { id: 'album', name: 'Albums' },
  ];

  const handleCreateUrl = () => {
    if (!urlInput) {
      toast({
        title: "URL Required",
        description: "Please enter a Spotify URL to continue",
        variant: "destructive",
      });
      return;
    }

    // Validation logic would normally go here
    toast({
      title: "Smart URL Created",
      description: `Your smart URL ${customAlias ? `(${customAlias})` : ''} has been created successfully!`,
    });

    // Reset form
    setUrlInput('');
    setCustomAlias('');
  };

  const handleDelete = (id: number) => {
    toast({
      title: "URL Deleted",
      description: "The smart URL has been deleted successfully",
    });
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    toast({
      title: "URL Copied",
      description: "The smart URL has been copied to clipboard",
    });
  };

  // Mobile URL card for the responsive list view
  const MobileUrlCard = ({ url }: { url: typeof smartUrlList[0] }) => (
    <Card key={url.id} className="mb-3 bg-white border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-base">{url.name}</h3>
          <div 
            className="flex items-center text-musinova-navy hover:text-musinova-brown text-sm mt-1 mb-2"
            onClick={() => handleCopy(url.shortUrl)}
          >
            <span className="truncate">{url.shortUrl}</span>
            <Copy className="ml-1 h-3 w-3 cursor-pointer" />
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <div>Clicks: {url.clicks}</div>
          <div>{url.dateCreated}</div>
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-500"
            onClick={() => handleDelete(url.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout showSidebar={true} className="bg-musinova-cream/30 py-4 md:py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-3xl font-bold text-musinova-navy mb-2">
          Smart URLs
        </h1>
        <Button className="bg-musinova-green hover:bg-musinova-green/90 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> New Smart URL
        </Button>
      </div>

      {/* Stats Cards - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        {smartUrlStats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-sm">
            <CardContent className={`p-3 md:p-4 ${isMobile ? 'pt-4' : 'pt-6'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-musinova-darkgray/70">{stat.title}</p>
                  <h3 className="text-lg md:text-3xl font-bold text-musinova-darkgray mt-1">{stat.value}</h3>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-musinova-cream rounded-full flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create URL Section - Responsive layout */}
      <Card className="bg-white border-0 shadow-sm mb-4 md:mb-6">
        <CardHeader className="p-4 pb-0 md:pb-0">
          <CardTitle className="text-lg md:text-xl font-semibold">Create Smart URL</CardTitle>
          <CardDescription>Turn your Spotify links into memorable, trackable URLs</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="md:col-span-2">
              <label htmlFor="spotify-url" className="block text-sm font-medium mb-1 md:mb-2">Spotify URL</label>
              <Input 
                id="spotify-url" 
                placeholder="https://open.spotify.com/..." 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="bg-musinova-cream/50"
              />
            </div>
            <div>
              <label htmlFor="custom-alias" className="block text-sm font-medium mb-1 md:mb-2">Custom Alias (Optional)</label>
              <Input 
                id="custom-alias" 
                placeholder="e.g., mysong" 
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="bg-musinova-cream/50"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end p-4 pt-0">
          <Button 
            className="bg-musinova-green hover:bg-musinova-green/90 text-white"
            onClick={handleCreateUrl}
          >
            Create Smart URL
          </Button>
        </CardFooter>
      </Card>

      {/* URL List Section - Responsive handling */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between p-4 pb-2 md:pb-4">
          <div>
            <CardTitle className="text-lg md:text-xl font-semibold">Your Smart URLs</CardTitle>
            <CardDescription>Manage all your custom links</CardDescription>
          </div>
          <div className="mt-3 md:mt-0">
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {/* Desktop view: Table */}
          {!isMobile && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Smart URL</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Date Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smartUrlList
                    .filter(url => selectedTag === 'all' || url.tag === selectedTag)
                    .map((url) => (
                      <TableRow key={url.id}>
                        <TableCell className="font-medium">{url.name}</TableCell>
                        <TableCell>
                          <div 
                            className="text-musinova-navy hover:text-musinova-brown flex items-center cursor-pointer"
                            onClick={() => handleCopy(url.shortUrl)}
                          >
                            {url.shortUrl}
                            <Copy className="ml-1" size={14} />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{url.clicks}</TableCell>
                        <TableCell className="text-right">{url.dateCreated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500"
                              onClick={() => handleDelete(url.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Mobile view: Card-based list */}
          {isMobile && (
            <div>
              {smartUrlList
                .filter(url => selectedTag === 'all' || url.tag === selectedTag)
                .map((url) => (
                  <MobileUrlCard key={url.id} url={url} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default SmartUrlDashboard;
