
import React from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerClose
} from "@/components/ui/drawer";
import TutorialContent from './TutorialContent';
import { X } from 'lucide-react';

interface TutorialDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialDrawer = ({ isOpen, onClose }: TutorialDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-white/90 backdrop-blur-lg max-h-[90%] rounded-t-3xl pt-6">
        <div className="absolute top-2 right-2">
          <DrawerClose asChild>
            <button 
              className="h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100/60"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </DrawerClose>
        </div>
        <TutorialContent onClose={onClose} />
      </DrawerContent>
    </Drawer>
  );
};

export default TutorialDrawer;
