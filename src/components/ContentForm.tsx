import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the schema for form validation
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  teaser: z.string().min(10, {
    message: "Teaser must be at least 10 characters.",
  }),
  content: z.string().min(1, {
    message: "Content is required.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a valid number.",
  }),
  contentType: z.enum(["text", "link", "image", "video", "audio", "document"], {
    required_error: "Please select a content type.",
  }),
  expiry: z.string().optional(),
});

export type ContentFormValues = z.infer<typeof formSchema>;

export interface ContentFormProps {
  onSubmit: (values: ContentFormValues) => void;
  onCancel: () => void;
  initialValues?: ContentFormValues; // Add initialValues as an optional prop
}

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  // Initialize the form with default values or provided initialValues
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      teaser: "",
      content: "",
      price: "0",
      contentType: "text",
      expiry: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = (values: ContentFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter content title" {...field} />
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
              <FormLabel>Teaser</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a short teaser for your content"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the full content here"
                  className="resize-none h-48"
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
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Enter price" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a content type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date (Optional)</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormDescription>
                Set an optional expiry date for the content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentForm;
