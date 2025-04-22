
import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, addDays, isBefore } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type ScheduleInfo = {
  date: Date;
  time: string;
};

type ContentSchedulerProps = {
  contentId: string;
  contentTitle: string;
  onSchedule: (scheduleInfo: ScheduleInfo) => void;
};

const ContentScheduler = ({ contentId, contentTitle, onSchedule }: ContentSchedulerProps) => {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [time, setTime] = useState('12:00');
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for scheduling",
        variant: "destructive"
      });
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const scheduleDate = new Date(date);
    scheduleDate.setHours(hours, minutes);

    if (isBefore(scheduleDate, new Date())) {
      toast({
        title: "Invalid time",
        description: "Schedule time must be in the future",
        variant: "destructive"
      });
      return;
    }

    onSchedule({ date: scheduleDate, time });

    toast({
      title: "Content scheduled",
      description: `"${contentTitle}" will be published on ${format(scheduleDate, "PPP 'at' p")}`,
    });
  };

  return (
    <Card className="glass-card border-white/10 text-white">
      <CardHeader>
        <CardTitle>Schedule Publication</CardTitle>
        <CardDescription className="text-gray-400">
          Set a future date and time for your content to be published
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span>Select a date</span>
          </div>
          <div className="border border-white/10 rounded-md p-3 bg-white/5">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => isBefore(date, new Date()) && date.getDate() !== new Date().getDate()}
              className="mx-auto"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>Select a time</span>
          </div>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleSchedule} 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Schedule Content
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentScheduler;
