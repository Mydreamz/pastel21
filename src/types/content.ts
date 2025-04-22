import { z } from "zod";

export const contentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teaser: z.string().min(1, "Teaser text is required"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a positive number"
  }),
  content: z.string().min(1, "Content is required when using text or link").optional(),
  expiry: z.string().optional(),
  scheduledFor: z.date().optional(),
  scheduledTime: z.string().optional()
});

export type ContentFormValues = z.infer<typeof contentFormSchema> & {
  file?: File | null;
};

export type ContentType = 'text' | 'link' | 'image' | 'video' | 'audio' | 'document';

export type Content = ContentFormValues & {
  id: string;
  contentType: ContentType;
  creatorId: string;
  creatorName: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'scheduled' | 'published';
};
