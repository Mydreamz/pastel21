
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
      <h2 className="text-xl font-bold text-gray-800">Full Content</h2>
      <div className="flex gap-2">
        {isCreator && (
          <Badge variant="outline" className="bg-pastel-500/20 text-pastel-700 border-pastel-500/30 rounded-full">
            Creator View
          </Badge>
        )}
        {isPurchased && !isCreator && (
          <Badge variant="outline" className="bg-pastel-400/20 text-pastel-700 border-pastel-400/30 rounded-full">
            Purchased
          </Badge>
        )}
        {parseFloat(price) === 0 && (
          <Badge variant="outline" className="bg-pastel-300/20 text-pastel-700 border-pastel-300/30 rounded-full">
            Free
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ContentHeader;
