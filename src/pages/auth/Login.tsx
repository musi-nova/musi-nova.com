import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loginWithMicrosoft } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { checkEmailExists } = useAuth();

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailProviders, setEmailProviders] = useState<string[] | null>(null);

  const watchedEmail = form.watch('email');

  useEffect(() => {
    let mounted = true;
    let timer: any;
    const validateEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
    setEmailProviders(null);
    if (!validateEmail(watchedEmail)) return;
    timer = setTimeout(async () => {
      setCheckingEmail(true);
      try {
        const res = await checkEmailExists(watchedEmail);
        if (!mounted) return;
        if (res.exists) setEmailProviders(res.providers || []);
        else setEmailProviders(null);
      } catch (err) {
        if (!mounted) return;
        setEmailProviders(null);
      } finally {
        if (mounted) setCheckingEmail(false);
      }
    }, 600);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [watchedEmail, checkEmailExists]);

  const externalProviders = emailProviders ? emailProviders.filter((p) => p !== 'password') : null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: "Login successful",
        description: "Welcome back to MusiNova!",
      });
      const from = location.state?.from || '/dashboard';
      navigate(from);
    } catch (error) {
      console.error('Google login failed:', error);
      toast({
        title: "Login failed",
        description: "There was a problem logging in with Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithMicrosoft();
      toast({
        title: "Login successful",
        description: "Welcome back to MusiNova!",
      });
      const from = location.state?.from || '/dashboard';
      navigate(from);
    } catch (error) {
      console.error('Microsoft login failed:', error);
      toast({
        title: "Login failed",
        description: "There was a problem logging in with Microsoft.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      // Check if email is associated with other providers
      try {
        const exists = await checkEmailExists(values.email);
        if (exists.exists && exists.providers && !exists.providers.includes('password')) {
          const methods = exists.providers.map((p: string) => p === 'google.com' ? 'Google' : p === 'microsoft.com' ? 'Microsoft' : p).join(', ');
          toast({ title: 'Sign-in method mismatch', description: `This email is associated with ${methods}. Please use that method to sign in.`, variant: 'destructive' });
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // ignore check errors and continue to normal login flow
      }

      // Call the login function from the auth context
      await login(values.email, values.password);

      toast({
        title: "Login successful",
        description: "Welcome back to MusiNova!",
      });

      // Redirect to the page the user was trying to access, or to the dashboard
      const from = location.state?.from || '/dashboard';
      navigate(from);
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Please check your email and password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-24 py-12 px-4">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="bg-white shadow-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <p className="text-sm text-gray-500">
                Enter your credentials to log in to your account
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {checkingEmail && <p className="text-xs text-gray-500 mt-1">Checking account...</p>}
                        {externalProviders && externalProviders.length > 0 && (
                          <div className="mt-1 text-xs">
                            <p className="text-red-600">This email is associated with: {externalProviders.map((p) => (p === 'google.com' ? 'Google' : p === 'microsoft.com' ? 'Microsoft' : p)).join(', ')}. Please use the appropriate sign-in method.</p>
                            <div className="mt-2 flex gap-2">
                              {externalProviders.includes('google.com') && (
                                <Button type="button" variant="outline" size="sm" onClick={handleGoogleLogin} disabled={isLoading}>
                                  Sign in with Google
                                </Button>
                              )}
                              {externalProviders.includes('microsoft.com') && (
                                <Button type="button" variant="outline" size="sm" onClick={handleMicrosoftLogin} disabled={isLoading}>
                                  Sign in with Microsoft
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
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

                  <Button type="submit" className="w-full bg-musinova-green" disabled={isLoading || (emailProviders !== null && !emailProviders.includes('password'))}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full" 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Google
                </Button>

                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full" 
                  onClick={handleMicrosoftLogin}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="microsoft" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"></path>
                  </svg>
                  Microsoft
                </Button>
              </div>
              
              <div className="mt-4 text-center text-sm space-y-2">
                <p>
                  <Link to="/forgotten-password" className="text-musinova-green hover:underline">
                    Forgotten your password?
                  </Link>
                </p>
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="text-musinova-green hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;