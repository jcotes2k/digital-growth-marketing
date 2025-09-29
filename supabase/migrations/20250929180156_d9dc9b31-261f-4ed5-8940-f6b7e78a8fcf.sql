-- Create approval_workflows table
CREATE TABLE public.approval_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.editorial_calendar(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL,
  approver_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revision_requested')),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.approval_workflows ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their approval requests"
ON public.approval_workflows
FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = approver_id);

CREATE POLICY "Users can create approval requests"
ON public.approval_workflows
FOR INSERT
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Approvers can update approvals"
ON public.approval_workflows
FOR UPDATE
USING (auth.uid() = approver_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_approval_workflows_updated_at
BEFORE UPDATE ON public.approval_workflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();