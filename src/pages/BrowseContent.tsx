
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import ContentFilter from '@/components/content/ContentFilter';
import ContentGrid, { ContentItem } from '@/components/content/ContentGrid';
import { ContentType } from '@/components/content/ContentTypeSelector';

// Sample data
const sampleContent: ContentItem[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    teaser: 'Learn the basics of React and start building your first app',
    price: 5.99,
    type: 'text',
    createdAt: '2025-04-01T12:00:00Z'
  },
  {
    id: '2',
    title: 'Advanced CSS Techniques',
    teaser: 'Master modern CSS with these advanced techniques',
    price: 0,
    type: 'document',
    createdAt: '2025-04-02T14:30:00Z'
  },
  {
    id: '3',
    title: 'Introduction to TypeScript',
    teaser: 'Why TypeScript is becoming essential for modern web development',
    price: 7.99,
    type: 'video',
    expiryDate: '2025-05-15T23:59:59Z',
    createdAt: '2025-04-03T09:15:00Z'
  },
  {
    id: '4',
    title: 'Web Design Inspiration',
    teaser: 'Collection of inspiring designs to boost your creativity',
    price: 3.99,
    type: 'image',
    createdAt: '2025-04-04T16:45:00Z'
  },
  {
    id: '5',
    title: 'Frontend Development Podcast',
    teaser: 'Listen to experts discuss the latest trends in frontend development',
    price: 1.99,
    type: 'audio',
    createdAt: '2025-04-05T08:20:00Z'
  },
  {
    id: '6',
    title: 'Exclusive Tutorial Resources',
    teaser: 'All the resources you need for the advanced JavaScript tutorial',
    price: 4.99,
    type: 'link',
    createdAt: '2025-04-06T11:10:00Z'
  }
];

const BrowseContent = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  
  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      {/* Background elements */}
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full mx-auto px-3 py-4 sm:px-4 md:px-6 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </button>
          
          <Button 
            onClick={() => navigate('/create')} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Create Content
          </Button>
        </div>
        
        <Card className="glass-card border-white/10 text-white overflow-hidden">
          <CardHeader className="px-4 py-5 sm:px-6 flex-row justify-between items-center flex-wrap gap-4">
            <CardTitle className="text-xl sm:text-2xl font-bold">Browse Content</CardTitle>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-6">
            <ContentFilter 
              selectedType={selectedType} 
              onSelectType={setSelectedType} 
            />
            
            <ContentGrid 
              items={sampleContent} 
              selectedType={selectedType} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrowseContent;
