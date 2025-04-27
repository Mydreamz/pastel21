
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { DollarSign } from 'lucide-react';

interface PriceBadgeProps {
  price: string;
}

const PriceBadge: React.FC<PriceBadgeProps> = ({ price }) => {
  const isPaid = parseFloat(price) > 0;
  
  if (isPaid) {
    return (
      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
        <DollarSign className="h-3 w-3 mr-1" />
        {parseFloat(price).toFixed(2)}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
      Free
    </Badge>
  );
};

export default PriceBadge;
