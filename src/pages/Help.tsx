import React, { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { useAuth } from '@/hooks/use-auth';
import { useAnalytics } from '@/hooks/use-analytics';

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const Help = () => {
  const { user, isAuthenticated } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      form.setValue('name', user.name || "");
      form.setValue('email', user.email || "");
    }
  }, [isAuthenticated, user, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    void trackClick('help_contact_submit', { subject: values.subject });
    console.log("Form submitted:", values);
    try {
      // Send email using EmailJS
      const result = await emailjs.send(
        'service_eb7lk07', // Replace with your EmailJS Service ID
        'template_ql95iyi', // Replace with your EmailJS Template ID
        {
          from_name: values.name,
          from_email: values.email,
          subject: values.subject,
          message: values.message,
        },
        '_CHPDq319SYn4P4PK' // Replace with your EmailJS Public Key
      );

      if (result.status === 200) {
        toast.success("Your message has been sent! We'll get back to you soon.");
        form.reset();
      } else {
        toast.error("Failed to send your message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending your message.");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-4">
        <section className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-musinova-darkgray mb-2">Contact Support</h2>
            <p className="text-gray-600">
              Can't find what you're looking for? Our support team is ready to help.
            </p>
          </div>
          
          <Card className="border border-musinova-green/50 shadow-md bg-musinova-lightyellow/30 hover:shadow-lg transition-all">
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-musinova-darkgray font-medium">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} className="border-musinova-green/30 focus:border-musinova-green" />
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
                          <FormLabel className="text-musinova-darkgray font-medium">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your email" 
                              {...field} 
                              className={`border-musinova-green/30 focus:border-musinova-green ${isAuthenticated ? "bg-gray-100 cursor-not-allowed" : ""}`} 
                              readOnly={isAuthenticated}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-musinova-darkgray font-medium">Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="How can we help you?" {...field} className="border-musinova-green/30 focus:border-musinova-green" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-musinova-darkgray font-medium">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your issue or question in detail..." 
                            className="min-h-32 border-musinova-green/30 focus:border-musinova-green" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-center">
                    <Button 
                      type="submit" 
                      className="btn-primary w-full md:w-auto flex items-center justify-center"
                    >
                      <Send size={16} className="mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
};

export default Help;