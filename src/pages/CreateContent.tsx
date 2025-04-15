
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft } from 'lucide-react';
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
      
      <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold">Create Locked Content</h1>
          <p className="text-gray-400">
            Share and monetize your content with a secure paywall
          </p>
        </div>

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
              <Button type="button" variant="outline" onClick={() => navigate('/')} className="border-gray-700 hover:border-gray-600 text-gray-400">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Create Content
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateContent;
