
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { blogTabs } from '@/config/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const blogPosts = [{
  id: 1,
  title: "How to Optimize Your Spotify Playlist for Maximum Engagement",
  excerpt: "Learn the secrets to creating a playlist that keeps listeners engaged and coming back for more.",
  category: "Tutorial",
  date: "April 1, 2025",
  image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3"
}, {
  id: 2,
  title: "5 Ways to Promote Your Music on Social Media",
  excerpt: "Discover effective strategies for promoting your music across different social media platforms.",
  category: "Tips",
  date: "March 28, 2025",
  image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3"
}, {
  id: 3,
  title: "Understanding Spotify's Algorithm: How it Recommends Music",
  excerpt: "Dive deep into how Spotify's algorithm works and how you can use it to your advantage.",
  category: "Education",
  date: "March 23, 2025",
  image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3"
}, {
  id: 4,
  title: "Case Study: How an Independent Artist Gained 10,000 Monthly Listeners",
  excerpt: "A detailed analysis of how one artist went from unknown to having thousands of monthly listeners.",
  category: "Case Study",
  date: "March 20, 2025",
  image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3"
}];

const Blog = () => {
  return (
    <PageLayout tabs={blogTabs} className="bg-gray-50 py-0">
      <div className="w-full bg-gray-50 py-16 border-b mb-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Help Center
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions or search for specific help articles.
          </p>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured post */}
          <div className="lg:col-span-3 mb-4">
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto">
                  <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Featured post" className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-musinova-cream text-musinova-green rounded-full">Featured</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-musinova-darkgray">The Future of Music Promotion: Trends to Watch in 2025</h2>
                  <p className="text-gray-600 mb-4">
                    From AI-powered marketing to niche playlist placement, discover the emerging trends that are shaping the future of music promotion.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">April 3, 2025</span>
                    <Button variant="outline" className="btn-outline text-sm">Read Article</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
          
          {/* Regular posts */}
          {blogPosts.map(post => (
            <Card key={post.id} className="overflow-hidden card-hover">
              <div className="h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-musinova-cream text-musinova-green rounded-full">{post.category}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-musinova-darkgray">{post.title}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Button variant="outline" className="btn-outline text-sm">Read More</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Blog;
