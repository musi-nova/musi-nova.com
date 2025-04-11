
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Mail, Music, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/use-auth';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
});

type FormValues = z.infer<typeof formSchema>;

interface RegisterProps {
  standalone?: boolean;
  redirectToCampaign?: boolean;
}

const Register = ({ standalone = true, redirectToCampaign = false }: RegisterProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationSent, setVerificationSent] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsLoading(true);
    
    // Simulate API call for registration
    setTimeout(() => {
      setIsLoading(false);
      
      // Move to next step (verification)
      setCurrentStep(2);
      setVerificationSent(true);
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox to verify your email address.",
      });
    }, 1000);
  };

  const handleVerifyEmail = () => {
    setIsLoading(true);
    
    // Simulate verification checking
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(3); // Move to Spotify connection step
      
      toast({
        title: "Email verified successfully",
        description: "Your email has been verified. You can now connect your Spotify account.",
      });
    }, 1500);
  };

  const handleConnectSpotify = () => {
    setIsLoading(true);
    
    // Simulate Spotify connection
    setTimeout(() => {
      setIsLoading(false);
      setSpotifyConnected(true);
      
      // Create user data
      const userData = {
        id: '1',
        name: form.getValues('name'),
        email: form.getValues('email'),
        isAuthenticated: true
      };
      
      // Login the user
      login(userData);
      
      toast({
        title: "Registration successful",
        description: "Welcome to MusiNova!",
      });
      
      // Handle redirects
      const from = location.state?.from;
      if (redirectToCampaign) {
        navigate('/campaigns/new');
      } else if (from) {
        navigate(from);
      } else {
        navigate('/dashboard');
      }
    }, 1500);
  };

  const handleSkipSpotify = () => {
    // Create user data
    const userData = {
      id: '1',
      name: form.getValues('name'),
      email: form.getValues('email'),
      isAuthenticated: true
    };
    
    // Login the user
    login(userData);
    
    toast({
      title: "Registration successful",
      description: "Welcome to MusiNova!",
    });
    
    // Handle redirects
    const from = location.state?.from;
    if (redirectToCampaign) {
      navigate('/campaigns/new');
    } else if (from) {
      navigate(from);
    } else {
      navigate('/dashboard');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Account creation
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        id="terms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="terms">
                        I accept the <Link to="/terms" className="text-musinova-green hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-musinova-green hover:underline">Privacy Policy</Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-musinova-green" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        );
        
      case 2: // Email verification
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="bg-musinova-cream/50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-musinova-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verify your email</h3>
              <p className="text-gray-500 mb-4">
                We've sent a verification link to <span className="font-medium">{form.getValues('email')}</span>
              </p>
              
              {/* In a real app, this would be hidden and only shown after the user clicks the email link */}
              <div className="p-4 border rounded-md mb-4 bg-musinova-cream/20">
                <p className="text-sm text-gray-600">For demo purposes, click the button below to simulate email verification</p>
              </div>
              
              <Button 
                onClick={handleVerifyEmail} 
                className="w-full bg-musinova-green" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
              
              <p className="mt-4 text-sm text-gray-500">
                Didn't receive the email? <button className="text-musinova-green hover:underline">Resend</button>
              </p>
            </div>
          </div>
        );
        
      case 3: // Connect Spotify
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="bg-musinova-cream/50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Music className="h-8 w-8 text-musinova-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect your Spotify account</h3>
              <p className="text-gray-500 mb-6">
                Connect your Spotify account to unlock all MusiNova features
              </p>
              
              {spotifyConnected ? (
                <div className="flex items-center justify-center gap-2 text-musinova-green mb-4">
                  <Check size={20} />
                  <span>Spotify account connected successfully</span>
                </div>
              ) : (
                <Button 
                  onClick={handleConnectSpotify} 
                  className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting to Spotify...
                    </>
                  ) : (
                    "Connect Spotify"
                  )}
                </Button>
              )}
              
              {!spotifyConnected && (
                <button 
                  onClick={handleSkipSpotify} 
                  className="block mx-auto mt-4 text-sm text-gray-500 hover:underline"
                >
                  Skip for now
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  if (!standalone) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">
          {currentStep === 1 ? "Create your account" : 
           currentStep === 2 ? "Verify your email" : 
           "Connect Spotify"}
        </h2>
        {renderStep()}
        
        {currentStep === 1 && (
          <div className="mt-4 text-center text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-musinova-green hover:underline">
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="bg-white shadow-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {currentStep === 1 ? "Create an account" : 
                 currentStep === 2 ? "Verify your email" : 
                 "Connect Spotify"}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {currentStep === 1 ? "Enter your details to create your MusiNova account" : 
                 currentStep === 2 ? "Check your inbox for the verification link" : 
                 "Connect your Spotify account to get started"}
              </p>
            </CardHeader>
            <CardContent>
              {renderStep()}
              
              {currentStep === 1 && (
                <div className="mt-4 text-center text-sm">
                  <p>
                    Already have an account?{' '}
                    <Link to="/login" className="text-musinova-green hover:underline">
                      Log in
                    </Link>
                  </p>
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

export default Register;
