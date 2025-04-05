
import React from 'react';
import { Button } from '@/components/ui/button';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { toast } from 'sonner';

interface SummarySectionActionsProps {
  onPrevious: () => void;
}

export function SummarySectionActions({ onPrevious }: SummarySectionActionsProps) {
  const { setCurrentSection } = useDesignBrief();
  
  const handleContinue = () => {
    toast.info("Opening feedback form...");
    setCurrentSection('feedback');
  };
  
  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        className="w-[120px]"
      >
        Previous
      </Button>
      
      <Button
        onClick={handleContinue}
        className="w-[120px] bg-yellow-500 hover:bg-yellow-600 text-black"
      >
        Continue to Feedback
      </Button>
    </div>
  );
}
