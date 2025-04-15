
import React from 'react';
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContentType } from '../ContentTypeSelector';

export const contentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teaser: z.string().min(1, "Teaser text is required"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a positive number"
  }),
  content: z.string().min(1, "Content is required"),
  contentType: z.enum(['text', 'link', 'image', 'video', 'audio', 'document'] as const).default('text'),
  expiry: z.string().optional()
});

export type ContentFormValues = z.infer<typeof contentFormSchema>;

interface ContentFormProviderProps {
  children: React.ReactNode;
  onSubmit: (values: ContentFormValues) => void;
}

const ContentFormProvider: React.FC<ContentFormProviderProps> = ({ 
  children, 
  onSubmit 
}) => {
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      teaser: "",
      price: "0",
      content: "",
      contentType: 'text',
      expiry: ""
    }
  });
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        {children}
      </form>
    </FormProvider>
  );
};

export default ContentFormProvider;
