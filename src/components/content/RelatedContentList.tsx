
import React from 'react';
import RelatedContentItem from './RelatedContentItem';

interface RelatedContentListProps {
  relatedContents: any[];
}

const RelatedContentList = ({ relatedContents }: RelatedContentListProps) => {
  if (relatedContents.length === 0) return null;
  
  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <h3 className="text-xl font-bold mb-4">More from this creator</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedContents.map((item) => (
          <RelatedContentItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default RelatedContentList;
