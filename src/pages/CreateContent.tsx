
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import { useContentForm } from '@/hooks/useContentForm';
import BasicInfoFields from '@/components/content/BasicInfoFields';
import ContentTypeSelector from '@/components/content/ContentTypeSelector';
import AdvancedSettings from '@/components/content/AdvancedSettings';
import ContentScheduler from '@/components/content/ContentScheduler';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateContent = () => {
  const [showScheduler, setShowScheduler] = useState(false);
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

  useEffect(() => {
    if (!isAuthenticated) {
      // We'll show the auth warning in the UI, but we won't force redirect
      // This allows users to see the content creation form and understand why they need to authenticate
    }
  }, [isAuthenticated, navigate]);

  const handleScheduleContent = (scheduleInfo: { date: Date; time: string }) => {
    const formData = form.getValues();
    const scheduled = {
      ...formData,
      scheduledFor: new Date(scheduleInfo.date),
      scheduledTime: scheduleInfo.time
    };
    onSubmit(scheduled);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <div className="grid md:grid-cols-[2fr,1fr] gap-6">
          <Card className="glass-card border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">Create Locked Content</CardTitle>
              <CardDescription className="text-gray-300">
                Share and monetize your content with a secure paywall
              </CardDescription>
              
              {!isAuthenticated && (
                <Alert className="mt-4 bg-red-900/30 border-red-800 text-white">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication required</AlertTitle>
                  <AlertDescription>
                    You need to sign in before creating content. Your work won't be saved until you sign in.
                    <Button 
                      className="bg-red-500 hover:bg-red-600 mt-2 text-white"
                      size="sm"
                      onClick={() => navigate('/')}
                    >
                      Go to sign in
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowScheduler(true)}
                      className="border-gray-700 hover:border-gray-600 text-gray-300"
                    >
                      Schedule
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? "Create Content" : "Sign in required"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {showScheduler && (
            <ContentScheduler
              contentId=""
              contentTitle={form.getValues().title || "Untitled Content"}
              onSchedule={handleScheduleContent}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContent;
