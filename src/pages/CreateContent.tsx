
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
      expiry: ""
    }
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <FormField 
                  control={form.control} 
                  name="title" 
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter a title for your content" 
                          className="bg-white/5 border-white/10 text-white h-10" 
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
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-sm">
                        Public Teaser <span className="text-gray-400 text-xs">(visible to everyone)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write a teaser that will make people want to unlock your content" 
                          className="h-20 bg-white/5 border-white/10 text-white" 
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
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4" /> Unlock Price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="5.00" 
                            className="pl-8 bg-white/5 border-white/10 text-white h-10" 
                            {...field} 
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-400 text-xs">
                        Set to 0 for free content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <div className="space-y-3">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Locked Content
                  </h3>
                  
                  <Tabs 
                    defaultValue="text" 
                    value={selectedContentType} 
                    onValueChange={setSelectedContentType} 
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 w-full bg-white/5 border border-white/10 p-1 overflow-x-auto flex-nowrap">
                      {contentTypes.slice(0, 3).map(type => (
                        <TabsTrigger 
                          key={type.id} 
                          value={type.id} 
                          className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white flex items-center justify-center h-9 px-1 text-xs"
                        >
                          <type.icon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span className="truncate">{type.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    <div className="mt-3 mb-2">
                      <TabsList className="grid grid-cols-3 w-full bg-white/5 border border-white/10 p-1 overflow-x-auto flex-nowrap">
                        {contentTypes.slice(3).map(type => (
                          <TabsTrigger 
                            key={type.id} 
                            value={type.id} 
                            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white flex items-center justify-center h-9 px-1 text-xs"
                          >
                            <type.icon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                            <span className="truncate">{type.label}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                    
                    <div className="mt-3">
                      <TabsContent value="text" className="p-3 bg-white/5 border border-white/10 rounded-md">
                        <FormField 
                          control={form.control} 
                          name="content" 
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  placeholder="Write your premium content here" 
                                  className="h-32 bg-white/5 border-white/10 text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                      </TabsContent>
                      
                      <TabsContent value="link" className="p-3 bg-white/5 border border-white/10 rounded-md">
                        <FormField 
                          control={form.control} 
                          name="content" 
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/your-premium-link" 
                                  className="bg-white/5 border-white/10 text-white h-10" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription className="text-gray-400 text-xs mt-1">
                                Enter the URL you want to share with paying users
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                      </TabsContent>
                      
                      <TabsContent value="image" className="p-3 bg-white/5 border border-white/10 rounded-md">
                        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md">
                          <Image className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-400 text-xs text-center px-2">
                            Drag & drop image or <span className="text-emerald-500">browse</span>
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="video" className="p-3 bg-white/5 border border-white/10 rounded-md">
                        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md">
                          <FileVideo className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-400 text-xs text-center px-2">
                            Drag & drop video or <span className="text-emerald-500">browse</span>
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="audio" className="p-3 bg-white/5 border border-white/10 rounded-md">
                        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md">
                          <FileAudio className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-400 text-xs text-center px-2">
                            Drag & drop audio or <span className="text-emerald-500">browse</span>
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="document" className="p-3 bg-white/5 border border-white/10 rounded-md">
                        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md">
                          <FileText className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-400 text-xs text-center px-2">
                            Drag & drop document or <span className="text-emerald-500">browse</span>
                          </p>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
                
                <div className="pt-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAdvanced(!showAdvanced)} 
                    className="text-gray-300 border-gray-700 text-xs h-8 hover:border-emerald-500 hover:bg-emerald-500/10 w-full sm:w-auto"
                  >
                    {showAdvanced ? "Hide" : "Show"} Advanced Settings
                  </Button>
                  
                  {showAdvanced && (
                    <div className="mt-3 space-y-3 p-3 bg-white/5 border border-white/10 rounded-md">
                      <FormField 
                        control={form.control} 
                        name="expiry" 
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" /> Expiry Date (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local" 
                                className="bg-white/5 border-white/10 text-white h-10" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-gray-400 text-xs">
                              Set a date when this content will no longer be available
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/')} 
                    className="border-gray-700 hover:border-gray-600 text-gray-300 h-9 order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 order-1 sm:order-2"
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
