
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function TesterNotePopup() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Check if this is the first visit
    const hasSeenTesterNote = localStorage.getItem('hasSeenTesterNote');
    
    if (!hasSeenTesterNote) {
      // If first visit, show the popup
      setIsOpen(true);
      // Mark as seen for future visits
      localStorage.setItem('hasSeenTesterNote', 'true');
    }
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md border-purple-300 dark:border-purple-700">
        <DialogHeader>
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogTitle className="text-lg font-medium text-purple-700 dark:text-purple-400">
            Tester's Note
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 my-2">
          <DialogDescription className="text-sm text-purple-800 dark:text-purple-300 space-y-3">
            <p className="font-medium">Thanks for taking the time to test Northstar in its early days — I really appreciate you.</p>
            
            <p>There's so much more Northstar could do…<br />
            But for now, I've kept it intentionally simple.</p>
            
            <p>I'm looking for honest, early feedback — what works, what doesn't, what feels missing.</p>
            
            <p>Please take notes as you go.<br />
            At the end, you'll find a space to share your thoughts.</p>
            
            <p>Your input helps shape where this goes next.</p>
          </DialogDescription>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
          >
            Got it, thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
