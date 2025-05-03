
import { Content, ContentType } from '@/types/content';

/**
 * Transforms a database row into a Content object
 */
export const supabaseToContent = (row: any): Content => ({
  id: row.id,
  title: row.title,
  teaser: row.teaser,
  price: row.price,
  content: row.content,
  contentType: row.content_type as ContentType,
  creatorId: row.creator_id,
  creatorName: row.creator_name,
  expiry: row.expiry || undefined,
  scheduledFor: row.scheduled_for || undefined,
  scheduledTime: row.scheduled_time || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  status: row.status || 'published',
  fileUrl: row.file_url || undefined,
  fileName: row.file_name || undefined,
  fileType: row.file_type || undefined,
  fileSize: row.file_size || undefined,
  filePath: row.file_path || undefined,
  tags: row.tags || [],
  category: row.category || undefined,
  views: row.views ?? undefined
});
