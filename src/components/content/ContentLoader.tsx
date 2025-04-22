
import { FileText } from 'lucide-react';

const ContentLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-pulse w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <FileText className="h-6 w-6 text-emerald-500" />
      </div>
      <p className="mt-4 text-gray-400">Loading content...</p>
    </div>
  );
};

export default ContentLoader;
