
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, CheckSquare, Music } from 'lucide-react';
import { playlistCheckerTabs } from '@/config/navigation';

const PlaylistChecker = () => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<null | {
    passed: boolean;
    checks: { name: string; passed: boolean; message: string }[];
  }>(null);

  const handleCheckPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playlistUrl) return;
    
    setIsChecking(true);
    
    // Simulate API call to check playlist
    setTimeout(() => {
      // Mock check result - in a real app this would come from your backend
      const result = {
        passed: true,
        checks: [
          { 
            name: 'Similar artists', 
            passed: true, 
            message: 'Your playlist includes similar artists that complement your style.' 
          },
          { 
            name: 'Simple name', 
            passed: true, 
            message: 'Your playlist name is simple and appropriate for your genre.' 
          },
          { 
            name: 'Profile picture', 
            passed: true, 
            message: 'Your playlist has an attractive profile picture.' 
          },
          { 
            name: 'Song count', 
            passed: false, 
            message: 'Your playlist has 65 songs. Reduce to 30-50 songs for optimal promotion.' 
          },
          { 
            name: 'Own songs distribution', 
            passed: true, 
            message: 'Your own songs are well distributed throughout the playlist.' 
          }
        ]
      };
      
      setCheckResult(result);
      setIsChecking(false);
    }, 1500);
  };

  const resetChecker = () => {
    setPlaylistUrl('');
    setCheckResult(null);
  };

  return (
    <PageLayout tabs={playlistCheckerTabs} className="bg-gray-50 py-6 md:py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-musinova-navy mb-2">Playlist Checker</h1>
          <p className="text-gray-600">
            Verify your playlist is optimized for promotion before launching your campaign.
          </p>
        </div>
        
        {!checkResult ? (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="pt-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Is your playlist ready for promotion?</h2>
                <p className="text-gray-600 mb-6">
                  An optimized playlist is crucial for successful promotion. We'll check your playlist against our promotion criteria.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckSquare size={20} className="text-musinova-green mt-0.5" />
                    <div>
                      <p className="font-medium">Similar Artists</p>
                      <p className="text-gray-600 text-sm">Include artists that are similar to your style</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckSquare size={20} className="text-musinova-green mt-0.5" />
                    <div>
                      <p className="font-medium">Simple Playlist Name</p>
                      <p className="text-gray-600 text-sm">Use a simple name fitting your genre (e.g. "Indie Rock 2025")</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckSquare size={20} className="text-musinova-green mt-0.5" />
                    <div>
                      <p className="font-medium">Professional Profile Picture</p>
                      <p className="text-gray-600 text-sm">Create an attractive cover image for your playlist</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckSquare size={20} className="text-musinova-green mt-0.5" />
                    <div>
                      <p className="font-medium">Optimal Song Count</p>
                      <p className="text-gray-600 text-sm">Include 30-50 songs in your playlist</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckSquare size={20} className="text-musinova-green mt-0.5" />
                    <div>
                      <p className="font-medium">Your Own Songs</p>
                      <p className="text-gray-600 text-sm">Include 4-10 of your own songs, distributed throughout</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleCheckPlaylist}>
                <div className="mb-6">
                  <label htmlFor="playlistUrl" className="block text-sm font-medium mb-2">
                    Paste your Spotify playlist link
                  </label>
                  <Input
                    id="playlistUrl"
                    type="url" 
                    placeholder="https://open.spotify.com/playlist/..."
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isChecking || !playlistUrl}
                  >
                    {isChecking ? 'Checking...' : 'Check Playlist'}
                  </Button>
                </div>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Don't have a playlist yet? <Link to="/playlist-creator" className="text-musinova-green hover:underline">Learn how to create an effective playlist</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="pt-6">
              <div className="mb-6 text-center">
                {checkResult.passed ? (
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Congratulations!</h2>
                    <p className="text-gray-600">
                      Your playlist is approved! It meets most of our criteria for successful promotion.
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={32} className="text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Almost There!</h2>
                    <p className="text-gray-600">
                      Your playlist needs some improvements before it's ready for promotion.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4 mb-8">
                {checkResult.checks.map((check, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    {check.passed ? (
                      <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{check.name}</p>
                      <p className="text-gray-600 text-sm">{check.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button 
                  variant="outline" 
                  onClick={resetChecker}
                  className="flex items-center justify-center"
                >
                  <ArrowLeft size={16} className="mr-2" /> Check Another Playlist
                </Button>
                
                {checkResult.passed ? (
                  <Link to="/campaigns/new">
                    <Button className="btn-primary w-full sm:w-auto">
                      Launch Campaign <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant="outline" 
                    className="border-musinova-red text-musinova-red hover:bg-musinova-red/10"
                    onClick={resetChecker}
                  >
                    Fix Issues & Try Again
                  </Button>
                )}
              </div>
              
              {checkResult.passed && (
                <div className="mt-8 p-4 bg-musinova-cream rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Music size={18} className="mr-2" />
                    Our Service At A Glance
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-musinova-green mt-0.5" />
                      <span>We custom create ads for your playlist</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-musinova-green mt-0.5" />
                      <span>We adjust and refine your ads daily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-musinova-green mt-0.5" />
                      <span>We provide excellent customer support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-musinova-green mt-0.5" />
                      <span>We take 45% of ad budget up to $100, only 35% above $100</span>
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default PlaylistChecker;
