-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_owner UUID NOT NULL,
  member_email TEXT NOT NULL,
  member_id UUID,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(workspace_owner, member_email)
);

-- Create task_assignments table
CREATE TABLE public.task_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.editorial_calendar(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL,
  assigned_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for team_members
CREATE POLICY "Owners can manage their team"
ON public.team_members
FOR ALL
USING (auth.uid() = workspace_owner);

CREATE POLICY "Members can view their workspace"
ON public.team_members
FOR SELECT
USING (auth.uid() = member_id OR auth.uid() = workspace_owner);

-- Policies for task_assignments
CREATE POLICY "Users can view their tasks"
ON public.task_assignments
FOR SELECT
USING (auth.uid() = assigned_to OR auth.uid() = assigned_by);

CREATE POLICY "Users can create task assignments"
ON public.task_assignments
FOR INSERT
WITH CHECK (auth.uid() = assigned_by);

CREATE POLICY "Users can update their assigned tasks"
ON public.task_assignments
FOR UPDATE
USING (auth.uid() = assigned_to OR auth.uid() = assigned_by);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_assignments_updated_at
BEFORE UPDATE ON public.task_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();