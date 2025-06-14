
import { FileText } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const ContentLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-pulse w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center shadow-neumorphic">
        <FileText className="h-6 w-6 text-primary" />
      </div>
      <p className="mt-4 text-gray-700">Loading content...</p>
    </div>
  );
};

export default ContentLoader;
