
-- Create storage bucket for user documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-documents', 'user-documents', false);

-- Storage policies: users can upload to their own folder
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create table for document metadata
CREATE TABLE public.user_uploaded_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('business-canvas', 'buyer-persona', 'product-roadmap')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_uploaded_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents"
ON public.user_uploaded_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
ON public.user_uploaded_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
ON public.user_uploaded_documents FOR DELETE
USING (auth.uid() = user_id);
