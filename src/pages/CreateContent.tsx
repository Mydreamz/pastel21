
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import { useContentForm } from '@/hooks/useContentForm';
import BasicInfoFields from '@/components/content/BasicInfoFields';
import ContentTypeSelector from '@/components/content/ContentTypeSelector';
import AdvancedSettings from '@/components/content/AdvancedSettings';
import ContentScheduler from '@/components/content/ContentScheduler';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ContentFormActions from '@/components/content/ContentFormActions';

const CreateContent = () => {
  const [showScheduler, setShowScheduler] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();
  
  const {
    form,
    onSubmit,
    selectedContentType,
    setSelectedContentType,
    selectedFile,
    setSelectedFile,
    showAdvanced,
    setShowAdvanced,
    isAuthenticated,
    isAuthChecking,
    isUploading
  } = useContentForm();

  const handleScheduleContent = (scheduleInfo: { date: Date; time: string }) => {
    const formData = form.getValues();
    const scheduled = {
      ...formData,
      scheduledFor: scheduleInfo.date,
      scheduledTime: scheduleInfo.time
    };
    onSubmit(scheduled);
  };

  // Show loading state while checking auth
  if (isAuthChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EAEFFC]">
        <div className="text-gray-800 text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show a message and redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EAEFFC]">
        <div className="text-gray-800 text-center max-w-md p-8 glass-card shadow-neumorphic border-pastel-200/50">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6">You need to be signed in to create content. You'll be redirected to the home page.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-pastel-500 hover:bg-pastel-600 text-white"
          >
            Go to Home Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative overflow-x-hidden bg-[#EAEFFC]">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
        <button onClick={() => navigate('/')} className="mb-3 flex items-center text-gray-700 hover:text-pastel-700 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-[2fr,1fr]'} gap-4`}>
          <Card className="glass-card shadow-neumorphic border-pastel-200/50 text-gray-800">
            <CardHeader className={isMobile ? "px-3 py-3" : "px-6 py-6"}>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Create Locked Content</CardTitle>
              <CardDescription className="text-gray-700">
                Share and monetize your content with a secure paywall
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 pb-3" : "px-6 pb-6"}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={`${isMobile ? 'space-y-3' : 'space-y-6'}`}>
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
                  
                  <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} gap-3 pt-3`}>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowScheduler(true)}
                      className={`${isMobile ? 'w-full' : ''} border-pastel-200 hover:bg-pastel-100 text-gray-700`}
                    >
                      Schedule
                    </Button>
                    <Button 
                      type="submit" 
                      className={`${isMobile ? 'w-full' : ''} bg-pastel-500 hover:bg-pastel-600 text-white`}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : 'Create Content'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {!isMobile && showScheduler && (
            <ContentScheduler
              contentId=""
              contentTitle={form.getValues().title || "Untitled Content"}
              onSchedule={handleScheduleContent}
            />
          )}
          
          {isMobile && showScheduler && (
            <Card className="glass-card shadow-neumorphic border-pastel-200/50 text-gray-800">
              <CardHeader className="px-3 py-3">
                <CardTitle className="text-lg font-bold text-gray-800">Schedule Content</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <ContentScheduler
                  contentId=""
                  contentTitle={form.getValues().title || "Untitled Content"}
                  onSchedule={handleScheduleContent}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContent;
