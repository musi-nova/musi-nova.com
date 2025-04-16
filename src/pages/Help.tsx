
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, Send } from 'lucide-react';
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

const faqCategories = [
  {
    title: "Getting Started",
    icon: "/logo.png",
    questions: ["How do I create an account?", "What's included in the free plan?", "How do I check my playlist?"]
  },
  {
    title: "Campaigns & Promotion",
    icon: "/logo.png",
    questions: ["How do I create a campaign?", "What ad platforms do you use?", "How long should my campaign run?"]
  },
  {
    title: "Billing & Payments",
    icon: "/logo.png",
    questions: ["What payment methods do you accept?", "Can I get a refund?", "How do I upgrade my plan?"]
  },
  {
    title: "Smart URLs",
    icon: "/logo.png",
    questions: ["What is a Smart URL?", "How do I create one?", "Can I customize my Smart URL?"]
  }
];

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.success("Your message has been sent! We'll get back to you soon.");
    form.reset();
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-0 py-8 md:py-12">
        {/* FAQ Section */}
        {/* <section className="mb-16">
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-musinova-darkgray mb-2">Help Center</h1>
            <p className="text-gray-600">
              Find answers to common questions or search for specific help articles.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for help articles..."
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {faqCategories.map((category, index) => (
              <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer card-hover">
                <CardContent className="p-6 flex items-start">
                  <img src={category.icon} alt={category.title} className="w-10 h-10 mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                    <ul className="space-y-1 text-musinova-darkgray/70">
                      {category.questions.slice(0, 3).map((question, qIndex) => (
                        <li key={qIndex} className="flex items-center">
                          <ChevronRight size={14} className="text-musinova-green mr-1" />
                          <span className="text-sm">{question}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="link" className="text-musinova-green p-0 mt-2">
                      View all
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section> */}
        
        {/* Contact Form Section */}
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
                            <Input placeholder="Your email" {...field} className="border-musinova-green/30 focus:border-musinova-green" />
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
