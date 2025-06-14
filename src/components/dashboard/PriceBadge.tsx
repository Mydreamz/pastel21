
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from 'lucide-react';

interface PriceBadgeProps {
  price: string;
}

const PriceBadge: React.FC<PriceBadgeProps> = ({ price }) => {
  const isPaid = parseFloat(price) > 0;
  
  if (isPaid) {
    return (
      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 rounded-full shadow-neumorphic-sm">
        <IndianRupee className="h-3 w-3 mr-1 text-primary" />
        {parseFloat(price).toFixed(2)}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-green-100/50 text-primary border-green-300/50 rounded-full shadow-neumorphic-sm">
      Free
    </Badge>
  );
};

export default PriceBadge;
