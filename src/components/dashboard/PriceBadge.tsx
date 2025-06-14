
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
      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 rounded-full">
        <IndianRupee className="h-3 w-3 mr-1 text-emerald-700" />
        {parseFloat(price).toFixed(2)}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-emerald-300/20 text-emerald-700 border-emerald-300/30 rounded-full">
      Free
    </Badge>
  );
};

export default PriceBadge;
