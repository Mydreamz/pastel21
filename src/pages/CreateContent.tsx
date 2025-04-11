
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Lock, LinkIcon, Image, FileVideo, FileAudio, FileText, Calendar, DollarSign } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StarsBackground from '@/components/StarsBackground';
import { useIsMobile } from '@/hooks/use-mobile';

const contentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teaser: z.string().min(1, "Teaser text is required"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a positive number",
  }),
  content: z.string().min(1, "Content is required"),
  expiry: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

const contentTypes = [
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'link', label: 'Link', icon: LinkIcon },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: FileVideo },
  { id: 'audio', label: 'Audio', icon: FileAudio },
  { id: 'document', label: 'Document', icon: FileText },
];

const CreateContent = () => {
  const navigate = useNavigate();
  const [selectedContentType, setSelectedContentType] = useState<string>('text');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      teaser: "",
      price: "0",
      content: "",
      expiry: "",
    },
  });

  const onSubmit = (values: ContentFormValues) => {
    console.log("Form submitted with values:", values);
    // Here you would typically save the content to your backend
    // For now, we'll just show a success dialog
    
    // After saving, navigate back to home
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      {/* Background elements */}
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <Card className="glass-card border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">Create Locked Content</CardTitle>
            <CardDescription className="text-gray-300">
              Share and monetize your content with a secure paywall
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter a title for your content" 
                          className="bg-white/5 border-white/10 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="teaser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Public Teaser <span className="text-gray-400 text-sm">(visible to everyone)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write a teaser that will make people want to unlock your content" 
                          className="h-24 bg-white/5 border-white/10 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Unlock Price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            min="0"
                            step="0.01"
                            placeholder="5.00" 
                            className="pl-8 bg-white/5 border-white/10 text-white" 
                            {...field} 
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Set to 0 for free content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Locked Content
                  </h3>
                  
                  <Tabs 
                    defaultValue="text" 
                    value={selectedContentType} 
                    onValueChange={setSelectedContentType}
                    className="w-full"
                  >
                    <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-3 md:grid-cols-6'} bg-white/5 border border-white/10 p-1`}>
                      {contentTypes.map((type) => (
                        <TabsTrigger 
                          key={type.id} 
                          value={type.id}
                          className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white flex items-center justify-center h-10 px-2 text-xs sm:text-sm"
                        >
                          <type.icon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{type.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    <TabsContent value="text" className="p-4 bg-white/5 border border-white/10 rounded-md mt-2">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                placeholder="Write your premium content here" 
                                className="h-40 bg-white/5 border-white/10 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="link" className="p-4 bg-white/5 border border-white/10 rounded-md mt-2">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/your-premium-link" 
                                className="bg-white/5 border-white/10 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                              Enter the URL you want to share with paying users
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="image" className="p-4 bg-white/5 border border-white/10 rounded-md mt-2">
                      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-md">
                        <Image className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-400">Drag & drop image or <span className="text-emerald-500">browse</span></p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="video" className="p-4 bg-white/5 border border-white/10 rounded-md mt-2">
                      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-md">
                        <FileVideo className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-400">Drag & drop video or <span className="text-emerald-500">browse</span></p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="audio" className="p-4 bg-white/5 border border-white/10 rounded-md mt-2">
                      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-md">
                        <FileAudio className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-400">Drag & drop audio or <span className="text-emerald-500">browse</span></p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="document" className="p-4 bg-white/5 border border-white/10 rounded-md mt-2">
                      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-md">
                        <FileText className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-400">Drag & drop document or <span className="text-emerald-500">browse</span></p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-gray-300 border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/10"
                  >
                    {showAdvanced ? "Hide" : "Show"} Advanced Settings
                  </Button>
                  
                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-white/5 border border-white/10 rounded-md">
                      <FormField
                        control={form.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" /> Expiry Date (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local" 
                                className="bg-white/5 border-white/10 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                              Set a date when this content will no longer be available
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    className="border-gray-700 hover:border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
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
