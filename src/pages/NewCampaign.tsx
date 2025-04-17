import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import Register from './auth/Register';
import { apiFetch } from '@/lib/api';
import { set, sub } from 'date-fns';


const NewCampaign = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasPlaylist, setHasPlaylist] = useState<string | null>(null);
  const [hasArtist, setHasArtist] = useState<string | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [artistUrl, setArtistUrl] = useState('');
  const [trackUrl, setTrackUrl] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [paymentType, setPaymentType] = useState<'subscription' | 'one-time'>('subscription');
  const [subscriptionAmount, setSubscriptionAmount] = useState(150);
  const [oneTimeAmount, setOneTimeAmount] = useState(150);
  const [oneTimeDuration, setOneTimeDuration] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthStep, setShowAuthStep] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
// Check if the user is authenticated
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Redirect to the /register page if no access token is found
      navigate('/login');
    } else if (!isAuthenticated) {
      setShowAuthStep(true);
    } else {
      setShowAuthStep(false);
    }
  }, [isAuthenticated, navigate]);

  const extractPlaylistId = (url: string): string | null => {
    try {
      const regex = /playlist\/([a-zA-Z0-9]+)/; // Match "playlist/" followed by alphanumeric characters
      const match = url.match(regex);
      return match ? match[1] : null; // Return the playlist ID if found, otherwise null
    } catch (error) {
      console.error('Error extracting playlist ID:', error);
      return null;
    }
  };

  const extractArtistId = (url: string): string | null => {
    try {
      const regex = /artist\/([a-zA-Z0-9]+)/; // Match "playlist/" followed by alphanumeric characters
      const match = url.match(regex);
      return match ? match[1] : null; // Return the playlist ID if found, otherwise null
    } catch (error) {
      console.error('Error extracting playlist ID:', error);
      return null;
    }
  };

  const extractTrackId = (url: string): string | null => {
    try {
      const regex = /track\/([a-zA-Z0-9]+)/; // Match "playlist/" followed by alphanumeric characters
      const match = url.match(regex);
      return match ? match[1] : null; // Return the playlist ID if found, otherwise null
    }
    catch (error) {
      console.error('Error extracting playlist ID:', error);
      return null;
    }
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const campaignData = {
      campaignName,
      playlistId: extractPlaylistId(playlistUrl),
      artistId: extractArtistId(artistUrl),
      trackId: extractTrackId(trackUrl),
      createdAt: new Date().toISOString(),
    };
    console.log('Campaign Data:', campaignData);
  
    try {
      // Post the campaign data to the API
      const response = await apiFetch('user/campaign/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create campaign: ${response.statusText}`);
      }
  
      const responseData = await response.json();
  
      toast({
        title: "Campaign created!",
        description: "Your new campaign has been successfully launched.",
      });
  
      console.log('Campaign created successfully:', responseData);
  
      // Move to the next step
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "There was an issue creating your campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate the correct total number of steps
  const totalSteps = showAuthStep ? 6 : 5;
  
  // Adjust currentStep display for the additional auth step
  const displayStep = (step: number) => {
    if (showAuthStep && step > 1) {
      return step;
    }
    return showAuthStep ? step : step + 1;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-musinova-navy mb-2">Create New Campaign</h1>
            <p className="text-gray-600">
              Alrighty{user && <span className="ml-1">{user?.user_name || "Musician"}</span>},
              let's set up your music promotion campaign in a few simple steps!
              
            </p>
          </div>
          
          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="w-full absolute top-1/2 h-1 bg-gray-200 -z-10"></div>
              
              <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-musinova-green' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mb-1 ${currentStep >= 1 ? 'bg-musinova-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className="text-xs">Start</span>
              </div>
              
              {showAuthStep && (
                <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-musinova-green' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mb-1 ${currentStep >= 2 ? 'bg-musinova-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2
                  </div>
                  <span className="text-xs">Account</span>
                </div>
              )}
              
              <div className={`flex flex-col items-center ${currentStep >= (showAuthStep ? 3 : 2) ? 'text-musinova-green' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mb-1 ${currentStep >= (showAuthStep ? 3 : 2) ? 'bg-musinova-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {showAuthStep ? 3 : 2}
                </div>
                <span className="text-xs">Playlist</span>
              </div>

              <div className={`flex flex-col items-center ${currentStep >= (showAuthStep ? 4 : 3) ? 'text-musinova-green' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mb-1 ${currentStep >= (showAuthStep ? 4 : 3) ? 'bg-musinova-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {showAuthStep ? 4 : 3}
                </div>
                <span className="text-xs">Artist</span>
              </div>
              
              <div className={`flex flex-col items-center ${currentStep >= (showAuthStep ? 5 : 4) ? 'text-musinova-green' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mb-1 ${currentStep >= (showAuthStep ? 5 : 4) ? 'bg-musinova-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {showAuthStep ? 5 : 4}
                </div>
                <span className="text-xs">Details</span>
              </div>
              
              {/* <div className={`flex flex-col items-center ${currentStep >= (showAuthStep ? 6 : 5) ? 'text-musinova-green' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mb-1 ${currentStep >= (showAuthStep ? 6 : 5) ? 'bg-musinova-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {showAuthStep ? 6 : 5}
                </div>
                <span className="text-xs">Payment</span>
              </div> */}
              
              <div className={`flex flex-col items-center ${currentStep >= totalSteps ? 'text-musinova-green' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mb-1 ${currentStep >= totalSteps ? 'bg-musinova-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                  ✓
                </div>
                <span className="text-xs">Done</span>
              </div>
            </div>
          </div>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6">
              {/* Step 1: Start */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Do you want to start a paid campaign?</h2>
                  
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <Button
                      className="flex-1 h-20 text-lg btn-primary"
                      onClick={handleNext}
                    >
                      Launch Campaign
                    </Button>
                  </div>
                  
                  <div className="text-gray-600 text-sm">
                    <p className="mb-2">By launching a campaign, you will:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Create ads for your music on Facebook and Instagram</li>
                      <li>Increase visibility and streams for your songs</li>
                      <li>Grow your playlist following</li>
                      <li>Get detailed analytics on performance</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Step 2: Account (only shown if user is not authenticated) */}
              {currentStep === 2 && showAuthStep && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Create an Account to Continue</h2>
                  <Register standalone={false} />
                </div>
              )}
              
              {/* Step 2/3: Playlist */}
              {/* TODO: Optional specific song to promote */}
              {currentStep === (showAuthStep ? 3 : 2) && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Do you already have a playlist on Spotify?</h2>
                  
                  <div className="space-y-4 mb-8">
                    <Button
                      variant={hasPlaylist === 'yes' ? 'default' : 'outline'}
                      className={`w-full justify-start p-4 h-auto text-left ${hasPlaylist === 'yes' ? 'bg-musinova-green hover:bg-musinova-green/90' : ''}`}
                      onClick={() => setHasPlaylist('yes')}
                    >
                      <div>
                        <div className="font-medium">Yes</div>
                        <div className="text-sm opacity-90">I already have a playlist ready to promote</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant={hasPlaylist === 'no' ? 'default' : 'outline'}
                      className={`w-full justify-start p-4 h-auto text-left ${hasPlaylist === 'no' ? 'bg-musinova-green hover:bg-musinova-green/90' : ''}`}
                      onClick={() => setHasPlaylist('no')}
                    >
                      <div>
                        <div className="font-medium">No</div>
                        <div className="text-sm opacity-90">I need help creating a playlist</div>
                      </div>
                    </Button>
                  </div>
                  
                  {hasPlaylist === 'yes' && (
                    <div className="mb-8">
                      <h3 className="font-medium mb-4">Did you think about these points?</h3>
                      <div className="space-y-3 mb-6">
                        <div className="flex gap-2">
                          <div className="mt-0.5">✅</div>
                          <div>
                            <p>Do you have artists that are similar to you in your playlist?</p>
                            <p className="text-sm text-gray-600">This is important to trigger the algorithm to get more streams.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="mt-0.5">✅</div>
                          <div>
                            <p>Did you create a simple name fitting your music genre?</p>
                            <p className="text-sm text-gray-600">E.g. "Indie Rock 2025" or "Fresh Pop Finds" - keep it simple.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="mt-0.5">✅</div>
                          <div>
                            <p>Did you create a profile picture?</p>
                            <p className="text-sm text-gray-600">An attractive cover image helps your playlist stand out.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="mt-0.5">✅</div>
                          <div>
                            <p>Does your playlist have between 30 and 50 songs?</p>
                            <p className="text-sm text-gray-600">Much longer or shorter is not good for promoting.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="mt-0.5">✅</div>
                          <div>
                            <p>Did you add your own songs to the playlist?</p>
                            <p className="text-sm text-gray-600">4-10 songs is suggested, spread nicely throughout the playlist.</p>
                          </div>
                        </div>
                      </div>
                      
                      {hasPlaylist === 'yes' && (
                        <div className="mb-8">
                          <label htmlFor="playlistUrl" className="block text-sm font-medium mb-2">
                            Paste your Spotify playlist link <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="playlistUrl"
                            type="url"
                            placeholder="https://open.spotify.com/playlist/..."
                            value={playlistUrl}
                            onChange={(e) => setPlaylistUrl(e.target.value)}
                            className="w-full"
                          />
                          {!playlistUrl && (
                            <p className="text-sm text-red-500 mt-1">Playlist URL is required.</p>
                          )}
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600">
                        <p>Want to check if your playlist is optimized for promotion?</p>
                        <Link to="/playlist-checker" className="text-musinova-green hover:underline">Use our Playlist Checker tool</Link>
                      </div>
                      <h3 className="font-medium mt-8 mb-4">Want us to direct the adverts to a specific track (optional)?</h3>
                      <div className="mb-6">
                        <label htmlFor="trackUrl" className="block text-sm font-medium mb-2">
                          Paste your Spotify track link
                        </label>
                        <Input
                          id="trackUrl"
                          type="url" 
                          placeholder="https://open.spotify.com/track/..."
                          value={trackUrl}
                          onChange={(e) => setTrackUrl(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      
                    </div>
                  )}
                  
                  {hasPlaylist === 'no' && (
                    <div className="mb-8">
                      <h3 className="font-medium mb-4">How to create a playlist</h3>
                      <div className="space-y-4 mb-6">
                        <div className="flex gap-2">
                          <div className="font-medium text-gray-700">1.</div>
                          <div>
                            <p>Find artists that are like you and put them in a playlist.</p>
                            <p className="text-sm text-gray-600">Don't know similar artists? <Link to="https://musiccrab.com/similar-music-artists-finder-tool/" className="text-musinova-green hover:underline">Find them here</Link></p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="font-medium text-gray-700">2.</div>
                          <div>
                            <p>Create a simple name fitting your music genre.</p>
                            <p className="text-sm text-gray-600">E.g. "Indie Rock 2025" or "Fresh Pop Finds"</p>
                            <p className="text-sm text-gray-600">Keep it simple - long names or too specific playlists are hard to promote.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="font-medium text-gray-700">3.</div>
                          <div>
                            <p>Create a profile picture.</p>
                            <p className="text-sm text-gray-600">You can do it yourself or <Link to="/playlist-cover-creator" className="text-musinova-green hover:underline">use our tool here</Link></p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="font-medium text-gray-700">4.</div>
                          <div>
                            <p>Make sure the playlist has around 30-50 songs.</p>
                            <p className="text-sm text-gray-600">This is the optimal range for promotion.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="font-medium text-gray-700">5.</div>
                          <div>
                            <p>Add your own songs to the playlist.</p>
                            <p className="text-sm text-gray-600">At least around 4 and maximum around 10 is suggested.</p>
                            <p className="text-sm text-gray-600">Don't put them at the first place but spread them out nicely throughout the playlist.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>Once you've created your playlist, come back here to continue!</p>
                        <p className="mt-2">
                          Need more help? <Link to="/help" className="text-musinova-green hover:underline">Visit our help center</Link>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                    
                    <Button 
                      className="btn-primary"
                      onClick={handleNext}
                      disabled={!hasPlaylist || (hasPlaylist === 'yes' && !playlistUrl)}
                    >
                      Continue <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Artist details */}
              {currentStep === (showAuthStep ? 4 : 3) && hasPlaylist === 'yes' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Artist Details</h2>
                  <div className="space-y-4 mb-8">
                    <div>
                      <label htmlFor="artistUrl" className="block text-sm font-medium mb-2">
                        Paste your Spotify artist link <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="artistUrl"
                        type="url"
                        placeholder="https://open.spotify.com/artist/..."
                        value={artistUrl}
                        onChange={(e) => setArtistUrl(e.target.value)}
                        className="w-full"
                      />
                      {!artistUrl && (
                        <p className="text-sm text-red-500 mt-1">Artist URL is required.</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                    <Button
                      className="btn-primary"
                      onClick={handleNext}
                      disabled={!artistUrl} // Disable button if artist URL is missing
                    >
                      Continue <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 4: Campaign Details */}
              {currentStep === (showAuthStep ? 5 : 4) && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Campaign Details</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div>
                      <label htmlFor="campaignName" className="block text-sm font-medium mb-2">
                        Campaign Name
                      </label>
                      <Input
                        id="campaignName"
                        placeholder="E.g. Summer Indie Promotion"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    {hasPlaylist === 'yes' && playlistUrl && (
                      <div>
                        <p className="text-sm font-medium mb-2">Playlist URL</p>
                        <div className="flex items-center p-3 bg-gray-50 rounded-md">
                          <span className="text-gray-700 truncate flex-1">{playlistUrl}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-musinova-green"
                            onClick={() => setCurrentStep(2)}
                          >
                            Change
                          </Button>
                        </div>
                        <p className="text-sm font-medium mb-2">Artist URL</p>
                        <div className="flex items-center p-3 bg-gray-50 rounded-md">
                          <span className="text-gray-700 truncate flex-1">{artistUrl}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-musinova-green"
                            onClick={() => setCurrentStep(3)}
                          >
                            Change
                          </Button>
                        </div>
                        {/* if the trackUrl is filled in show it here */}
                        {trackUrl && (
                          <div>
                            <p className="text-sm font-medium mb-2">Track URL</p>
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                              <span className="text-gray-700 truncate flex-1">{trackUrl}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-musinova-green"
                                onClick={() => setCurrentStep(2)}
                              >
                                Change
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <p className="block text-sm font-medium mb-2">Target Audience</p>
                      <div className="p-4 border border-musinova-green border-dashed rounded-md text-center">
                        <p>Our team will create a custom audience based on your music style</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Targeting is created after analyzing your music and playlist
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                    
                    <Button 
                      className="btn-primary"
                      onClick={handleSubmit}
                      disabled={!campaignName}
                    >
                      Continue <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 5: Payment */}
              {/* {currentStep === (showAuthStep ? 6 : 5) && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Choose Payment Option</h2>
                  
                  <Tabs defaultValue="subscription" onValueChange={(value) => setPaymentType(value as any)}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="subscription">Monthly Subscription</TabsTrigger>
                      <TabsTrigger value="one-time">One-Time Payment</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="subscription">
                      <div className="space-y-6 mb-8">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Monthly Budget</label>
                            <span className="text-lg font-bold text-musinova-green">${subscriptionAmount}</span>
                          </div>
                          
                          <Slider
                            defaultValue={[subscriptionAmount]}
                            max={10000}
                            min={50}
                            step={50}
                            onValueChange={(values) => setSubscriptionAmount(values[0])}
                            className="my-4"
                          />
                          
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>$50</span>
                            <span>$10,000</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium mb-2">Subscription Details</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span>Monthly budget:</span>
                              <span className="font-medium">${subscriptionAmount}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>MusiNova fee ({subscriptionAmount <= 100 ? '45%' : '35%'}):</span>
                              <span className="font-medium">
                                ${subscriptionAmount <= 100 
                                  ? (subscriptionAmount * 0.45).toFixed(2) 
                                  : (subscriptionAmount * 0.35).toFixed(2)}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Ad spend:</span>
                              <span className="font-medium">
                                ${subscriptionAmount <= 100 
                                  ? (subscriptionAmount * 0.55).toFixed(2) 
                                  : (subscriptionAmount * 0.65).toFixed(2)}
                              </span>
                            </li>
                            <li className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                              <span>Total monthly charge:</span>
                              <span className="font-bold">${subscriptionAmount}</span>
                            </li>
                          </ul>
                          <p className="mt-4 text-xs text-gray-500">Cancel anytime. You'll be billed monthly until canceled.</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="one-time">
                      <div className="space-y-6 mb-8">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Campaign Budget</label>
                            <span className="text-lg font-bold text-musinova-green">${oneTimeAmount}</span>
                          </div>
                          
                          <Slider
                            defaultValue={[oneTimeAmount]}
                            max={10000}
                            min={50}
                            step={50}
                            onValueChange={(values) => setOneTimeAmount(values[0])}
                            className="my-4"
                          />
                          
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>$50</span>
                            <span>$10,000</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Campaign Duration</label>
                            <span className="text-lg font-bold text-musinova-green">{oneTimeDuration} days</span>
                          </div>
                          
                          <RadioGroup 
                            value={oneTimeDuration.toString()} 
                            onValueChange={(value) => setOneTimeDuration(parseInt(value))}
                            className="grid grid-cols-3 gap-2"
                          >
                            <div>
                              <RadioGroupItem value="14" id="days-14" className="sr-only" />
                              <Label
                                htmlFor="days-14"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <span className="mb-1">14 days</span>
                                <span className="text-xs text-muted-foreground">Quick boost</span>
                              </Label>
                            </div>
                            
                            <div>
                              <RadioGroupItem value="30" id="days-30" className="sr-only" />
                              <Label
                                htmlFor="days-30"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <span className="mb-1">30 days</span>
                                <span className="text-xs text-muted-foreground">Recommended</span>
                              </Label>
                            </div>
                            
                            <div>
                              <RadioGroupItem value="60" id="days-60" className="sr-only" />
                              <Label
                                htmlFor="days-60"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <span className="mb-1">60 days</span>
                                <span className="text-xs text-muted-foreground">Long term</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium mb-2">Campaign Summary</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span>One-time budget:</span>
                              <span className="font-medium">${oneTimeAmount}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Campaign duration:</span>
                              <span className="font-medium">{oneTimeDuration} days</span>
                            </li>
                            <li className="flex justify-between">
                              <span>MusiNova fee ({oneTimeAmount <= 100 ? '45%' : '35%'}):</span>
                              <span className="font-medium">
                                ${oneTimeAmount <= 100 
                                  ? (oneTimeAmount * 0.45).toFixed(2) 
                                  : (oneTimeAmount * 0.35).toFixed(2)}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Ad spend:</span>
                              <span className="font-medium">
                                ${oneTimeAmount <= 100 
                                  ? (oneTimeAmount * 0.55).toFixed(2) 
                                  : (oneTimeAmount * 0.65).toFixed(2)}
                              </span>
                            </li>
                            <li className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                              <span>Total charge:</span>
                              <span className="font-bold">${oneTimeAmount}</span>
                            </li>
                          </ul>
                          <p className="mt-4 text-xs text-gray-500">One-time payment. No recurring charges.</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={handleBack}>
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      
                      <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            Launch Campaign <ArrowRight size={16} className="ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )} */}
              
              {/* Step 6: Confirmation */}
              {currentStep === totalSteps && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">Campaign Successfully Created!</h2>
                  
                  <p className="text-gray-600 mb-8">
                    {user && <span>Thank you, {user.name}! </span>}
                    Your campaign <span className="font-medium">{campaignName || "New Campaign"}</span> is now being set up.
                    <br />Our team will create custom ads for your playlist.
                  </p>
                  
                  <div className="bg-musinova-cream p-6 rounded-lg mb-8">
                    <h3 className="font-semibold mb-4">What happens next?</h3>
                    <ol className="text-left space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="font-medium">1.</span>
                        <span>Our team will review your playlist and create optimized ads.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">2.</span>
                        <span>Your ads will be launched within 24 hours.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">3.</span>
                        <span>You can track performance on your dashboard.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">4.</span>
                        <span>We'll optimize your campaign daily for best results.</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/dashboard">
                      <Button className="btn-primary w-full sm:w-auto">
                        Go to Dashboard
                      </Button>
                    </Link>
                    
                    <Link
                      to="/campaigns/new"
                      onClick={() => {
                        // Reset all state variables to their initial values
                        setCurrentStep(1);
                        setHasPlaylist(null);
                        setPlaylistUrl('');
                        setTrackUrl('');
                        setArtistUrl('');
                        setCampaignName('');
                        setPaymentType('subscription');
                        setSubscriptionAmount(150);
                        setOneTimeAmount(150);
                        setOneTimeDuration(30);
                        setIsSubmitting(false);
                        setShowAuthStep(!isAuthenticated); // Reset auth step based on authentication status
                      }}
                    >
                      <Button variant="outline" className="btn-outline w-full sm:w-auto">
                        Create Another Campaign
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewCampaign;
