
import { supabase } from "@/integrations/supabase/client";

export const useViewTracking = () => {
  const trackView = async (contentId: string, userId?: string) => {
    await supabase.from('content_views').insert([{
      content_id: contentId,
      user_id: userId || null,
      timestamp: new Date().toISOString()
    }]);
  };

  return { trackView };
};
