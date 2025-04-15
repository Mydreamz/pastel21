
import { z } from "zod";

// Schema for content form validation
export const contentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teaser: z.string().min(1, "Teaser text is required"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a positive number"
  }),
  content: z.string().min(1, "Content is required"),
  expiry: z.string().optional()
});

// Type derived from schema
export type ContentFormValues = z.infer<typeof contentFormSchema>;

// Content type with additional fields
export type Content = ContentFormValues & {
  id: string;
  contentType: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
};
