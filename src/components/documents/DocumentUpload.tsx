
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Upload, X, FileText, Image, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileWithPreview extends File {
  preview?: string;
}

interface DocumentUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  title?: string;
  description?: string;
}

const DocumentUpload = ({
  onUpload,
  maxFiles = 5,
  maxSizeMB = 5,
  acceptedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf'],
  title = 'Prześlij dokumenty',
  description = 'Prześlij zdjęcia lub dokumenty PDF. Maksymalny rozmiar: 5MB.',
}: DocumentUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const acceptedTypes = acceptedFileTypes.join(',');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (selectedFiles: File[]) => {
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: 'Za dużo plików',
        description: `Możesz przesłać maksymalnie ${maxFiles} plików jednocześnie.`,
        variant: 'destructive',
      });
      return;
    }

    const validFiles: FileWithPreview[] = [];
    
    selectedFiles.forEach(file => {
      // Check file size
      if (file.size > maxSizeBytes) {
        toast({
          title: 'Plik jest za duży',
          description: `Plik "${file.name}" przekracza maksymalny rozmiar ${maxSizeMB}MB.`,
          variant: 'destructive',
        });
        return;
      }
      
      // Check file type
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!acceptedFileTypes.includes(fileExtension)) {
        toast({
          title: 'Nieprawidłowy typ pliku',
          description: `Plik "${file.name}" jest nieprawidłowego typu. Dozwolone typy: ${acceptedFileTypes.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }
      
      // Create preview for images
      const fileWithPreview = file as FileWithPreview;
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      
      validFiles.push(fileWithPreview);
    });
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    setUploadSuccess(false); // Reset success state when new files are added
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      // Revoke the URL to prevent memory leaks
      if (updatedFiles[index].preview) {
        URL.revokeObjectURL(updatedFiles[index].preview!);
      }
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
    setUploadSuccess(false);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: 'Brak plików',
        description: 'Wybierz przynajmniej jeden plik do przesłania.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    try {
      await onUpload(files);
      setUploadSuccess(true);
      toast({
        title: 'Sukces!',
        description: `Przesłano ${files.length} ${files.length === 1 ? 'plik' : 'pliki'}.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Błąd przesyłania',
        description: 'Wystąpił problem podczas przesyłania plików. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearAll = () => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setUploadSuccess(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            files.length > 0 && "border-primary/50 bg-primary/5"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept={acceptedTypes}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-sm font-medium">
              {isDragging ? (
                <span className="text-primary">Upuść pliki tutaj</span>
              ) : (
                <>
                  <span className="text-primary">Kliknij aby wybrać</span> lub przeciągnij i upuść
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Dozwolone pliki: {acceptedFileTypes.join(', ')} (maks. {maxSizeMB}MB)
            </p>
            <p className="text-xs text-muted-foreground">
              Możesz przesłać maksymalnie {maxFiles} {maxFiles === 1 ? 'plik' : 'plików'}
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Wybrane pliki ({files.length}/{maxFiles})</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center p-2 border rounded-md bg-muted/30"
                >
                  <div className="mr-2 flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <Image className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="truncate font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className="flex items-center p-2 border rounded-md bg-green-50 text-green-800">
            <Check className="h-5 w-5 mr-2" />
            <span>Pliki zostały przesłane pomyślnie!</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={clearAll}
          disabled={files.length === 0 || isUploading}
        >
          Wyczyść wszystkie
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? 'Przesyłanie...' : 'Prześlij pliki'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUpload;
