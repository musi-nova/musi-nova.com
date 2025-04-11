
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Music, Building2 } from 'lucide-react';
import Register from './Register';
import { useAuth } from '@/hooks/use-auth';

const TryForFree = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    isAuthenticated
  } = useAuth();

  const handleNext = () => {
    if (currentStep === 2 && isAuthenticated) {
      // If user is authenticated after registration, redirect to campaign creation
      navigate('/campaigns/new');
      return;
    }
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {currentStep < 3 && <>
              <div className="mb-4 text-center">
                <h1 className="text-3xl font-bold text-musinova-navy mb-2">Start Using Musi-Nova</h1>
                <p className="text-gray-600">
                  Let's get you started with MusiNova in just a few steps.
                </p>
              </div>
              
              {/* Progress steps - centered */}
              <div className="mb-8 flex justify-center">
                <div className="flex items-center justify-center w-64 relative">
                  <div className="w-full absolute top-1/2 h-1 bg-gray-200 -z-10"></div>
                  
                  <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-musinova-green' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mb-1 ${currentStep >= 1 ? 'bg-musinova-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                      1
                    </div>
                    <span className="text-xs">Select</span>
                  </div>
                  
                  <div className={`flex flex-col items-center ml-16 ${currentStep >= 2 ? 'text-musinova-green' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mb-1 ${currentStep >= 2 ? 'bg-musinova-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                      2
                    </div>
                    <span className="text-xs">Create Account</span>
                  </div>
                </div>
              </div>
            </>}
          
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6">
              {/* Step 1: Choose Account Type */}
              {currentStep === 1 && <div>
                  <h2 className="text-xl font-semibold mb-6">What best describes you?</h2>
                  
                  <div className="space-y-4 mb-8">
                    <RadioGroup value={accountType || ''} onValueChange={setAccountType}>
                      <div className="flex flex-col space-y-4">
                        <div>
                          <RadioGroupItem value="artist" id="artist" className="peer sr-only" />
                          <Label htmlFor="artist" className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-white p-6 hover:bg-gray-50 hover:border-gray-200 cursor-pointer peer-data-[state=checked]:border-musinova-green [&:has([data-state=checked])]:border-musinova-green">
                            <div className="flex w-full items-start gap-4">
                              <div className="mt-1 bg-musinova-lightyellow p-2 rounded-full">
                                <Music className="h-5 w-5 text-musinova-brown" />
                              </div>
                              <div>
                                <span className="text-lg font-medium">Artist / Musician</span>
                                <p className="text-sm text-gray-500 mt-1">I create music and want to promote it</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem value="label" id="label" className="peer sr-only" />
                          <Label htmlFor="label" className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-white p-6 hover:bg-gray-50 hover:border-gray-200 cursor-pointer peer-data-[state=checked]:border-musinova-green [&:has([data-state=checked])]:border-musinova-green">
                            <div className="flex w-full items-start gap-4">
                              <div className="mt-1 bg-musinova-lightyellow p-2 rounded-full">
                                <Building2 className="h-5 w-5 text-musinova-brown" />
                              </div>
                              <div>
                                <span className="text-lg font-medium">Record Label / Manager</span>
                                <p className="text-sm text-gray-500 mt-1">I represent artists and manage their promotion</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="btn-primary" onClick={handleNext} disabled={!accountType}>
                      Continue <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>}
              
              {/* Step 2: Registration - simplified to only show the registration form */}
              {currentStep === 2 && (
                <Register redirectToCampaign={true} standalone={false} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>;
};

export default TryForFree;
