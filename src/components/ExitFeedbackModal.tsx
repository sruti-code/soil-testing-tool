
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ExitFeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasShown) {
        e.preventDefault();
        setIsOpen(true);
        setHasShown(true);
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasShown]);

  const handleFeedback = async (liked: boolean) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          feedback_text: liked ? 'User liked the experience' : 'User did not like the experience',
          feedback_type: 'exit',
          liked: liked
        });

      if (error) {
        console.error('Error saving exit feedback:', error);
      }
    } catch (error) {
      console.error('Error submitting exit feedback:', error);
    }
    
    toast({
      title: liked ? "Thanks for the love! ❤️" : "Sorry to see you go 😢",
      description: liked ? "We're glad you enjoyed Soil LAB!" : "We'll work to improve your experience.",
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Before you go...</DialogTitle>
          <DialogDescription className="text-center">
            How was your experience with Soil LAB?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-6 py-4">
          <Button
            onClick={() => handleFeedback(true)}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            size="lg"
          >
            <ThumbsUp className="h-5 w-5" />
            I liked it!
          </Button>
          <Button
            onClick={() => handleFeedback(false)}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
            size="lg"
          >
            <ThumbsDown className="h-5 w-5" />
            Not so much
          </Button>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          className="absolute right-4 top-4"
          size="sm"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExitFeedbackModal;
