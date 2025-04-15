
import { z } from "zod";

// Schema for content form validation
export const contentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teaser: z.string().min(1, "Teaser text is required"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a positive number"
  }),
  content: z.string().min(1, "Content is required when using text or link").optional(),
  expiry: z.string().optional()
});

// Type derived from schema
export type ContentFormValues = z.infer<typeof contentFormSchema> & {
  file?: File | null;
};

// Content type with additional fields
export type Content = ContentFormValues & {
  id: string;
  contentType: string;
  creatorId: string;
  creatorName: string;
  fileUrl?: string; // URL for uploaded files (used in storage)
  fileName?: string; // Name of the uploaded file
  fileType?: string; // MIME type of the uploaded file
  fileSize?: number; // Size of the uploaded file in bytes
  createdAt: string;
  updatedAt: string;
};
