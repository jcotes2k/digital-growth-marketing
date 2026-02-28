import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, FileText, Trash2, Download, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type DocumentType = 'business-canvas' | 'buyer-persona' | 'product-roadmap';

interface UploadedDoc {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
}

interface DocumentUploadButtonProps {
  documentType: DocumentType;
  label?: string;
}

export const DocumentUploadButton = ({ documentType, label = 'Subir archivo' }: DocumentUploadButtonProps) => {
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_uploaded_documents' as any)
      .select('id, file_name, file_url, uploaded_at')
      .eq('user_id', user.id)
      .eq('document_type', documentType)
      .order('uploaded_at', { ascending: false });

    if (!error && data) setDocuments(data as unknown as UploadedDoc[]);
  };

  useEffect(() => {
    if (open) fetchDocuments();
  }, [open]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Debes iniciar sesión para subir archivos');
      return;
    }

    setUploading(true);
    const filePath = `${user.id}/${documentType}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('user-documents')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Error al subir el archivo');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('user-documents')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from('user_uploaded_documents' as any)
      .insert({
        user_id: user.id,
        document_type: documentType,
        file_name: file.name,
        file_url: filePath,
      } as any);

    if (insertError) {
      toast.error('Error al guardar el registro');
    } else {
      toast.success('Archivo subido correctamente');
      fetchDocuments();
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (doc: UploadedDoc) => {
    const { error: storageError } = await supabase.storage
      .from('user-documents')
      .remove([doc.file_url]);

    const { error: dbError } = await supabase
      .from('user_uploaded_documents' as any)
      .delete()
      .eq('id', doc.id);

    if (storageError || dbError) {
      toast.error('Error al eliminar');
    } else {
      toast.success('Archivo eliminado');
      fetchDocuments();
    }
  };

  const handleDownload = async (doc: UploadedDoc) => {
    const { data, error } = await supabase.storage
      .from('user-documents')
      .download(doc.file_url);

    if (error || !data) {
      toast.error('Error al descargar');
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.file_name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
      >
        <Upload className="h-4 w-4 mr-1" /> {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Archivos subidos
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.xlsx,.pptx"
                onChange={handleUpload}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
              </Button>
            </div>

            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay archivos subidos aún.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {documents.map(doc => (
                  <Card key={doc.id} className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm truncate">{doc.file_name}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(doc)}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(doc)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
