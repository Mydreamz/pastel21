
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, LinkIcon, Image, FileVideo, FileAudio, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';

type ContentTypeSelectorProps = {
  form: UseFormReturn<ContentFormValues>;
  selectedContentType: string;
  setSelectedContentType: (type: string) => void;
};

const contentTypes = [
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'link', label: 'Link', icon: LinkIcon },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: FileVideo },
  { id: 'audio', label: 'Audio', icon: FileAudio },
  { id: 'document', label: 'Document', icon: FileText }
];

const ContentTypeSelector = ({ form, selectedContentType, setSelectedContentType }: ContentTypeSelectorProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 sm:space-y-3">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Lock className="h-4 w-4" /> Locked Content
      </h3>
      
      <Tabs defaultValue="text" value={selectedContentType} onValueChange={setSelectedContentType} className="w-full pt-13">
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
          
          <TabsContent value="video" className="p-4 bg-white/5 border border-white/10 rounded-md px-[28px] py-[35px] mt-16">
            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-md">
              <FileVideo className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-400">Drag & drop video or <span className="text-emerald-500">browse</span></p>
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="p-4 bg-white/5 border border-white/10 rounded-md mt-16">
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
  );
};

export default ContentTypeSelector;
