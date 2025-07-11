import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage?: { file: File; preview: string } | null;
  onRemoveImage?: () => void;
}

export function ImageUpload({ onImageSelect, selectedImage, onRemoveImage }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(file, e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (selectedImage) {
    return (
      <div className="relative">
        <div className="relative overflow-hidden rounded-xl border-2 border-border bg-gradient-card shadow-soft">
          <img 
            src={selectedImage.preview} 
            alt="Imagem selecionada" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-elegant"
          onClick={onRemoveImage}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="mt-3 text-center">
          <p className="text-sm text-muted-foreground">
            {selectedImage.file.name} ({(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Envie sua Imagem
      </label>
      
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 bg-gradient-card backdrop-blur-sm
          ${isDragOver 
            ? 'border-primary bg-primary/5 shadow-soft' 
            : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Clique para enviar ou arraste uma imagem
            </h3>
            <p className="text-sm text-muted-foreground">
              Formatos aceitos: PNG, JPG (máx. 10MB)
            </p>
          </div>
          
          <Button variant="outline" size="lg" className="pointer-events-none">
            <ImageIcon className="mr-2 h-4 w-4" />
            Escolher Arquivo
          </Button>
        </div>
      </div>
    </div>
  );
}