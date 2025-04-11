
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { playlistCheckerTabs } from '@/config/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Music } from 'lucide-react';

const PlaylistCreator = () => {
  return (
    <PageLayout tabs={playlistCheckerTabs} className="bg-gray-50 py-6 md:py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-musinova-navy mb-2">Playlist Creator</h1>
          <p className="text-gray-600">
            Build the perfect promotional playlist from scratch.
          </p>
        </div>
        
        <Card className="bg-white shadow-sm border border-gray-200 mb-8">
          <CardContent className="pt-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Create Your Playlist</h2>
              <p className="text-gray-600 mb-6">
                Fill in the details below to start building your promotional playlist.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="playlistName" className="block text-sm font-medium mb-2">
                    Playlist Name
                  </label>
                  <Input
                    id="playlistName"
                    type="text" 
                    placeholder="e.g., Indie Rock 2025"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Keep it simple and relevant to your genre
                  </p>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="A brief description of your playlist..."
                    className="w-full min-h-[100px] border border-gray-300 rounded-md px-4 py-2"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="genre" className="block text-sm font-medium mb-2">
                    Primary Genre
                  </label>
                  <select
                    id="genre"
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  >
                    <option value="">Select a genre</option>
                    <option value="rock">Rock</option>
                    <option value="pop">Pop</option>
                    <option value="hiphop">Hip-Hop</option>
                    <option value="electronic">Electronic</option>
                    <option value="jazz">Jazz</option>
                    <option value="classical">Classical</option>
                    <option value="rnb">R&B</option>
                    <option value="country">Country</option>
                    <option value="folk">Folk</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Your Tracks (4-10 recommended)
                  </label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                      <Music size={18} className="text-musinova-green" />
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="Paste Spotify track URL"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-dashed border-gray-200 rounded-md bg-gray-50">
                      <Button variant="outline" className="w-full" size="sm">
                        <Plus size={16} className="mr-2" />
                        Add Another Track
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Similar Artists' Tracks (20-40 recommended)
                  </label>
                  
                  <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        Search for tracks from artists similar to your style
                      </p>
                      <Input
                        type="text"
                        placeholder="Search artists or tracks..."
                        className="mb-4"
                      />
                      <Button variant="outline" className="w-full">
                        <Music size={16} className="mr-2" />
                        Browse Similar Artists
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button className="btn-primary">
                Create Playlist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PlaylistCreator;
