
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ContentHeaderProps {
  isCreator: boolean;
  isPurchased: boolean;
  price: string;
}

const ContentHeader = ({ isCreator, isPurchased, price }: ContentHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-foreground">Full Content</h2>
      <div className="flex gap-2">
        {isCreator && (
          <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30 rounded-full">
            Creator View
          </Badge>
        )}
        {isPurchased && !isCreator && (
          <Badge variant="outline" className="bg-green-400/20 text-green-700 border-green-400/30 rounded-full">
            Purchased
          </Badge>
        )}
        {parseFloat(price) === 0 && (
          <Badge variant="outline" className="bg-green-300/20 text-green-700 border-green-300/30 rounded-full">
            Free
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ContentHeader;
