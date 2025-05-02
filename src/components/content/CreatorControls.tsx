
import { Button } from "@/components/ui/button";
import { CalendarClock } from 'lucide-react';
import { useState } from 'react';
import ContentScheduler from './ContentScheduler';

interface CreatorControlsProps {
  contentId: string;
  contentTitle: string;
  onSchedule: (scheduleInfo: { date: Date; time: string }) => void;
}

const CreatorControls = ({ contentId, contentTitle, onSchedule }: CreatorControlsProps) => {
  const [showScheduler, setShowScheduler] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowScheduler(!showScheduler)}
        variant="outline"
        className="border-pastel-200 hover:border-pastel-500 text-gray-700 rounded-xl"
      >
        <CalendarClock className="mr-2 h-4 w-4" />
        {showScheduler ? 'Hide Scheduler' : 'Schedule Content'}
      </Button>

      {showScheduler && (
        <div className="mt-4 glass-card p-4">
          <ContentScheduler
            contentId={contentId}
            contentTitle={contentTitle}
            onSchedule={onSchedule}
          />
        </div>
      )}
    </>
  );
};

export default CreatorControls;
