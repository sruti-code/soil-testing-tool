
-- Create feedback table to store all user feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT NOT NULL,
  feedback_type TEXT NOT NULL DEFAULT 'regular' CHECK (feedback_type IN ('regular', 'exit')),
  liked BOOLEAN, -- for exit feedback
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert feedback (no auth required for feedback)
CREATE POLICY "Anyone can submit feedback" 
  ON public.feedback 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reading feedback (for admin dashboard)
CREATE POLICY "Anyone can view feedback" 
  ON public.feedback 
  FOR SELECT 
  USING (true);

-- Create index for better performance when querying by date
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);

-- Create index for feedback type
CREATE INDEX idx_feedback_type ON public.feedback(feedback_type);
