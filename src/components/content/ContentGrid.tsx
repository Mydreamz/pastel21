
import React from 'react';
import ContentPreview from '@/components/ContentPreview';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentType } from './ContentTypeSelector';

// Sample content data
export interface ContentItem {
  id: string;
  title: string;
  teaser: string;
  price: number;
  type: ContentType;
  expiryDate?: string;
  createdAt: string;
}

interface ContentGridProps {
  items: ContentItem[];
  selectedType?: ContentType | 'all';
}

const ContentGrid: React.FC<ContentGridProps> = ({ items, selectedType = 'all' }) => {
  const filteredItems = selectedType === 'all' 
    ? items 
    : items.filter(item => item.type === selectedType);
  
  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="flex">
              <ContentPreview
                title={item.title}
                teaser={item.teaser}
                price={item.price}
                type={item.type}
                expiryDate={item.expiryDate}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-400">
            No content available for this type.
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ContentGrid;
