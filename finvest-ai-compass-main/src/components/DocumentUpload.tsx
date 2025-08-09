import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Link as LinkIcon, Type } from 'lucide-react';

interface DocumentUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFileUpload, uploadedFile }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <Card className="card-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-accent" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file" className="text-xs">File</TabsTrigger>
            <TabsTrigger value="text" className="text-xs">Text</TabsTrigger>
            <TabsTrigger value="url" className="text-xs">URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-accent bg-accent/5' 
                  : uploadedFile 
                  ? 'border-success bg-success/5'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <input {...getInputProps()} />
              {uploadedFile ? (
                <div className="space-y-2">
                  <FileText className="h-8 w-8 text-success mx-auto" />
                  <p className="font-medium text-success">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : isDragActive ? (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-accent mx-auto" />
                  <p className="text-accent">Drop the file here...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="font-medium">Drag & drop your document here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, DOCX, TXT, CSV (max 50MB)
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Paste your document text here..."
              className="min-h-[120px] resize-none"
              id="document-text"
            />
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => {
                const textArea = document.getElementById('document-text') as HTMLTextAreaElement;
                if (textArea?.value.trim()) {
                  // Create a virtual file from the text content
                  const textBlob = new Blob([textArea.value], { type: 'text/plain' });
                  const textFile = new File([textBlob], 'document.txt', { type: 'text/plain' });
                  onFileUpload(textFile);
                  textArea.value = '';
                }
              }}
            >
              <Type className="mr-2 h-4 w-4" />
              Process Text
            </Button>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://example.com/document.pdf"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <Button className="w-full" variant="outline">
              <LinkIcon className="mr-2 h-4 w-4" />
              Fetch Document
            </Button>
          </TabsContent>
        </Tabs>

        {uploadedFile && (
          <div className="mt-4 p-3 bg-muted/30 rounded-md">
            <h4 className="font-medium text-sm mb-2">Document Preview</h4>
            <p className="text-xs text-muted-foreground">
              {uploadedFile.name} • {uploadedFile.type} • Ready for analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;