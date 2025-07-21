import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUpload: (file: File, preview: string) => void;
  preview?: string;
  className?: string;
}

export default function ImageUpload({ onImageUpload, preview, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onImageUpload(file, result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const clearImage = () => {
    onImageUpload(null as any, '');
  };

  if (preview) {
    return (
      <Card className={`relative ${className}`}>
        <CardContent className="p-0">
          <img 
            src={preview} 
            alt="Uploaded preview" 
            className="w-full h-48 object-cover rounded-xl"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 border-dashed transition-colors ${
      isDragActive ? 'border-primary/50 bg-primary/5' : 'border-outline-variant bg-surface/30'
    } ${className}`}>
      <CardContent {...getRootProps()} className="p-12 text-center cursor-pointer">
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CloudUpload className="text-primary w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-on-surface mb-2">
              {isDragActive ? "Drop your image here" : "Drop your image here or browse"}
            </p>
            <p className="text-sm text-on-surface-variant">
              Supports JPG, PNG, WebP up to 10MB
            </p>
          </div>
          {!isDragActive && (
            <Button className="bg-primary text-white hover:shadow-md">
              Browse Files
            </Button>
          )}
          {isUploading && (
            <div className="text-sm text-on-surface-variant">Uploading...</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
