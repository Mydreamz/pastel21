
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useContentAnalytics } from '@/hooks/useContentAnalytics';
import { ChartContainer } from '@/components/ui/chart';
import { Activity, BarChart2, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const { totalViews, uniqueViews, revenue, viewsOverTime, popularContent } = useContentAnalytics(timeRange);
  
  const stats = [
    {
      title: "Total Views",
      value: totalViews,
      icon: BarChart2,
      description: "All-time content views"
    },
    {
      title: "Unique Viewers",
      value: uniqueViews,
      icon: Users,
      description: "Individual viewers"
    },
    {
      title: "Total Revenue",
      value: `$${revenue.toFixed(2)}`,
      icon: Activity,
      description: "Earnings from content"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="inline-flex gap-1 rounded-md bg-white/5 p-1">
          <Button 
            size="sm" 
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
            className={timeRange === '7d' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/10 hover:bg-white/10'}
          >
            7 days
          </Button>
          <Button 
            size="sm" 
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
            className={timeRange === '30d' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/10 hover:bg-white/10'}
          >
            30 days
          </Button>
          <Button 
            size="sm" 
            variant={timeRange === 'all' ? 'default' : 'outline'}
            onClick={() => setTimeRange('all')}
            className={timeRange === 'all' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/10 hover:bg-white/10'}
          >
            All time
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card border-white/10 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="views">
        <TabsList className="grid grid-cols-2 bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="views" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            Views Over Time
          </TabsTrigger>
          <TabsTrigger value="popular" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            Popular Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="views">
          <Card className="glass-card border-white/10 text-white">
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription className="text-gray-400">
                {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'All time'} content views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsOverTime} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      dy={5}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(17, 17, 17, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="popular">
          <Card className="glass-card border-white/10 text-white">
            <CardHeader>
              <CardTitle>Most Popular Content</CardTitle>
              <CardDescription className="text-gray-400">
                Your top performing content by views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularContent} layout="vertical" margin={{ top: 5, right: 5, left: 50, bottom: 5 }}>
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="title" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      width={50}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(17, 17, 17, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="views" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
