
import { Content } from '@/types/content';

interface ContentDisplayProps {
  content: Content;
}

const ContentDisplay = ({ content }: ContentDisplayProps) => {
  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <h2 className="text-xl font-bold mb-4">Full Content</h2>
      {content.contentType === 'text' && content.content && (
        <div className="prose prose-invert max-w-none">
          <p>{content.content}</p>
        </div>
      )}
      
      {content.contentType === 'link' && content.content && (
        <div className="bg-white/5 p-4 rounded-md">
          <a 
            href={content.content} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline break-all"
          >
            {content.content}
          </a>
        </div>
      )}
      
      {content.fileUrl && (
        <div className="mt-4">
          {content.contentType === 'image' && (
            <img 
              src={content.fileUrl} 
              alt={content.title} 
              className="max-w-full rounded-md"
            />
          )}
          
          {content.contentType === 'video' && (
            <video 
              controls 
              className="w-full rounded-md"
            >
              <source src={content.fileUrl} type={content.fileType} />
              Your browser does not support the video tag.
            </video>
          )}
          
          {content.contentType === 'audio' && (
            <audio 
              controls 
              className="w-full"
            >
              <source src={content.fileUrl} type={content.fileType} />
              Your browser does not support the audio tag.
            </audio>
          )}
          
          {content.contentType === 'document' && (
            <div className="bg-white/5 p-4 rounded-md">
              <a 
                href={content.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center"
              >
                Download {content.fileName || 'Document'}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;
