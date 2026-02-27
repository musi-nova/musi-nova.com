import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // Point the error to the confirmPassword field
    message: 'Passwords do not match',
  });

type FormValues = z.infer<typeof formSchema>;

interface RegisterProps {
  standalone?: boolean;
  redirectToCampaign?: boolean;
}

const Register = ({ standalone = true, redirectToCampaign = false }: RegisterProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const { checkEmailExists } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

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

  const acceptTerms = form.watch('acceptTerms'); // Watch the value of acceptTerms

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
      if (redirectToCampaign) {
        navigate('/campaign');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      toast({
        title: 'Error',
        description: 'There was a problem signing in with Google.',
        variant: 'destructive',
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
        title: 'Success',
        description: 'Account created successfully!',
      });
      if (redirectToCampaign) {
        navigate('/campaign');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Microsoft login failed:', error);
      toast({
        title: 'Error',
        description: 'There was a problem signing in with Microsoft.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Prevent registering if email already exists with other providers
      try {
        const exists = await checkEmailExists(values.email);
        if (exists.exists) {
          const methods = (exists.providers || []).map((p: string) => p === 'google.com' ? 'Google' : p === 'microsoft.com' ? 'Microsoft' : p).join(', ');
          toast({ title: 'Account already exists', description: `An account with this email already exists. Use ${methods} or log in.`, variant: 'destructive' });
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // ignore errors from check and continue
      }

      await register(values.email, values.password, values.name);

      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });

      if (redirectToCampaign) {
        navigate('/campaign');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
                {checkingEmail && <p className="text-xs text-gray-500 mt-1">Checking account...</p>}
                {emailProviders && (
                  <div className="mt-1 text-xs">
                    <p className="text-red-600">An account already exists for this email. Associated methods: {emailProviders.map((p) => (p === 'google.com' ? 'Google' : p === 'microsoft.com' ? 'Microsoft' : p)).join(', ')}.</p>
                    <div className="mt-2 flex gap-2">
                      {emailProviders.includes('google.com') && (
                        <Button type="button" variant="outline" size="sm" onClick={handleGoogleLogin} disabled={isLoading}>
                          Continue with Google
                        </Button>
                      )}
                      {emailProviders.includes('microsoft.com') && (
                        <Button type="button" variant="outline" size="sm" onClick={handleMicrosoftLogin} disabled={isLoading}>
                          Continue with Microsoft
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
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field, fieldState }) => (
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
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={`w-full ${acceptTerms ? 'bg-musinova-green' : 'bg-gray-400'}`}
            disabled={isLoading || !acceptTerms || !!emailProviders} // Disable if email already exists
          >
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
  };

  const renderSocialButtons = () => {
    return (
      <>
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
      </>
    );
  };

  if (!standalone) {
    return (
      <div>
        {renderStep()}
        {renderSocialButtons()}
        <div className="mt-4 text-center text-sm">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-musinova-green hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 pt-24 py-12 px-4">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="bg-white shadow-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                Create an account
              </CardTitle>
              <p className="text-sm text-gray-500">
                Enter your details to create your MusiNova account
              </p>
            </CardHeader>
            <CardContent>
              {renderStep()}
              {renderSocialButtons()}
              <div className="mt-4 text-center text-sm">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-musinova-green hover:underline">
                    Log in
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

export default Register;