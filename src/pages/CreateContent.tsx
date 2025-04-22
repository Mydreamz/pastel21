
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft } from 'lucide-react';
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
  } = useContentForm();

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="max-w-[560px] mx-auto px-4 py-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-gray-400 hover:text-white mb-6 text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-semibold mb-1">Create Locked Content</h1>
            <p className="text-gray-400 text-sm">Share and monetize your content with a secure paywall</p>
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
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => navigate('/')} 
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Create Content
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;
