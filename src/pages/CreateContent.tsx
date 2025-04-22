import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Lock } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import { useContentForm } from '@/hooks/useContentForm';
import BasicInfoFields from '@/components/content/BasicInfoFields';
import ContentTypeSelector from '@/components/content/ContentTypeSelector';
import AdvancedSettings from '@/components/content/AdvancedSettings';

const CreateContent = () => {
  const navigate = useNavigate();
  const {
    form,
    onSubmit,
    selectedContentType,
    setSelectedContentType,
    selectedFile,
    setSelectedFile,
    showAdvanced,
    setShowAdvanced,
    isAuthenticated
  } = useContentForm();

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <button 
          onClick={() => navigate('/')} 
          className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <Card className="glass-card border-white/10 text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Create Locked Content
            </CardTitle>
            <CardDescription className="text-gray-300">
              Share and monetize your content with a secure paywall
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <BasicInfoFields form={form} />
                <ContentTypeSelector 
                  form={form} 
                  selectedContentType={selectedContentType} 
                  setSelectedContentType={setSelectedContentType}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                />
                <AdvancedSettings 
                  form={form} 
                  showAdvanced={showAdvanced} 
                  setShowAdvanced={setShowAdvanced} 
                />
                
                <div className="flex justify-end gap-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/')} 
                    className="border-gray-700 hover:border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
                  >
                    Create Content
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContent;
