
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Star, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FeedbackSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!name || !feedback) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          name,
          email: email || null,
          rating: rating || null,
          feedback_text: feedback,
          feedback_type: 'regular'
        });

      if (error) {
        console.error('Error saving feedback:', error);
        toast({
          title: "Error",
          description: "Failed to submit feedback. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
      });

      // Reset form
      setName('');
      setEmail('');
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <MessageSquare className="h-5 w-5 mr-2" />
          User Feedback
        </CardTitle>
        <CardDescription className="text-blue-600">
          Help us improve Soil LAB by sharing your experience and suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="feedbackName" className="text-blue-700 font-medium">
              Name *
            </Label>
            <Input
              id="feedbackName"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedbackEmail" className="text-blue-700 font-medium">
              Email (Optional)
            </Label>
            <Input
              id="feedbackEmail"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-700 font-medium">
            Rate your experience
          </Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 rounded ${
                  star <= rating 
                    ? 'text-yellow-500' 
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedbackText" className="text-blue-700 font-medium">
            Your Feedback *
          </Label>
          <Textarea
            id="feedbackText"
            placeholder="Share your thoughts, suggestions, or report any issues..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="border-blue-200 focus:border-blue-400 min-h-[100px]"
          />
        </div>

        <Button 
          onClick={submitFeedback}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 w-full"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
