import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, LinkIcon, Image, FileVideo, FileAudio, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';
import { FileUpload } from "@/components/ui/file-upload";

type ContentTypeSelectorProps = {
  form: UseFormReturn<ContentFormValues>;
  selectedContentType: string;
  setSelectedContentType: (type: string) => void;
  selectedFile?: File | null;
  setSelectedFile?: (file: File | null) => void;
};

const contentTypes = [
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'link', label: 'Link', icon: LinkIcon },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: FileVideo },
  { id: 'audio', label: 'Audio', icon: FileAudio },
  { id: 'document', label: 'Document', icon: FileText }
];

const ContentTypeSelector = (props: ContentTypeSelectorProps) => {
  const { form, selectedContentType, setSelectedContentType } = props;
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium flex items-center gap-2 mb-2 text-gray-400">
        <Lock className="h-4 w-4" /> Locked Content
      </h3>
      
      <Tabs 
        defaultValue="text" 
        value={selectedContentType} 
        onValueChange={setSelectedContentType} 
        className="w-full"
      >
        <TabsList className={`
          grid w-full
          ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} 
          gap-1
          bg-transparent
          p-0
          mb-2
        `}>
          {contentTypes.map(type => (
            <TabsTrigger 
              key={type.id} 
              value={type.id} 
              className="
                data-[state=active]:bg-emerald-500
                data-[state=active]:text-white 
                bg-white/5
                hover:bg-white/10
                border
                border-white/10
                flex 
                items-center 
                gap-2
                justify-center 
                h-10 
                px-4
                text-sm
                rounded-md
                transition-colors
              "
            >
              <type.icon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden md:inline">{type.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="space-y-2">
          <TabsContent value="text" className="p-0">
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Write your premium content here" 
                    className="min-h-[200px] bg-white/5 border-white/10 text-white resize-none rounded-md" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          
          <TabsContent value="link" className="p-0">
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/your-premium-link" 
                    className="bg-white/5 border-white/10 text-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          
          <TabsContent value="image" className="p-0">
            <div className="space-y-2">
              {props.setSelectedFile && (
                <FileUpload 
                  type="image"
                  value={props.selectedFile || null}
                  onChange={(file) => props.setSelectedFile && props.setSelectedFile(file)}
                />
              )}
              
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400 text-xs">Image caption/description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description for your image..." 
                      className="bg-white/5 border-white/10 text-white h-16 resize-none rounded-md" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>
          
          <TabsContent value="video" className="p-0">
            <div className="space-y-2">
              {props.setSelectedFile && (
                <FileUpload 
                  type="video"
                  value={props.selectedFile || null}
                  onChange={(file) => props.setSelectedFile && props.setSelectedFile(file)}
                />
              )}
              
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400 text-xs">Video title/description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description for your video..." 
                      className="bg-white/5 border-white/10 text-white h-16 resize-none rounded-md" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="p-0">
            <div className="space-y-2">
              {props.setSelectedFile && (
                <FileUpload 
                  type="audio"
                  value={props.selectedFile || null}
                  onChange={(file) => props.setSelectedFile && props.setSelectedFile(file)}
                />
              )}
              
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400 text-xs">Audio title/description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description for your audio..." 
                      className="bg-white/5 border-white/10 text-white h-16 resize-none rounded-md" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>
          
          <TabsContent value="document" className="p-0">
            <div className="space-y-2">
              {props.setSelectedFile && (
                <FileUpload 
                  type="document"
                  value={props.selectedFile || null}
                  onChange={(file) => props.setSelectedFile && props.setSelectedFile(file)}
                />
              )}
              
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400 text-xs">Document description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description for your document..." 
                      className="bg-white/5 border-white/10 text-white h-16 resize-none rounded-md" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ContentTypeSelector;
