
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Lock, LinkIcon, Image, FileVideo, FileAudio, FileText, Calendar, DollarSign } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StarsBackground from '@/components/StarsBackground';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';
import { ContentType } from '@/types/content';

const contentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teaser: z.string().min(1, "Teaser text is required"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a positive number"
  }),
  content: z.string().min(1, "Content is required"),
  expiry: z.string().optional()
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

const contentTypes = [
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'link', label: 'Link', icon: LinkIcon },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: FileVideo },
  { id: 'audio', label: 'Audio', icon: FileAudio },
  { id: 'document', label: 'Document', icon: FileText }
];

const EditContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('text');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user, session } = useAuth();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      teaser: "",
      price: "0",
      content: "",
      expiry: ""
    }
  });

  useEffect(() => {
    const loadContent = async () => {
      if (!session || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to edit content",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        const { data: content, error } = await supabase
          .from('contents')
          .select('*')
          .eq('id', id)
          .eq('creator_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (content) {
          form.reset({
            title: content.title,
            teaser: content.teaser,
            price: content.price.toString(),
            content: content.content || '',
            expiry: content.expiry || ""
          });
          
          setSelectedContentType(content.content_type as ContentType);
          if (content.expiry) {
            setShowAdvanced(true);
          }
        } else {
          toast({
            title: "Content not found",
            description: "The content you're trying to edit couldn't be found or you don't have permission to edit it.",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error: any) {
        console.error("Error loading content:", error);
        toast({
          title: "Error",
          description: "Failed to load content data: " + error.message,
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [id, form, navigate, toast, user, session]);

  const onSubmit = async (values: ContentFormValues) => {
    if (!session || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to edit content",
        variant: "destructive"
      });
      return;
    }

    try {
      const updates = {
        title: values.title,
        teaser: values.teaser,
        price: values.price,
        content: values.content,
        content_type: selectedContentType,
        expiry: values.expiry || null,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('contents')
        .update(updates)
        .eq('id', id)
        .eq('creator_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Content updated",
        description: "Your content has been successfully updated.",
      });
      
      navigate('/profile');
    } catch (error: any) {
      console.error("Error updating content:", error);
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your content.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin h-8 w-8 border-t-2 border-emerald-500 border-r-2 rounded-full mr-3"></div>
        Loading content...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      {/* Background elements */}
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <Card className="glass-card border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">Edit Content</CardTitle>
            <CardDescription className="text-gray-300">
              Update your content details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title for your content" className="bg-white/5 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="teaser" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Public Teaser <span className="text-gray-400 text-sm">(visible to everyone)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write a teaser that will make people want to unlock your content" className="h-24 bg-white/5 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" /> Unlock Price
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" min="0" step="0.01" placeholder="5.00" className="pl-8 bg-white/5 border-white/10 text-white" {...field} />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      Set to 0 for free content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="space-y-4 sm:space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Locked Content
                  </h3>
                  
                  <Tabs value={selectedContentType} onValueChange={(value) => setSelectedContentType(value as ContentType)} className="w-full">
                    <TabsList className={`grid ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3 md:grid-cols-6'} bg-white/5 border border-white/10 p-1`}>
                      {contentTypes.map(type => (
                        <TabsTrigger key={type.id} value={type.id} className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white flex items-center justify-center h-10 px-2 text-xs sm:text-sm">
                          <type.icon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{type.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    <div className="mt-4 sm:mt-2">
                      <TabsContent value="text" className="p-4 bg-white/5 border border-white/10 rounded-md">
                        <FormField control={form.control} name="content" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea placeholder="Write your premium content here" className="h-40 bg-white/5 border-white/10 text-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </TabsContent>
                      
                      <TabsContent value="link" className="p-4 bg-white/5 border border-white/10 rounded-md">
                        <FormField control={form.control} name="content" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="https://example.com/your-premium-link" className="bg-white/5 border-white/10 text-white" {...field} />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                              Enter the URL you want to share with paying users
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </TabsContent>
                      
                      <TabsContent value="image" className="p-4 bg-white/5 border border-white/10 rounded-md">
                        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-md">
                          <Image className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-gray-400">Drag & drop image or <span className="text-emerald-500">browse</span></p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="video" className="p-4 bg-white/5 border border-white/10 rounded-md">
                        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-md">
                          <FileVideo className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-gray-400">Drag & drop video or <span className="text-emerald-500">browse</span></p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="audio" className="p-4 bg-white/5 border border-white/10 rounded-md">
                        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-md">
                          <FileAudio className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-gray-400">Drag & drop audio or <span className="text-emerald-500">browse</span></p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="document" className="p-4 bg-white/5 border border-white/10 rounded-md">
                        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-md">
                          <FileText className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-gray-400">Drag & drop document or <span className="text-emerald-500">browse</span></p>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
                
                <div className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="text-gray-300 border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/10">
                    {showAdvanced ? "Hide" : "Show"} Advanced Settings
                  </Button>
                  
                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-white/5 border border-white/10 rounded-md">
                      <FormField control={form.control} name="expiry" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Expiry Date (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input type="datetime-local" className="bg-white/5 border-white/10 text-white" {...field} />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Set a date when this content will no longer be available
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/profile')} className="border-gray-700 hover:border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Update Content
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

export default EditContent;
