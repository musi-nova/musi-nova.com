
import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const GenreStats = () => {
  const [selectedGenre, setSelectedGenre] = useState("indie-rock");
  const isMobile = useIsMobile();
  
  const genres = [
    {
      id: "indie-rock",
      name: "Indie Rock",
      avgSpend: "$120",
      avgGrowth: "+48%",
      color: "#5EA47C"
    },
    {
      id: "indie-pop",
      name: "Indie Pop",
      avgSpend: "$135",
      avgGrowth: "+52%",
      color: "#5EA47C"
    },
    {
      id: "electronic",
      name: "Electronic",
      avgSpend: "$150",
      avgGrowth: "+65%",
      color: "#5EA47C"
    },
    {
      id: "pop-fusion",
      name: "Pop Fusion",
      avgSpend: "$140",
      avgGrowth: "+55%",
      color: "#5EA47C"
    }
  ];
  
  // Data for each genre
  const genreData = {
    "indie-rock": [
      { month: "Jan", followers: 2000, spent: 800 },
      { month: "Feb", followers: 3400, spent: 950 },
      { month: "Mar", followers: 4200, spent: 1000 },
      { month: "Apr", followers: 5100, spent: 1100 },
      { month: "May", followers: 6800, spent: 1200 },
      { month: "Jun", followers: 8000, spent: 1100 },
      { month: "Jul", followers: 9200, spent: 1300 },
      { month: "Aug", followers: 8800, spent: 1250 },
      { month: "Sep", followers: 9500, spent: 1350 },
      { month: "Oct", followers: 9000, spent: 1200 },
      { month: "Nov", followers: 9800, spent: 1300 },
      { month: "Dec", followers: 10500, spent: 1400 }
    ],
    "indie-pop": [
      { month: "Jan", followers: 3000, spent: 900 },
      { month: "Feb", followers: 4500, spent: 1000 },
      { month: "Mar", followers: 5500, spent: 1100 },
      { month: "Apr", followers: 6800, spent: 1200 },
      { month: "May", followers: 8200, spent: 1300 },
      { month: "Jun", followers: 9500, spent: 1250 },
      { month: "Jul", followers: 10800, spent: 1400 },
      { month: "Aug", followers: 10500, spent: 1350 },
      { month: "Sep", followers: 11500, spent: 1450 },
      { month: "Oct", followers: 11000, spent: 1400 },
      { month: "Nov", followers: 12000, spent: 1500 },
      { month: "Dec", followers: 13000, spent: 1600 }
    ],
    "electronic": [
      { month: "Jan", followers: 5000, spent: 1000 },
      { month: "Feb", followers: 7000, spent: 1200 },
      { month: "Mar", followers: 8500, spent: 1300 },
      { month: "Apr", followers: 10000, spent: 1400 },
      { month: "May", followers: 12000, spent: 1500 },
      { month: "Jun", followers: 14000, spent: 1600 },
      { month: "Jul", followers: 16000, spent: 1700 },
      { month: "Aug", followers: 15500, spent: 1650 },
      { month: "Sep", followers: 17000, spent: 1800 },
      { month: "Oct", followers: 16500, spent: 1750 },
      { month: "Nov", followers: 18000, spent: 1900 },
      { month: "Dec", followers: 19500, spent: 2000 }
    ],
    "pop-fusion": [
      { month: "Jan", followers: 4000, spent: 950 },
      { month: "Feb", followers: 5500, spent: 1050 },
      { month: "Mar", followers: 7000, spent: 1150 },
      { month: "Apr", followers: 8500, spent: 1250 },
      { month: "May", followers: 10000, spent: 1350 },
      { month: "Jun", followers: 12000, spent: 1450 },
      { month: "Jul", followers: 13500, spent: 1550 },
      { month: "Aug", followers: 13000, spent: 1500 },
      { month: "Sep", followers: 14500, spent: 1600 },
      { month: "Oct", followers: 14000, spent: 1550 },
      { month: "Nov", followers: 15500, spent: 1650 },
      { month: "Dec", followers: 16500, spent: 1750 }
    ]
  };
  
  const chartConfig = {
    followers: {
      label: "Followers Total",
      theme: {
        light: "#5EA47C",
        dark: "#5EA47C",
      },
    },
    spent: {
      label: "Money Spent",
      theme: {
        light: "#8B5A2B",
        dark: "#8B5A2B",
      },
    },
  };
  
  const selectedGenreInfo = genres.find(g => g.id === selectedGenre);
  
  return (
    <section className="py-10 bg-gradient-section2">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-musinova-darkgray mb-3">
          Performance By Genre
        </h2>
        <p className="text-center text-musinova-darkgray mb-6 max-w-2xl mx-auto">
          See how different genres perform with Musi-Nova promotion campaigns. Find your niche and estimate your growth potential.
        </p>
        
        {/* Genre Selection Buttons */}
        <div className="flex justify-center mb-6 overflow-x-auto pb-2">
          <ToggleGroup 
            type="single" 
            value={selectedGenre}
            onValueChange={(value) => {
              if (value) setSelectedGenre(value);
            }}
            className="flex flex-wrap justify-center gap-3"
          >
            {genres.map((genre) => (
              <ToggleGroupItem 
                key={genre.id} 
                value={genre.id}
                className="px-6 py-3 rounded-full border-2 border-musinova-green text-musinova-darkgray hover:bg-musinova-cream transition-all duration-300 data-[state=on]:bg-musinova-green data-[state=on]:text-white data-[state=on]:shadow-lg font-medium text-base"
              >
                {genre.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        {/* Stats Summary */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-6">
          <div className="text-center bg-white px-6 py-3 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-musinova-darkgray">Avg. Monthly Spend</h3>
            <p className="text-2xl font-bold text-musinova-darkgray">{selectedGenreInfo?.avgSpend}</p>
          </div>
          <div className="text-center bg-white px-6 py-3 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-musinova-darkgray">Avg. Listener Growth</h3>
            <p className="text-2xl font-bold text-musinova-green">{selectedGenreInfo?.avgGrowth}</p>
          </div>
        </div>
        
        {/* Chart */}
        <Tabs defaultValue={selectedGenre} value={selectedGenre}>
          {Object.keys(genreData).map((genreId) => (
            <TabsContent key={genreId} value={genreId} className="mt-0">
              <div className="bg-white p-4 rounded-lg shadow-md mx-auto overflow-hidden">
                <div className="h-[300px] md:h-[400px] w-full">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart 
                        data={genreData[genreId]} 
                        margin={{ 
                          top: 10, 
                          right: isMobile ? 10 : 20, 
                          left: isMobile ? 0 : 10, 
                          bottom: isMobile ? 40 : 20 
                        }}
                      >
                        <defs>
                          <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5EA47C" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#5EA47C" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5A2B" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5A2B" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? "end" : "middle"}
                          height={isMobile ? 60 : 30}
                        />
                        <YAxis 
                          width={isMobile ? 40 : 60} 
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="followers" 
                          stroke="#5EA47C" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorFollowers)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="spent" 
                          stroke="#8B5A2B" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorSpent)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                {/* Legend */}
                <div className="flex justify-center mt-3 gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-[#5EA47C] rounded-sm"></div>
                    <span className="text-sm sm:text-base">Followers Total</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-[#8B5A2B] rounded-sm"></div>
                    <span className="text-sm sm:text-base">Money Spent</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default GenreStats;
