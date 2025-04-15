import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField, FormItem, FormControl, FormDescription, FormMessage, FormLabel } from "@/components/ui/form";
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
const contentTypes = [{
  id: 'text',
  label: 'Text',
  icon: FileText
}, {
  id: 'link',
  label: 'Link',
  icon: LinkIcon
}, {
  id: 'image',
  label: 'Image',
  icon: Image
}, {
  id: 'video',
  label: 'Video',
  icon: FileVideo
}, {
  id: 'audio',
  label: 'Audio',
  icon: FileAudio
}, {
  id: 'document',
  label: 'Document',
  icon: FileText
}];
const ContentTypeSelector = (props: ContentTypeSelectorProps) => {
  const {
    form,
    selectedContentType,
    setSelectedContentType
  } = props;
  const isMobile = useIsMobile();
  return <div className="space-y-4 sm:space-y-3 w-full">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Lock className="h-4 w-4" /> Locked Content
      </h3>
      
      <Tabs defaultValue="text" value={selectedContentType} onValueChange={setSelectedContentType} className="w-full">
        <TabsList className={`
          grid 
          ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3 md:grid-cols-6 gap-1'} 
          bg-white/5 
          border 
          border-white/10 
          p-1 
          rounded-md
        `}>
          {contentTypes.map(type => <TabsTrigger key={type.id} value={type.id} className="m-1\n">
              <type.icon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{type.label}</span>
            </TabsTrigger>)}
        </TabsList>
        
        <div className="mt-2 sm:mt-2 space-y-2">
          <TabsContent value="text" className="p-4 bg-white/5 border border-white/10 rounded-md">
            <FormField control={form.control} name="content" render={({
            field
          }) => <FormItem>
                <FormControl>
                  <Textarea placeholder="Write your premium content here" className="h-40 bg-white/5 border-white/10 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          </TabsContent>
          
          <TabsContent value="link" className="p-4 bg-white/5 border border-white/10 rounded-md">
            <FormField control={form.control} name="content" render={({
            field
          }) => <FormItem>
                <FormControl>
                  <Input placeholder="https://example.com/your-premium-link" className="bg-white/5 border-white/10 text-white" {...field} />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Enter the URL you want to share with paying users
                </FormDescription>
                <FormMessage />
              </FormItem>} />
          </TabsContent>
          
          <TabsContent value="image" className="p-4 bg-white/5 border border-white/10 rounded-md">
            <div className="space-y-4">
              {props.setSelectedFile && <FileUpload type="image" value={props.selectedFile || null} onChange={file => props.setSelectedFile && props.setSelectedFile(file)} />}
              
              <FormField control={form.control} name="content" render={({
              field
            }) => <FormItem>
                  <FormLabel className="text-gray-400 text-sm">Image caption/description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a description for your image..." className="bg-white/5 border-white/10 text-white h-16" {...field} />
                  </FormControl>
                </FormItem>} />
            </div>
          </TabsContent>
          
          <TabsContent value="video" className="p-4 bg-white/5 border border-white/10 rounded-md top-16">
            <div className="space-y-4">
              {props.setSelectedFile && <FileUpload type="video" value={props.selectedFile || null} onChange={file => props.setSelectedFile && props.setSelectedFile(file)} />}
              
              <FormField control={form.control} name="content" render={({
              field
            }) => <FormItem>
                  <FormLabel className="text-gray-400 text-sm">Video title/description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a description for your video..." className="bg-white/5 border-white/10 text-white h-16" {...field} />
                  </FormControl>
                </FormItem>} />
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="p-4 bg-white/5 border border-white/10 rounded-md">
            <div className="space-y-4">
              {props.setSelectedFile && <FileUpload type="audio" value={props.selectedFile || null} onChange={file => props.setSelectedFile && props.setSelectedFile(file)} />}
              
              <FormField control={form.control} name="content" render={({
              field
            }) => <FormItem>
                  <FormLabel className="text-gray-400 text-sm">Audio title/description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a description for your audio..." className="bg-white/5 border-white/10 text-white h-16" {...field} />
                  </FormControl>
                </FormItem>} />
            </div>
          </TabsContent>
          
          <TabsContent value="document" className="p-4 bg-white/5 border border-white/10 rounded-md">
            <div className="space-y-4">
              {props.setSelectedFile && <FileUpload type="document" value={props.selectedFile || null} onChange={file => props.setSelectedFile && props.setSelectedFile(file)} />}
              
              <FormField control={form.control} name="content" render={({
              field
            }) => <FormItem>
                  <FormLabel className="text-gray-400 text-sm">Document description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a description for your document..." className="bg-white/5 border-white/10 text-white h-16" {...field} />
                  </FormControl>
                </FormItem>} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>;
};
export default ContentTypeSelector;