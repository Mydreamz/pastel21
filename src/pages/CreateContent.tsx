
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StarsBackground from '@/components/StarsBackground';
import ContentForm, { ContentFormValues } from '@/components/content/ContentForm';

const CreateContent = () => {
  const navigate = useNavigate();
  
  const onSubmit = (values: ContentFormValues) => {
    console.log("Form submitted with values:", values);
    // Here you would typically save the content to your backend
    
    // After saving, navigate back to home
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      {/* Background elements */}
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full mx-auto px-3 py-4 sm:px-4 md:px-6 max-w-lg">
        <button 
          onClick={() => navigate('/')} 
          className="mb-4 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <Card className="glass-card border-white/10 text-white overflow-hidden">
          <CardHeader className="px-4 py-5 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">Create Locked Content</CardTitle>
            <CardDescription className="text-gray-300 text-sm">
              Share and monetize your content with a secure paywall
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-2">
            <ContentForm 
              onSubmit={onSubmit}
              onCancel={() => navigate('/')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContent;
