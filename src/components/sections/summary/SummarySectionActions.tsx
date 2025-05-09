
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface SummarySectionActionsProps {
  onPrevious: () => void;
}

export function SummarySectionActions({ onPrevious }: SummarySectionActionsProps) {
  const { setCurrentSection } = useDesignBrief();
  const [isSending, setIsSending] = useState(false);
  
  const handleContinue = () => {
    setIsSending(true);
    
    // Simulate sending process
    setTimeout(() => {
      toast.success("Design brief completed successfully!", {
        description: "Your architect will be in touch with you soon.",
        duration: 5000
      });
      setIsSending(false);
      setCurrentSection('feedback');
      window.scrollTo(0, 0);
    }, 1500);
  };
  
  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        className="group transition-all duration-200 active:scale-95"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Previous: Communication</span>
      </Button>
      
      <Button
        onClick={handleContinue}
        disabled={isSending}
        className="bg-yellow-500 hover:bg-yellow-600 text-black transition-all duration-200 active:scale-95 group relative"
      >
        {isSending ? (
          <>
            <span className="inline-block animate-pulse">Processing...</span>
            <span className="ml-2 h-4 w-4 inline-block animate-spin rounded-full border-2 border-b-transparent"></span>
          </>
        ) : (
          <>
            <span>Continue to Feedback Form</span>
            <span className="absolute right-2 opacity-0 group-active:opacity-100 transition-opacity">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </span>
          </>
        )}
      </Button>
    </div>
  );
}
