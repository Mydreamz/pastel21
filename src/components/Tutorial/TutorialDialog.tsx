
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TutorialContent from './TutorialContent';

interface TutorialDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialDialog = ({ isOpen, onClose }: TutorialDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-cream-50/90 border-cream-200/50 backdrop-blur-lg rounded-2xl p-0 w-full max-w-md shadow-neumorphic">
        <TutorialContent onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
