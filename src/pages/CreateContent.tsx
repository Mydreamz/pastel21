
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const CreateContent = () => {
  const [showScheduler, setShowScheduler] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    isAuthChecking
  } = useContentForm();

  // Additional authentication check at component mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if we have a valid session
        const { data, error } = await supabase.auth.getSession();
        
        // If there's an error or no session and we're not still checking auth
        if ((error || !data.session) && !isAuthChecking) {
          console.log("No session found in CreateContent - redirecting", { error, hasSession: !!data.session });
          toast({
            title: "Authentication required",
            description: "Please sign in to create content",
            variant: "destructive"
          });
          // Add a slight delay to ensure the toast is visible before redirecting
          setTimeout(() => navigate('/'), 1500);
        }
      } catch (e) {
        console.error("Auth verification error in CreateContent:", e);
        toast({
          title: "Authentication error",
          description: "There was a problem verifying your authentication. Please sign in again.",
          variant: "destructive"
        });
        setTimeout(() => navigate('/'), 1500);
      }
    };

    // Only run this verification if auth checking is complete
    if (!isAuthChecking && !isAuthenticated) {
      verifyAuth();
    }
  }, [isAuthenticated, isAuthChecking, navigate, toast]);

  const handleScheduleContent = (scheduleInfo: { date: Date; time: string }) => {
    const formData = form.getValues();
    const scheduled = {
      ...formData,
      scheduledFor: scheduleInfo.date,
      scheduledTime: scheduleInfo.time
    };
    onSubmit(scheduled);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-emerald-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

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
                      disabled={!isAuthenticated}
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
