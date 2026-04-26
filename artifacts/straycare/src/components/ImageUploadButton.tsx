import { useState } from "react";
import { useUpload } from "@workspace/object-storage-web";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadButtonProps {
  onUploadSuccess: (objectPath: string) => void;
  onClear: () => void;
  currentPath: string | null;
}

export function ImageUploadButton({ onUploadSuccess, onClear, currentPath }: ImageUploadButtonProps) {
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      onUploadSuccess(response.objectPath);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  if (currentPath) {
    return (
      <div className="relative rounded-xl overflow-hidden border-2 border-primary/20 aspect-video max-w-sm group shadow-md">
        <img 
          src={`/api/storage${currentPath}`} 
          alt="Uploaded photo" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="rounded-full shadow-lg"
            onClick={onClear}
          >
            Remove Photo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 hover:bg-primary/5 hover:border-primary/50 transition-all flex flex-col items-center justify-center text-muted-foreground w-full group">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
      />
      {isUploading ? (
        <Loader2 className="w-10 h-10 animate-spin mb-3 text-primary" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-background shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <ImageIcon className="w-6 h-6 text-primary/70" />
        </div>
      )}
      <span className="text-sm font-semibold text-foreground">
        {isUploading ? "Uploading..." : "Click to upload a photo"}
      </span>
      {!isUploading && <span className="text-sm mt-1">Help volunteers recognize the dog</span>}
    </div>
  );
}
